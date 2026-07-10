import { ICONS } from './icons.js';
import Footer from './Footer.js';

/**
 * Home.js — Tela inicial com grid de loterias.
 * Design: cards escuros com hover 3D, ícones circulares e labels.
 */
export default class MenuGenerator {
    constructor(navigateCallback, lang) {
        this.navigateCallback = navigateCallback;
        this.menuItems = [
            {
                href: 'facil', icon: '/assets/img/lotofacil.png',
                text: 'Lotofácil', sub: '11 a 15 números', key: 'LOTOFACIL',
                color: '#a855f7',
            },
            {
                href: 'mega', icon: '/assets/img/megasena.png',
                text: 'Mega-Sena', sub: '4 a 6 números', key: 'MEGASENA',
                color: '#22c55e',
            },
            {
                href: 'quina', icon: '/assets/img/quina.png',
                text: 'Quina', sub: '3 a 5 números', key: 'QUINA',
                color: '#3b82f6',
            },
            {
                href: 'mania', icon: '/assets/img/lotomania.png',
                text: 'Lotomania', sub: '16 a 20 números', key: 'LOTOMANIA',
                color: '#ef4444',
            },
        ];
        this.userLanguage = lang;
        this.loadLanguage();
        this.init();
    }

    loadLanguage() {
        const lang = this.userLanguage.split('-')[0];
        fetch(`assets/js/lang/${lang}.json`)
            .then(r => r.ok ? r.json() : {})
            .then(translations => {
                document.querySelectorAll('[data-i18n]').forEach(el => {
                    const k = el.getAttribute('data-i18n');
                    if (translations[k]) el.textContent = translations[k];
                });
            })
            .catch(() => {});
    }

    init() {
        this.atualizaEstiloCabecalho();
    }

    atualizaEstiloCabecalho() {
        const header = document.querySelector('.app-header');
        if (header) {
            header.style.background = 'linear-gradient(160deg, #0f172a 0%, #1e3a5f 50%, #0f4c81 100%)';
            header.style.boxShadow  = 'none';
        }
        const titulo = document.getElementById('titulo');
        if (titulo) titulo.textContent = 'Boa Sorte! 🍀';
    }

    render() {
        const wrapper = document.createElement('div');
        wrapper.className = 'main page-enter';

        /* ── Hero banner ───────────────────────────────────────── */
        const hero = document.createElement('div');
        hero.style.cssText = `
            width:100%; text-align:center;
            padding: 24px 16px 8px;
        `;
        const heroTitle = document.createElement('p');
        heroTitle.style.cssText = `
            font-size:11px; font-weight:700; letter-spacing:4px;
            color:var(--text-muted); text-transform:uppercase;
            margin-bottom:6px;
        `;
        heroTitle.textContent = 'ESCOLHA SUA LOTERIA';
        hero.appendChild(heroTitle);
        wrapper.appendChild(hero);

        /* ── Card grid ─────────────────────────────────────────── */
        const grid = document.createElement('div');
        grid.className = 'menu';

        this.menuItems.forEach(item => {
            const card = this._buildCard(item);
            grid.appendChild(card);
        });

        wrapper.appendChild(grid);

        /* Footer com links institucionais */
        const footer = new Footer(this.navigateCallback);
        wrapper.appendChild(footer.render());

        return { element: wrapper };
    }

    _buildCard(item) {
        const card = document.createElement('div');
        card.className = 'menu__item';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `Abrir ${item.text}`);

        /* Colored top bar */
        const bar = document.createElement('div');
        bar.style.cssText = `
            position:absolute; top:0; left:0; right:0;
            height:3px; border-radius:24px 24px 0 0;
            background:${item.color};
            opacity:0; transition:opacity 220ms ease;
        `;
        card.appendChild(bar);

        /* Icon — SVG inline ou imagem */
        let img;
        if (item.svg) {
            img = document.createElement('div');
            img.className = 'menu__icon menu__icon--svg';
            img.innerHTML = item.svg;
            img.style.cssText += `border-color:${item.color}33; color:${item.color};`;
        } else {
            img = document.createElement('img');
            img.className = 'menu__icon';
            img.src = item.icon || '';
            img.alt = item.text;
            img.style.borderColor = `${item.color}33`;
        }

        /* Text group */
        const textWrap = document.createElement('div');
        textWrap.style.textAlign = 'center';

        const name = document.createElement('span');
        name.style.cssText = `
            display:block; font-size:12px; font-weight:800;
            color:var(--text); letter-spacing:0.4px;
            text-transform:uppercase;
        `;
        name.setAttribute('data-i18n', item.key);
        name.textContent = item.text;

        const sub = document.createElement('span');
        sub.style.cssText = `
            display:block; font-size:10px; font-weight:500;
            color:var(--text-muted); margin-top:2px;
        `;
        sub.textContent = item.sub;

        textWrap.appendChild(name);
        textWrap.appendChild(sub);
        card.appendChild(img);
        card.appendChild(textWrap);

        /* Interaction */
        const go = () => this.navigateCallback(item.href);
        card.addEventListener('click', go);
        card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') go(); });
        card.addEventListener('mouseenter', () => { bar.style.opacity = '1'; });
        card.addEventListener('mouseleave', () => { bar.style.opacity = '0'; });

        return card;
    }
}
