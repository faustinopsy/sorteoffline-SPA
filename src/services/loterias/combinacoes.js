/**
 * Gera combinações de `tamanho` elementos de `arr`, parando ao atingir `limite`.
 * Não é uma amostra uniforme de todas as C(n,k): a busca para assim que
 * `limite` combinações forem encontradas (viés para as lexicograficamente primeiras).
 */
export function gerarCombinacoes(arr, tamanho, limite) {
  const resultados = [];

  function auxiliar(inicio, atual) {
    if (resultados.length >= limite) return;
    if (atual.length === tamanho) {
      resultados.push(atual);
      return;
    }
    for (let i = inicio; i <= arr.length - (tamanho - atual.length); i++) {
      auxiliar(i + 1, [...atual, arr[i]]);
    }
  }

  auxiliar(0, []);
  return resultados;
}

/** Sorteia `quantidade` combinações distintas (sem reposição) de um array. */
export function selecionarAleatorias(combinacoes, quantidade) {
  const selecionadas = [];
  const usados = new Set();

  while (selecionadas.length < quantidade && usados.size < combinacoes.length) {
    const idx = Math.floor(Math.random() * combinacoes.length);
    if (!usados.has(idx)) {
      usados.add(idx);
      selecionadas.push(combinacoes[idx]);
    }
  }
  return selecionadas;
}
