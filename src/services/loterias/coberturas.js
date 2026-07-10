/** C(n, k) com proteção de overflow — satura em 1e14. */
export function comb(n, k) {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  k = Math.min(k, n - k);
  let r = 1;
  for (let i = 0; i < k; i++) {
    r = (r * (n - i)) / (i + 1);
    if (r > 1e14) return 1e14;
  }
  return Math.round(r);
}

/**
 * Viabilidade computacional de uma matriz g/a: C(N,min) × C(N,a) × min operações.
 * @returns {'ok'|'slow'|'infeasible'}
 */
export function feasibility(N, min, a) {
  const ops = comb(N, min) * comb(N, a) * min;
  if (ops <= 30_000_000) return 'ok';
  if (ops <= 300_000_000) return 'slow';
  return 'infeasible';
}

/**
 * Uma matriz é "trivial" quando a pior sobreposição possível entre qualquer talão
 * (que exclui N-min dezenas) e qualquer cenário-alvo (que exclui N-a dezenas) já
 * basta para atingir g: min+a-N >= g. Nesse caso QUALQUER talão de `min` dezenas
 * cobre 100% dos cenários sozinho — não é um fechamento de verdade (não reduz
 * nada, o resultado é sempre 1 talão), por isso é excluída da lista de opções.
 */
export function ehTrivial(N, min, g, a) {
  return min + a - N >= g;
}

/** Matrizes de fechamento disponíveis para N dezenas selecionadas (filtra inviáveis e triviais). */
export function getMatrices(N, min, sorteia, gMin = 2) {
  const gMax = Math.min(min, sorteia);
  const aMax = Math.min(N, sorteia);
  const pad = (n) => String(n).padStart(2, '0');
  const out = [];

  for (let g = gMin; g <= gMax; g++) {
    for (let a = g; a <= aMax; a++) {
      if (ehTrivial(N, min, g, a)) continue;
      const f = feasibility(N, min, a);
      if (f === 'infeasible') continue;
      out.push({
        id: `${pad(N)}-${pad(min)}-${pad(g)}-${pad(a)}`,
        g,
        a,
        feasibility: f,
        desc: `Garante ${g} pts se ${a} das ${N} saírem`,
      });
    }
  }
  return out;
}
