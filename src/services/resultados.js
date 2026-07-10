import { fetchJson } from './http.js';

// Cache eterno: resultado de concurso passado é imutável.
const chaveCache = (loteria, concurso) => `resultado-${loteria}-${concurso}`;

/**
 * Busca o resultado de um concurso da Caixa (cache-first).
 * @param {string} loteria - slug da API (ex.: 'lotofacil')
 * @param {string} concurso - número do concurso; '' = último disponível
 */
export async function buscarResultado(loteria, concurso = '') {
  const chave = chaveCache(loteria, concurso || 'ultimo');
  const cache = localStorage.getItem(chave);
  if (cache) return JSON.parse(cache);

  const url = `https://servicebus2.caixa.gov.br/portaldeloterias/api/${loteria}/${concurso}`;
  const resultado = await fetchJson(url);

  localStorage.setItem(chave, JSON.stringify(resultado));
  if (concurso === '' && resultado?.numero) {
    localStorage.setItem(chaveCache(loteria, resultado.numero), JSON.stringify(resultado));
  }
  return resultado;
}
