import { buscarResultado } from '../../../services/resultados.js';

/** Busca o último concurso e retrocede `quantidade - 1` (usa o cache de resultados.js). */
export async function buscarUltimosConcursos(loteriaApi, quantidade, aoProgredir) {
  const ultimo = await buscarResultado(loteriaApi);
  if (!ultimo) throw new Error('Não foi possível conectar à API da Caixa. Verifique sua conexão.');

  const numeroUltimo = parseInt(ultimo.numero, 10);
  const concursos = [ultimo];

  for (let i = 1; i < quantidade; i++) {
    const alvo = numeroUltimo - i;
    if (alvo < 1) break;
    aoProgredir?.(i, quantidade - 1);
    const resultado = await buscarResultado(loteriaApi, String(alvo));
    if (resultado) concursos.push(resultado);
  }
  return concursos;
}
