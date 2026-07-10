import { useEffect } from 'react';

/** Define title + meta description da página atual. */
export function useSeo(titulo, descricao) {
  useEffect(() => {
    if (titulo) document.title = titulo;
    if (descricao) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', descricao);
    }
  }, [titulo, descricao]);
}
