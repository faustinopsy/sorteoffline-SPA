/**
 * icons.js — Ícones SVG inline para os menus do app.
 * Todos usam stroke="currentColor" e se adaptam à cor do contexto.
 */
const S = (d) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="1.7"
          stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;

export const ICONS = {

    /** Conferir — prancheta com check */
    conferir: S(`
        <path d="M9 11l3 3 8-8"/>
        <path d="M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2h9"/>
        <polyline points="15 3 16 3 20 3"/>
    `),

    /** Listar — documento com linhas */
    listar: S(`
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <line x1="7" y1="8"  x2="17" y2="8"/>
        <line x1="7" y1="12" x2="17" y2="12"/>
        <line x1="7" y1="16" x2="13" y2="16"/>
    `),

    /** Cadastrar — arquivo com + */
    cadastrar: S(`
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="12" y1="13" x2="12" y2="19"/>
        <line x1="9"  y1="16" x2="15" y2="16"/>
    `),

    /** Combinações — setas de embaralhar */
    combinacoes: S(`
        <polyline points="16 3 21 3 21 8"/>
        <line x1="4" y1="20" x2="21" y2="3"/>
        <polyline points="21 16 21 21 16 21"/>
        <line x1="15" y1="15" x2="21" y2="21"/>
        <line x1="4"  y1="4"  x2="9"  y2="9"/>
    `),

    /** Atualizar — setas circulares de refresh */
    atualizar: S(`
        <polyline points="23 4 23 10 17 10"/>
        <polyline points="1 20 1 14 7 14"/>
        <path d="M3.51 9a9 9 0 0114.85-3.36L23 10"/>
        <path d="M20.49 15a9 9 0 01-14.85 3.36L1 14"/>
    `),

    /** Análise — gráfico de barras com linha de tendência */
    analise: S(`
        <line x1="2"  y1="20" x2="22" y2="20"/>
        <rect x="4"  y="14" width="4" height="6" rx="1"/>
        <rect x="10" y="8"  width="4" height="12" rx="1"/>
        <rect x="16" y="4"  width="4" height="16" rx="1"/>
        <polyline points="5 14 11 8 17 4" stroke-dasharray="2 2"/>
    `),

    /** Blog — artigo/documento com dog-ear */
    blog: S(`
        <path d="M4 22h14a2 2 0 002-2V7.5L14.5 2H6a2 2 0 00-2 2v3"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="2" y1="12" x2="12" y2="12"/>
        <line x1="2" y1="16" x2="12" y2="16"/>
        <line x1="2" y1="20" x2="8"  y2="20"/>
        <path d="M2 10V8a2 2 0 012-2"/>
    `),

    /** Alerta / Políticas — triângulo de atenção com escudo */
    alerta: S(`
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17" stroke-width="2.5"/>
    `),

    /** Fechamento — grade de combinações com escudo de garantia */
    fechamento: S(`
        <rect x="2" y="3" width="8" height="8" rx="1"/>
        <rect x="14" y="3" width="8" height="8" rx="1"/>
        <rect x="2" y="13" width="8" height="8" rx="1"/>
        <rect x="14" y="13" width="8" height="8" rx="1"/>
        <path d="M7 7h.01M17 7h.01M7 17h.01M17 17h.01" stroke-width="2.5"/>
        <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" opacity=".25"/>
        <path d="M10.5 12l1 1 2-2" stroke-width="1.5"/>
    `),

    /** Config — sliders de equalização */
    config: S(`
        <line x1="4"  y1="6"  x2="20" y2="6"/>
        <line x1="4"  y1="12" x2="20" y2="12"/>
        <line x1="4"  y1="18" x2="20" y2="18"/>
        <circle cx="8"  cy="6"  r="2.2" fill="currentColor" stroke="none"/>
        <circle cx="16" cy="12" r="2.2" fill="currentColor" stroke="none"/>
        <circle cx="8"  cy="18" r="2.2" fill="currentColor" stroke="none"/>
    `),
};
