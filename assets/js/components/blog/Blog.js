import BlogApi from '../lib/BlogApi.js';
import Footer from '../Footer.js';

/**
 * Blog.js — Listagem de posts com filtro por categoria.
 * Segue o contrato obrigatório de componente LMania (render + init).
 */
export default class Blog {
    constructor(navigateCallback, lang = 'pt') {
        this.navigate = navigateCallback;
        this.lang     = lang;
        this.posts    = [];
    }

    render() {
        const container = document.createElement('div');
        container.className = 'main blog-view';

        const header = document.createElement('div');
        header.className = 'blog-header';

        const title = document.createElement('h2');
        title.className   = 'blog-header__title';
        title.textContent = 'Blog';

        const subtitle = document.createElement('p');
        subtitle.className   = 'blog-header__subtitle';
        subtitle.textContent = 'Artigos & Estratégias';

        header.appendChild(title);
        header.appendChild(subtitle);

        const filters = document.createElement('div');
        filters.id        = 'blog-filters';
        filters.className = 'blog-filters';

        const list = document.createElement('div');
        list.id        = 'blog-list';
        list.className = 'blog-list';

        const loading = document.createElement('p');
        loading.id        = 'blog-loading';
        loading.className = 'blog-loading';
        loading.textContent = 'Carregando artigos...';
        list.appendChild(loading);

        const footer = new Footer(this.navigate);

        container.appendChild(header);
        container.appendChild(filters);
        container.appendChild(list);
        container.appendChild(footer.render());

        return { element: container, init: () => this.init() };
    }

    async init() {
        this.atualizaEstiloCabecalho();
        try {
            const api  = new BlogApi(this.lang);
            this.posts = await api.getPosts();
            this.renderFilters();
            this.renderPosts('all');
        } catch {
            const list    = document.getElementById('blog-list');
            const loading = document.getElementById('blog-loading');
            if (loading) loading.remove();
            if (list) {
                const err = document.createElement('p');
                err.className   = 'blog-error';
                err.textContent = 'Erro ao carregar artigos. Verifique sua conexão.';
                list.appendChild(err);
            }
        }
    }

    renderFilters() {
        const filtersEl = document.getElementById('blog-filters');
        if (!filtersEl) return;

        const categories = ['all', ...new Set(this.posts.map(p => p.category).filter(Boolean))];

        categories.forEach((cat, i) => {
            const btn = document.createElement('button');
            btn.type             = 'button';
            btn.textContent      = cat === 'all' ? 'Todos' : cat;
            btn.className        = 'blog-filter-btn' + (i === 0 ? ' active' : '');
            btn.dataset.filter   = cat;
            btn.setAttribute('aria-label', `Filtrar por ${cat === 'all' ? 'todos' : cat}`);

            btn.addEventListener('click', () => {
                filtersEl.querySelectorAll('.blog-filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.renderPosts(cat);
            });

            filtersEl.appendChild(btn);
        });
    }

    renderPosts(filter = 'all') {
        const list = document.getElementById('blog-list');
        if (!list) return;

        // Remover loading
        const loading = document.getElementById('blog-loading');
        if (loading) loading.remove();

        list.innerHTML = '';

        const filtered = filter === 'all'
            ? this.posts
            : this.posts.filter(p => p.category === filter);

        if (filtered.length === 0) {
            const empty = document.createElement('p');
            empty.className   = 'blog-empty';
            empty.textContent = 'Nenhum artigo encontrado nesta categoria.';
            list.appendChild(empty);
            return;
        }

        filtered.forEach(post => {
            const card = document.createElement('article');
            card.className = 'blog-card';
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `Leia: ${post.title}`);

            const cat = document.createElement('div');
            cat.className   = 'blog-card__category';
            cat.textContent = post.category || '';

            const titleEl = document.createElement('h3');
            titleEl.className   = 'blog-card__title';
            titleEl.textContent = post.title;   // textContent: safe contra XSS

            const excerpt = document.createElement('p');
            excerpt.className   = 'blog-card__excerpt';
            excerpt.textContent = post.excerpt || '';

            const meta = document.createElement('div');
            meta.className = 'blog-card__meta';

            const author = document.createElement('span');
            author.textContent = post.author || '';

            const date = document.createElement('span');
            date.textContent = post.date || '';

            meta.appendChild(author);
            meta.appendChild(date);

            card.appendChild(cat);
            card.appendChild(titleEl);
            card.appendChild(excerpt);
            card.appendChild(meta);

            // Navegar com slug (SEO) ou ID como fallback
            const target = post.slug ? `blog/${post.slug}` : `blog_post_${post.id}`;
            card.addEventListener('click', () => this.navigate(target));
            card.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') this.navigate(target);
            });

            list.appendChild(card);
        });
    }

    atualizaEstiloCabecalho() {
        const cabecalho = document.querySelector('.app-header');
        if (cabecalho) {
            cabecalho.style.background = 'var(--grad-blog, linear-gradient(135deg, #0c0a09, #292524, #57534e))';
            cabecalho.style.boxShadow  = 'none';
        }
    }
}
