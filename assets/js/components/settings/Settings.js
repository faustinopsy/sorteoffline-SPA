import { THEMES, DEFAULT_THEME } from './themes.js';

/**
 * Settings.js — Painel de configurações sem tabs.
 * Seções: PALETAS · FONTE
 */
export default class Settings {
    constructor(navigateCallback, onApplyTheme, onApplyFontSize) {
        this.navigate        = navigateCallback;
        this.onApplyTheme    = onApplyTheme;
        this.onApplyFontSize = onApplyFontSize;

        const saved = localStorage.getItem('lmania_theme');
        this.selectedTheme = saved ? JSON.parse(saved) : DEFAULT_THEME;
        this.selectedFont  = parseInt(localStorage.getItem('lmania_font_size') || '100', 10);
    }

    render() {
        const container = document.createElement('div');
        container.className = 'main settings-view';

        container.appendChild(this._buildThemeSection());
        container.appendChild(this._buildFontSection());

        return { element: container, init: () => this._initHeader() };
    }

    _buildThemeSection() {
        const section = document.createElement('div');
        section.className = 'settings-section';

        const title = document.createElement('p');
        title.className   = 'settings-section__title';
        title.textContent = 'Paletas';
        section.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'theme-grid';

        THEMES.forEach(theme => {
            const btn = document.createElement('button');
            btn.type      = 'button';
            btn.className = 'theme-btn' + (theme.name === this.selectedTheme.name ? ' active' : '');
            btn.setAttribute('aria-label', `Aplicar tema ${theme.name}`);

            // Mini swatch — small colored square representing the theme
            const swatch = document.createElement('div');
            swatch.style.cssText = `
                width: 100%; height: 36px;
                border-radius: 6px; margin-bottom: 6px;
                background: ${theme.bg};
                border: 1.5px solid ${theme.border};
                display: flex; align-items: center; justify-content: center; gap: 4px;
            `;

            const makeCircle = color => {
                const c = document.createElement('span');
                c.style.cssText = `
                    width: 8px; height: 8px; border-radius: 50%;
                    background: ${color}; flex-shrink: 0;
                `;
                return c;
            };
            swatch.appendChild(makeCircle(theme.primary));
            swatch.appendChild(makeCircle(theme.accent));
            swatch.appendChild(makeCircle(theme.text));

            const name = document.createElement('span');
            name.style.cssText = `
                display: block; font-size: 9px; font-weight: 700;
                letter-spacing: 0.3px; text-align: center;
                color: var(--text-muted); white-space: nowrap; overflow: hidden;
                text-overflow: ellipsis;
            `;
            name.textContent = theme.name;

            btn.appendChild(swatch);
            btn.appendChild(name);

            btn.addEventListener('click', () => {
                this.selectedTheme = theme;
                this.onApplyTheme(theme);
                grid.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });

            grid.appendChild(btn);
        });

        section.appendChild(grid);
        return section;
    }

    _buildFontSection() {
        const section = document.createElement('div');
        section.className = 'settings-section';

        const title = document.createElement('p');
        title.className   = 'settings-section__title';
        title.textContent = 'Fonte';
        section.appendChild(title);

        const sizes = [90, 95, 100, 105, 110, 115];
        const grid  = document.createElement('div');
        grid.className = 'font-size-grid';

        sizes.forEach(size => {
            const btn = document.createElement('button');
            btn.type      = 'button';
            btn.className = 'font-size-btn' + (size === this.selectedFont ? ' active' : '');

            // Show "Aa" scaled to the size + percentage label
            btn.innerHTML = `
                <span style="display:block;font-size:${Math.round(size * 0.13)}px;font-weight:800;line-height:1;">Aa</span>
                <span style="display:block;font-size:10px;font-weight:600;margin-top:2px;opacity:0.7;">${size}%</span>
            `;

            btn.addEventListener('click', () => {
                this.selectedFont = size;
                this.onApplyFontSize(size);
                grid.querySelectorAll('.font-size-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });

            grid.appendChild(btn);
        });

        section.appendChild(grid);
        return section;
    }

    _initHeader() {
        const header = document.querySelector('.app-header');
        if (header) {
            header.style.background = 'linear-gradient(135deg, #0f0f0f 0%, #374151 60%, #6b7280 100%)';
        }
        const titulo = document.getElementById('titulo');
        if (titulo) titulo.textContent = 'Configurações';
    }
}
