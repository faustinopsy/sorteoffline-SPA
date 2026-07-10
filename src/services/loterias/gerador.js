/** Gera um jogo aleatório válido para a loteria (string canônica, zero-padded). */
export function jogoAleatorio(loteria) {
  const dezenas = new Set();
  while (dezenas.size < loteria.min) {
    dezenas.add(1 + Math.floor(Math.random() * loteria.max));
  }
  return [...dezenas]
    .sort((a, b) => a - b)
    .map((n) => String(n).padStart(2, '0'))
    .join(',');
}
