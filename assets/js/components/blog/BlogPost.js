import BlogApi from '../lib/BlogApi.js';
import Footer from '../Footer.js';

/**
 * BlogPost.js — Tela de leitura de um post individual.
 * Aceita slug (SEO) ou ID numérico como identificador.
 */
export default class BlogPost {
    constructor(slugOrId, navigateCallback, lang = 'pt') {
        this.slugOrId = slugOrId;
        this.navigate = navigateCallback;
        this.lang = (lang || 'pt').split('-')[0].toLowerCase();
    }

    render() {
        const container = document.createElement('div');
        container.className = 'main blog-post-view';

        const btnVoltar = document.createElement('button');
        btnVoltar.type        = 'button';
        btnVoltar.className   = 'btn blog-back-btn';
        btnVoltar.textContent = '← Voltar ao Blog';
        btnVoltar.setAttribute('aria-label', 'Voltar para a lista do Blog');
        btnVoltar.addEventListener('click', () => this.navigate('blog'));

        const content = document.createElement('div');
        content.className = 'blog-post-content';
        this._contentEl = content;

        const loading = document.createElement('p');
        loading.className   = 'blog-loading';
        loading.textContent = 'Carregando artigo...';
        content.appendChild(loading);

        container.appendChild(btnVoltar);
        container.appendChild(content);

        const footer = new Footer(this.navigate);
        container.appendChild(footer.render());

        return { element: container, init: () => this.init() };
    }

    async init() {
        this.atualizaEstiloCabecalho();
        const el = this._contentEl;
        try {
            const api      = new BlogApi(this.lang);
            const isNumeric = /^\d+$/.test(String(this.slugOrId));
            const post      = isNumeric
                ? await api.getPost(this.slugOrId)
                : await api.getPostBySlug(this.slugOrId);

            document.title = `${post.title} | LMania Blog`;
            this._updateMetaTags(post);
            this._injectJsonLd(post);

            el.innerHTML = '';
            this.renderPost(post, el);
        } catch {
            if (el) {
                el.innerHTML = '';
                const errP = document.createElement('div');
                errP.className = 'blog-error';

                const icon = document.createElement('span');
                icon.textContent = '😕';
                icon.style.cssText = 'font-size:2rem;display:block;margin-bottom:8px;';

                const msg = document.createElement('p');
                msg.textContent = 'Artigo não encontrado ou sem conexão.';

                const btn = document.createElement('button');
                btn.className   = 'btn blog-back-btn';
                btn.textContent = '← Voltar ao Blog';
                btn.style.marginTop = '16px';
                btn.addEventListener('click', () => this.navigate('blog'));

                errP.appendChild(icon);
                errP.appendChild(msg);
                errP.appendChild(btn);
                el.appendChild(errP);
            }
        }
    }

    renderPost(post, el) {
        // Categoria
        const cat = document.createElement('div');
        cat.className   = 'blog-post__category';
        cat.textContent = post.category || '';

        // Título
        const title = document.createElement('h1');
        title.className   = 'blog-post__title';
        title.textContent = post.title;

        // Meta (autor + data)
        const meta = document.createElement('div');
        meta.className = 'blog-post__meta';
        meta.setAttribute('itemscope', '');
        meta.setAttribute('itemtype', 'https://schema.org/Person');

        const author = document.createElement('span');
        author.setAttribute('itemprop', 'name');
        author.textContent = post.author || 'LMania';

        const sep = document.createElement('span');
        sep.textContent = ' · ';
        sep.setAttribute('aria-hidden', 'true');

        const date = document.createElement('span');
        date.textContent = post.date || '';

        const readTime = this._calcReadTime(post.content || post.excerpt || '');
        const timeEl = document.createElement('span');
        timeEl.textContent = ` · ${readTime} min de leitura`;
        timeEl.style.color = 'var(--text-dim)';

        meta.appendChild(author);
        meta.appendChild(sep);
        meta.appendChild(date);
        meta.appendChild(timeEl);

        // Divisor
        const hr = document.createElement('hr');
        hr.className = 'blog-post__divider';

        // Corpo do artigo — suporta HTML básico vindo da API
        const body = document.createElement('div');
        body.className = 'blog-post__body';
        const rawContent = post.content || post.excerpt || '';
        // Se o conteúdo tem tags HTML, usa innerHTML sanitizado; senão usa textContent
        if (/<[a-z][\s\S]*>/i.test(rawContent)) {
            body.innerHTML = this._sanitize(rawContent);
        } else {
            // Texto plano: converte quebras de linha em parágrafos
            rawContent.split(/\n\n+/).forEach(para => {
                if (!para.trim()) return;
                const p = document.createElement('p');
                p.textContent = para.trim();
                body.appendChild(p);
            });
        }

        el.appendChild(cat);
        el.appendChild(title);
        el.appendChild(meta);
        el.appendChild(hr);
        el.appendChild(body);
    }

    /** Sanitiza HTML permitindo apenas tags seguras e sem event handlers */
    _sanitize(html) {
        const allowed = new Set(['P','H2','H3','H4','STRONG','B','EM','I','UL','OL','LI','A','BLOCKQUOTE','CODE','PRE','BR','HR','IMG']);
        const template = document.createElement('template');
        template.innerHTML = html;
        const root = template.content;

        const walk = node => {
            const children = [...node.childNodes];
            children.forEach(child => {
                if (child.nodeType === Node.ELEMENT_NODE) {
                    if (!allowed.has(child.tagName)) {
                        // Substitui o elemento pelo seu conteúdo de texto
                        child.replaceWith(document.createTextNode(child.textContent));
                        return;
                    }
                    // Remove atributos perigosos
                    [...child.attributes].forEach(attr => {
                        const name = attr.name.toLowerCase();
                        if (name.startsWith('on') || (name === 'href' && /^javascript:/i.test(attr.value))) {
                            child.removeAttribute(attr.name);
                        }
                    });
                    // Forçar links externos a abrir em nova aba de forma segura
                    if (child.tagName === 'A') {
                        child.setAttribute('target', '_blank');
                        child.setAttribute('rel', 'noopener noreferrer');
                    }
                    walk(child);
                }
            });
        };

        walk(root);

        const div = document.createElement('div');
        div.appendChild(root);
        return div.innerHTML;
    }

    /** Estima tempo de leitura em minutos */
    _calcReadTime(text) {
        const words = text.trim().split(/\s+/).length;
        return Math.max(1, Math.round(words / 200));
    }

    /** Atualiza meta description e og:title para o post atual */
    _updateMetaTags(post) {
        const excerpt = post.excerpt || (post.content || '').slice(0, 160);

        const desc = document.querySelector('meta[name="description"]');
        if (desc) desc.setAttribute('content', excerpt);

        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', `${post.title} | LMania Blog`);

        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute('content', excerpt);

        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.setAttribute('content', `https://lmania.com.br/blog/${post.slug || post.id}`);
    }

    /** Injeta JSON-LD Article para SEO */
    _injectJsonLd(post) {
        // Remove JSON-LD anterior se houver
        document.getElementById('blog-jsonld')?.remove();

        const schema = {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.excerpt || '',
            author: {
                '@type': 'Person',
                name: post.author || 'Rodrigo Faustino',
            },
            publisher: {
                '@type': 'Organization',
                name: 'LMania',
                url: 'https://lmania.com.br',
            },
            datePublished: post.date || '',
            dateModified: post.updated_at || post.date || '',
            url: `https://lmania.com.br/blog/${post.slug || post.id}`,
            inLanguage: 'pt-BR',
            articleSection: post.category || 'Loterias',
            keywords: `loterias, ${post.category || ''}, ${post.title}`,
        };

        const script = document.createElement('script');
        script.id   = 'blog-jsonld';
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
    }

    atualizaEstiloCabecalho() {
        const cabecalho = document.querySelector('.app-header');
        if (cabecalho) {
            cabecalho.style.background = 'var(--grad-blog, linear-gradient(135deg, #0c0a09, #292524, #57534e))';
        }
        const t = document.getElementById('titulo');
        if (t) t.textContent = 'Blog';
    }
}
