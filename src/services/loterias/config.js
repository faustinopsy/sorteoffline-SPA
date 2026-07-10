export const LOTERIAS = [
  {
    nome: 'Lotofácil',
    url: 'lotofacil',
    simb: 'facil',
    max: 25,
    min: 15,
    sorteia: 15,
    fechMin: 16,
    gMin: 11,
    preco: 3.5,
    accent: '#a855f7',
    gradient: 'linear-gradient(160deg, #2e1065 0%, #6b21a8 60%, #9333ea 100%)',
  },
  {
    nome: 'Lotomania',
    url: 'lotomania',
    simb: 'mania',
    max: 100,
    min: 50,
    sorteia: 20,
    fechMin: 55,
    gMin: 16,
    preco: 3.0,
    accent: '#ef4444',
    gradient: 'linear-gradient(160deg, #450a0a 0%, #991b1b 60%, #dc2626 100%)',
  },
  {
    nome: 'Mega-Sena',
    url: 'mega-sena',
    simb: 'mega',
    max: 60,
    min: 6,
    sorteia: 6,
    fechMin: 7,
    gMin: 4,
    preco: 6.0,
    accent: '#22c55e',
    gradient: 'linear-gradient(160deg, #052e16 0%, #166534 60%, #15803d 100%)',
  },
  {
    nome: 'Quina',
    url: 'quina',
    simb: 'quina',
    max: 80,
    min: 5,
    sorteia: 5,
    fechMin: 6,
    gMin: 2,
    preco: 1.5,
    accent: '#3b82f6',
    gradient: 'linear-gradient(160deg, #172554 0%, #1d4ed8 60%, #3b82f6 100%)',
  },
];

/** slug da API da Caixa (nome sem acento/hífen: lotofacil, lotomania, megasena, quina) */
export function apiSlug(loteria) {
  return loteria.url === 'mega-sena' ? 'megasena' : loteria.url;
}

export function porUrl(url) {
  return LOTERIAS.find((l) => l.url === url);
}
