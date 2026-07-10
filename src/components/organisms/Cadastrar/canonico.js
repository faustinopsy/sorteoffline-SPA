/** Converte um Set/array de números em string canônica "03,07,12" (ordenada, zero-padded). */
export function paraCanonico(numeros) {
  return [...numeros]
    .sort((a, b) => a - b)
    .map((n) => String(n).padStart(2, '0'))
    .join(',');
}

/** Valida e converte as linhas de um arquivo .txt de talões. Lança Error na primeira linha inválida. */
export function validarTaloesDoArquivo(conteudo, minNumeros, maxNumeros) {
  const linhas = conteudo
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  if (!linhas.length) throw new Error('O arquivo está vazio.');

  return linhas.map((linha, i) => {
    const nums = linha.split(/[, ]+/).map(Number);
    if (nums.length !== minNumeros) {
      throw new Error(`Linha ${i + 1}: esperado ${minNumeros} números, encontrado ${nums.length}.`);
    }
    if (nums.some((n) => Number.isNaN(n) || n < 1 || n > maxNumeros)) {
      throw new Error(`Linha ${i + 1}: número fora do intervalo 01–${maxNumeros}.`);
    }
    return paraCanonico(nums);
  });
}
