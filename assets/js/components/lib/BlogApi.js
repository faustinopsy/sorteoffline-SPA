/**
 * BlogApi.js — Cliente HTTP para o backend de blog.
 * Desacoplado: funciona para qualquer backend que implemente /api/blog/*.
 */
export default class BlogApi {
    constructor(lang = 'pt') {
        this.lang = lang;
        // Se estiver em localhost, aponta para a porta 8000 do backend
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        this.baseUrl  = isLocal ? 'http://localhost:8000' : 'https://api.lmania.com.br';
        this.cacheKey = `lmania_blog_cache_${lang}`;
    }

    /**
     * Busca lista de posts. Usa cache localStorage para suporte offline.
     */
    async getPosts() {
        const cached = localStorage.getItem(this.cacheKey);
        if (cached) {
            try { return JSON.parse(cached); } catch { /* cache corrompido */ }
        }

        const res = await fetch(`${this.baseUrl}/posts?lang=${this.lang}`);
        if (!res.ok) throw new Error(`Blog API HTTP ${res.status}`);
        const posts = await res.json();

        localStorage.setItem(this.cacheKey, JSON.stringify(posts));
        return posts;
    }

    /**
     * Busca post por ID numérico.
     */
    async getPost(id) {
        const cacheKey = `lmania_post_id_${id}`;
        const cached   = localStorage.getItem(cacheKey);
        if (cached) {
            try { return JSON.parse(cached); } catch { /* ignore */ }
        }

        const res = await fetch(`${this.baseUrl}/post/${id}`);
        if (!res.ok) throw new Error(`Post ${id} not found`);
        const post = await res.json();
        localStorage.setItem(cacheKey, JSON.stringify(post));
        return post;
    }

    /**
     * Busca post por slug SEO-friendly.
     */
    async getPostBySlug(slug) {
        const cacheKey = `lmania_post_slug_${slug}_${this.lang}`;
        const cached   = localStorage.getItem(cacheKey);
        if (cached) {
            try { return JSON.parse(cached); } catch { /* ignore */ }
        }

        const res = await fetch(`${this.baseUrl}/post/slug/${slug}?lang=${this.lang}`);
        if (!res.ok) throw new Error(`Post "${slug}" not found`);
        const post = await res.json();
        localStorage.setItem(cacheKey, JSON.stringify(post));
        return post;
    }

    /**
     * Invalida o cache da listagem (chamar ao trocar idioma).
     */
    invalidateCache() {
        localStorage.removeItem(this.cacheKey);
    }
}
