/** Conta quantos números do jogo aparecem entre os sorteados. */
export function contarAcertos(meus, sorteados) {
  return meus.filter((n) => sorteados.includes(n)).length;
}

/**
 * Confere uma lista de jogos (strings canônicas) contra as dezenas sorteadas,
 * retornando cada jogo com seus acertos, ordenados do maior para o menor.
 */
export function conferir(jogosCanonicos, sorteados) {
  return jogosCanonicos
    .map((numeros, index) => ({
      numeros,
      acertos: contarAcertos(numeros.split(',').map(Number), sorteados),
      index,
    }))
    .sort((a, b) => b.acertos - a.acertos);
}
