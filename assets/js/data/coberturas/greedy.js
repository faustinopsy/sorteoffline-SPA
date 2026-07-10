/**
 * greedy.js — Algoritmo guloso para geração de fechamentos condicionais.
 * Gera um conjunto mínimo de cartões que garante g acertos se a das N dezenas saírem.
 */

/** C(n, k) com proteção de overflow — retorna 1e14 se > 1e14 */
export function comb(n, k) {
    if (k < 0 || k > n) return 0;
    if (k === 0 || k === n) return 1;
    k = Math.min(k, n - k);
    let r = 1;
    for (let i = 0; i < k; i++) {
        r = r * (n - i) / (i + 1);
        if (r > 1e14) return 1e14;
    }
    return Math.round(r);
}

/** Gera todas as k-combinações de arr */
function combinations(arr, k) {
    const result = [];
    const go = (start, cur) => {
        if (cur.length === k) { result.push(cur.slice()); return; }
        for (let i = start; i <= arr.length - (k - cur.length); i++) {
            cur.push(arr[i]);
            go(i + 1, cur);
            cur.pop();
        }
    };
    go(0, []);
    return result;
}

/** Conta elementos em comum entre candidate (array) e targetSet (Set) */
function intersectSize(candidate, targetSet) {
    let n = 0;
    for (const x of candidate) if (targetSet.has(x)) n++;
    return n;
}

/**
 * Avalia a viabilidade computacional da matriz.
 * Baseia-se em: C(N,min) × C(N,a) × min ≈ operações por passo do greedy.
 * @returns {'ok' | 'slow' | 'infeasible'}
 */
export function feasibility(N, min, a) {
    const ops = comb(N, min) * comb(N, a) * min;
    if (ops <= 30_000_000)  return 'ok';
    if (ops <= 300_000_000) return 'slow';
    return 'infeasible';
}

/**
 * Retorna as matrizes disponíveis para N dezenas selecionadas.
 * Filtra automaticamente as inviáveis para cálculo em tempo real.
 * @param {number} N      - dezenas selecionadas pelo usuário
 * @param {number} min    - dezenas por cartão (mínimo da loteria)
 * @param {number} draws  - dezenas que a loteria sorteia
 * @param {number} gMin   - acertos mínimos premiados da loteria (piso de g)
 * @returns {Array<{id, g, a, feasibility, desc}>}
 */
export function getMatrices(N, min, draws, gMin = 2) {
    const gMax = Math.min(min, draws);
    const aMax = Math.min(N, draws);
    const pad  = n => String(n).padStart(2, '0');
    const out  = [];

    for (let g = gMin; g <= gMax; g++) {
        for (let a = g; a <= aMax; a++) {
            const f = feasibility(N, min, a);
            if (f === 'infeasible') continue;
            out.push({
                id:          `${pad(N)}-${pad(min)}-${pad(g)}-${pad(a)}`,
                g, a,
                feasibility: f,
                desc:        `Garante ${g} pts se ${a} das ${N} saírem`,
            });
        }
    }
    return out;
}

/**
 * Gera o fechamento condicional pelo método guloso (greedy set cover).
 * A cada passo escolhe o cartão que cobre o maior número de cenários ainda não cobertos.
 *
 * @param {number[]} dezenas   - N dezenas selecionadas, ordenadas
 * @param {number}   min       - dezenas por cartão (mínimo da loteria)
 * @param {number}   g         - acertos mínimos garantidos
 * @param {number}   a         - condição: se exatamente a das N dezenas saírem
 * @param {number}   maxTickets- limite de talões (padrão 100)
 * @param {number}   timeoutMs - timeout em ms antes de retornar resultado parcial
 * @returns {{ tickets: number[][], total: number, covered: number, timedOut: boolean }}
 */
export function generateCovering(dezenas, min, g, a, maxTickets = 100, timeoutMs = 8_000) {
    const targets    = combinations(dezenas, a);
    const candidates = combinations(dezenas, min);

    if (!targets.length || !candidates.length) {
        return { tickets: [], total: 0, covered: 0, timedOut: false };
    }

    const covered    = new Uint8Array(targets.length);   // 0 = uncovered
    const targetSets = targets.map(t => new Set(t));     // Sets para O(min) intersectSize
    let uncovered    = targets.length;
    const tickets    = [];
    const deadline   = performance.now() + timeoutMs;
    let timedOut     = false;

    while (uncovered > 0 && tickets.length < maxTickets) {
        let bestCi = -1, bestScore = 0;

        // Encontra o candidato que cobre mais cenários ainda não cobertos
        for (let ci = 0; ci < candidates.length; ci++) {
            // Verifica timeout a cada 100 candidatos para não bloquear demais
            if (ci % 100 === 0 && performance.now() > deadline) {
                timedOut = true;
                break;
            }
            let score = 0;
            for (let ti = 0; ti < targets.length; ti++) {
                if (!covered[ti] && intersectSize(candidates[ci], targetSets[ti]) >= g) score++;
            }
            if (score > bestScore) { bestScore = score; bestCi = ci; }
        }

        if (timedOut || bestCi < 0 || bestScore === 0) break;

        // Adiciona o melhor candidato e marca os cenários que ele cobre
        tickets.push(candidates[bestCi]);
        for (let ti = 0; ti < targets.length; ti++) {
            if (!covered[ti] && intersectSize(candidates[bestCi], targetSets[ti]) >= g) {
                covered[ti] = 1;
                uncovered--;
            }
        }
    }

    return {
        tickets,
        total:   targets.length,
        covered: targets.length - uncovered,
        timedOut,
    };
}
