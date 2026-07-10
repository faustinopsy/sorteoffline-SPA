/** Proporção fixos/rotativos para a geração de "jogos elite" por frequência. */
export function proporcoes(min) {
  if (min <= 6) return { qtdFixos: min - 2, qtdRotativos: 2 };
  if (min <= 20) return { qtdFixos: min - 3, qtdRotativos: 3 };
  return { qtdFixos: min - 6, qtdRotativos: 6 };
}

function combinacoesDe(arr, k) {
  const resultado = [];
  const backtrack = (inicio, combo) => {
    if (combo.length === k) {
      resultado.push([...combo]);
      return;
    }
    for (let i = inicio; i < arr.length; i++) {
      combo.push(arr[i]);
      backtrack(i + 1, combo);
      combo.pop();
    }
  };
  backtrack(0, []);
  return resultado;
}

/** Pega o primeiro, o último e 4 igualmente espaçados — até 6 combinações. */
export function selecionarDistribuidas(combinacoes) {
  const total = combinacoes.length;
  if (total <= 6) return combinacoes;

  const indices = new Set([0, total - 1]);
  const passo = Math.floor(total / 5);
  for (let i = 1; i <= 4; i++) indices.add(Math.min(i * passo, total - 1));

  return [...indices].slice(0, 6).map((idx) => combinacoes[idx]);
}

/** Gera 6 jogos: base fixa (fortes) + combinações rotativas dos médios. */
export function gerarJogosElite(fortes, medios, qtdRotativos, tamanhoPiscina) {
  const piscina = medios.slice(0, tamanhoPiscina);
  const todasCombinacoes = combinacoesDe(piscina, qtdRotativos);
  const selecionadas = selecionarDistribuidas(todasCombinacoes);

  return selecionadas.map((combo) => {
    const jogoCompleto = [...fortes, ...combo].sort((a, b) => a - b);
    return jogoCompleto.map((n) => String(n).padStart(2, '0')).join(',');
  });
}
