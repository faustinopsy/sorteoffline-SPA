/**
 * Navbar.js — Bottom navigation com 3 itens: Início | Ferramentas | Config.
 * O botão central (Ferramentas) é elevado com o pill visual de destaque.
 */

const SVG = {
    inicio: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
               width="22" height="22">
               <rect x="3"  y="3"  width="7" height="7" rx="1.5"/>
               <rect x="14" y="3"  width="7" height="7" rx="1.5"/>
               <rect x="3"  y="14" width="7" height="7" rx="1.5"/>
               <rect x="14" y="14" width="7" height="7" rx="1.5"/>
             </svg>`,

    blog: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
               width="24" height="24">
               <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
               <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
               <line x1="9" y1="9" x2="15" y2="9"/>
               <line x1="9" y1="13" x2="15" y2="13"/>
             </svg>`,

    config: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
               width="22" height="22">
               <line x1="4"  y1="6"  x2="20" y2="6"/>
               <line x1="4"  y1="12" x2="20" y2="12"/>
               <line x1="4"  y1="18" x2="20" y2="18"/>
               <circle cx="8"  cy="6"  r="2.2" fill="currentColor" stroke="none"/>
               <circle cx="16" cy="12" r="2.2" fill="currentColor" stroke="none"/>
               <circle cx="8"  cy="18" r="2.2" fill="currentColor" stroke="none"/>
             </svg>`,
};

// Rotas que pertencem a cada aba da navbar
const INICIO_ROUTES  = new Set(['/', 'ferramentas', 'facil', 'mega', 'quina', 'mania',
    'cadfacil', 'cadmania', 'cadsena', 'cadquina',
    'listafacil', 'listarmania', 'listarsena', 'listarquina',
    'conferefacil', 'conferirmania', 'conferirsena', 'conferirquina',
    'combinacoesFacil', 'combinacoesMania', 'combinacoesSena', 'combinacoesQuina',
    'lotofacilpares', 'maniapares', 'megasenapares', 'quinapares',
    'analiseFacil', 'analiseMania', 'analiseSena', 'analiseQuina',
    'fechaFacil', 'fechaMania', 'fechaSena', 'fechaQuina']);
const BLOG_ROUTES    = new Set(['blog']);
const CONFIG_ROUTES  = new Set(['settings', 'politicas', 'privacidade', 'contato', 'about']);

export default class Navbar {
    constructor(navigateCallback) {
        this.navigateCallback = navigateCallback;
    }

    // ── Build ──────────────────────────────────────────────────────
    render() {
        const nav = document.createElement('nav');
        nav.id = 'navbar';
        nav.setAttribute('role',       'navigation');
        nav.setAttribute('aria-label', 'Navegação principal');

        nav.appendChild(this._buildSide('ferramentas', SVG.inicio, 'Início'));
        nav.appendChild(this._buildCenter('blog',   SVG.blog,     'Blog'));
        nav.appendChild(this._buildSide('settings', SVG.config,   'Config'));

        return nav;
    }

    _buildSide(href, svgHTML, label) {
        const link = document.createElement('a');
        link.href           = '#';
        link.dataset.link   = href;
        link.className      = 'nav-item';
        link.setAttribute('aria-label', label);

        const wrap = document.createElement('span');
        wrap.className = 'nav-item__icon-wrap';

        const icon = document.createElement('span');
        icon.className = 'nav-item__icon nav-item__icon--svg';
        icon.innerHTML = svgHTML;
        wrap.appendChild(icon);

        const lbl = document.createElement('span');
        lbl.className   = 'nav-item__label';
        lbl.textContent = label;

        link.append(wrap, lbl);
        link.addEventListener('click', e => { e.preventDefault(); this.navigateCallback(href); });
        return link;
    }

    _buildCenter(href, svgHTML, label) {
        const link = document.createElement('a');
        link.href           = '#';
        link.dataset.link   = href;
        link.className      = 'nav-item nav-item--home';
        link.setAttribute('aria-label', label);

        const pill = document.createElement('span');
        pill.className = 'home-pill';
        pill.innerHTML = svgHTML;
        link.appendChild(pill);

        link.addEventListener('click', e => { e.preventDefault(); this.navigateCallback(href); });
        return link;
    }

    // ── Comportamento ──────────────────────────────────────────────
    init() {
        const nav = document.getElementById('navbar');
        if (!nav) return;
        let last = 0;
        window.addEventListener('scroll', () => {
            const curr = window.pageYOffset;
            nav.style.bottom = curr > last && curr > 80 ? '-80px' : '0';
            last = curr;
        }, { passive: true });
    }

    /** Marca o item ativo mapeando qualquer rota à sua aba correspondente */
    setActive(href) {
        let activeHref;
        if (href === '/' || BLOG_ROUTES.has(href) || (typeof href === 'string' && href.startsWith('blog/')))
            activeHref = 'blog';
        else if (CONFIG_ROUTES.has(href)) activeHref = 'settings';
        else                              activeHref = 'ferramentas';

        const nav = document.getElementById('navbar');
        if (!nav) return;
        nav.querySelectorAll('.nav-item').forEach(el => {
            el.classList.toggle('active', el.dataset.link === activeHref);
        });
    }
}
