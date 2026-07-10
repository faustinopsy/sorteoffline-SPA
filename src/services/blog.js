import { fetchJson } from './http.js';

const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const BASE_URL = isLocal ? 'https://api.lmania.com.br' : 'https://api.lmania.com.br';

function cacheado(chave, fetcher) {
  const cache = localStorage.getItem(chave);
  if (cache) {
    try {
      return Promise.resolve(JSON.parse(cache));
    } catch {
      /* cache corrompido, refaz busca */
    }
  }
  return fetcher().then((dados) => {
    localStorage.setItem(chave, JSON.stringify(dados));
    return dados;
  });
}

export function listarPosts(lang = 'pt') {
  return cacheado(`lmania_blog_cache_${lang}`, () => fetchJson(`${BASE_URL}/posts?lang=${lang}`));
}

export function buscarPost(id) {
  return cacheado(`lmania_post_id_${id}`, () => fetchJson(`${BASE_URL}/post/${id}`));
}

export function buscarPostPorSlug(slug, lang = 'pt') {
  return cacheado(`lmania_post_slug_${slug}_${lang}`, () =>
    fetchJson(`${BASE_URL}/post/slug/${slug}?lang=${lang}`)
  );
}
