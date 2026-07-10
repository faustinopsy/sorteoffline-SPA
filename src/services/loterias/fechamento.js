function combinacoesDe(arr, k) {
  const result = [];
  const go = (start, cur) => {
    if (cur.length === k) {
      result.push(cur.slice());
      return;
    }
    for (let i = start; i <= arr.length - (k - cur.length); i++) {
      cur.push(arr[i]);
      go(i + 1, cur);
      cur.pop();
    }
  };
  go(0, []);
  return result;
}

function tamanhoInterseccao(candidato, alvoSet) {
  let n = 0;
  for (const x of candidato) if (alvoSet.has(x)) n++;
  return n;
}

/**
 * Fechamento condicional via greedy set-cover: a cada passo escolhe o cartão
 * que cobre o maior número de cenários (`a`-subconjuntos) ainda não cobertos.
 * @returns {{ tickets: number[][], total: number, covered: number, timedOut: boolean }}
 */
export function fechar(dezenas, min, g, a, maxTickets = 100, timeoutMs = 8_000) {
  const alvos = combinacoesDe(dezenas, a);
  const candidatos = combinacoesDe(dezenas, min);

  if (!alvos.length || !candidatos.length) {
    return { tickets: [], total: 0, covered: 0, timedOut: false };
  }

  const cobertos = new Uint8Array(alvos.length);
  const alvoSets = alvos.map((t) => new Set(t));
  let naoCobertos = alvos.length;
  const tickets = [];
  const prazo = performance.now() + timeoutMs;
  let timedOut = false;

  while (naoCobertos > 0 && tickets.length < maxTickets) {
    let melhorCi = -1;
    let melhorScore = 0;

    for (let ci = 0; ci < candidatos.length; ci++) {
      if (ci % 100 === 0 && performance.now() > prazo) {
        timedOut = true;
        break;
      }
      let score = 0;
      for (let ti = 0; ti < alvos.length; ti++) {
        if (!cobertos[ti] && tamanhoInterseccao(candidatos[ci], alvoSets[ti]) >= g) score++;
      }
      if (score > melhorScore) {
        melhorScore = score;
        melhorCi = ci;
      }
    }

    if (timedOut || melhorCi < 0 || melhorScore === 0) break;

    tickets.push(candidatos[melhorCi]);
    for (let ti = 0; ti < alvos.length; ti++) {
      if (!cobertos[ti] && tamanhoInterseccao(candidatos[melhorCi], alvoSets[ti]) >= g) {
        cobertos[ti] = 1;
        naoCobertos--;
      }
    }
  }

  return {
    tickets,
    total: alvos.length,
    covered: alvos.length - naoCobertos,
    timedOut,
  };
}
