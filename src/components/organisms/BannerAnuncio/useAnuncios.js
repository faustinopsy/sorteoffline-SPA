import { useEffect, useState } from 'react';
import { fetchJson } from '../../../services/http.js';

const ANUNCIOS_URL = 'https://kibusao.com/public/api/anuncios.php';

/** Busca e faz o rodízio dos anúncios do BannerAnuncio. */
export function useAnuncios() {
  const [config, setConfig] = useState(null);
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    let ativo = true;
    fetchJson(ANUNCIOS_URL)
      .then((dados) => {
        if (ativo) setConfig(dados);
      })
      .catch(() => {
        if (ativo) setConfig(null);
      });
    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    if (!config?.anuncios || config.anuncios.length < 2) return;
    const intervalo = Math.max(config.intervaloMs || 6000, 2000);
    const id = setInterval(() => {
      setIndice((i) => (i + 1) % config.anuncios.length);
    }, intervalo);
    return () => clearInterval(id);
  }, [config]);

  if (!config || config.habilitado === false || !config.anuncios?.length) return null;
  return config.anuncios[indice % config.anuncios.length];
}
