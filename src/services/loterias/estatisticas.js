/** Conta pares e ímpares num conjunto de dezenas sorteadas. */
export function contarParesImpares(numeros) {
  const pares = numeros.filter((n) => n % 2 === 0).length;
  return { pares, impares: numeros.length - pares };
}

/** Frequência de cada dezena (1..max) através de vários concursos. */
export function frequenciaDezenas(concursos, max) {
  const freq = {};
  for (let i = 1; i <= max; i++) freq[i] = 0;

  concursos.forEach((c) => {
    const dezenas = c.listaDezenas || c.dezenas || [];
    dezenas.forEach((n) => {
      const num = parseInt(n, 10);
      if (Object.prototype.hasOwnProperty.call(freq, num)) freq[num]++;
    });
  });
  return freq;
}

/** Ordena dezenas por frequência decrescente; empate resolvido pelo menor número. */
export function rankearNumeros(freq) {
  return Object.keys(freq)
    .map((n) => ({ numero: parseInt(n, 10), qtd: freq[n] }))
    .sort((a, b) => b.qtd - a.qtd || a.numero - b.numero);
}
