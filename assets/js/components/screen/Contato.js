export default class Contato {
    constructor(navigateCallback) {
        this.navigateCallback = navigateCallback;
    }

    init() {
        this.atualizaEstiloCabecalho();
    }

    atualizaEstiloCabecalho() {
        const h = document.querySelector('.app-header');
        if (h) {
            h.style.background = 'linear-gradient(160deg, #0a1628 0%, #1e3a5f 60%, #1a4a7a 100%)';
            h.style.boxShadow  = 'none';
        }
        const t = document.getElementById('titulo');
        if (t) t.textContent = 'Contato';
    }

    render() {
        const main = document.createElement('div');
        main.className = 'main';

        const wrap = document.createElement('div');
        wrap.className = 'pol-wrap';
        wrap.setAttribute('itemscope', '');
        wrap.setAttribute('itemtype', 'https://schema.org/ContactPage');

        // ── Hero ───────────────────────────────────────────────
        const hero = document.createElement('div');
        hero.className = 'pol-hero';
        hero.innerHTML = `
            <div class="pol-hero-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                </svg>
            </div>
            <h2 class="pol-hero-title">Fale Conosco</h2>
            <p class="pol-hero-sub">Dúvidas, sugestões e feedback são bem-vindos!</p>
        `;
        wrap.appendChild(hero);

        // ── Cards de contato ───────────────────────────────────
        const SVG = {
            mail:     `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
            code:     `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
            bug:      `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
            lightbulb:`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>`,
            warning:  `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
        };

        const sections = [
            {
                icon: SVG.mail,
                title: 'E-mail',
                content: `
                    <p>Para dúvidas, sugestões, reportar problemas ou qualquer assunto relacionado ao LMania:</p>
                    <p><a href="mailto:rodrigohipnose@gmail.com" class="contato-link"
                          itemprop="email">rodrigohipnose@gmail.com</a></p>
                    <p style="color:var(--text-dim);font-size:var(--fs-xs);margin-top:8px;">
                        Respondemos em até 48 horas úteis.
                    </p>
                `
            },
            {
                icon: SVG.code,
                title: 'Desenvolvedor',
                content: `
                    <p itemprop="author" itemscope itemtype="https://schema.org/Person">
                        <strong itemprop="name">Rodrigo Faustino</strong> — Desenvolvedor do LMania
                        <meta itemprop="email" content="rodrigohipnose@gmail.com">
                    </p>
                    <p>Desenvolvedor apaixonado por matemática combinatória e ferramentas de análise estatística.
                    O LMania é um projeto pessoal criado para democratizar o acesso a ferramentas matemáticas de qualidade.</p>
                `
            },
            {
                icon: SVG.bug,
                title: 'Reportar Problemas',
                content: `
                    <p>Encontrou um bug ou comportamento inesperado? Envie um e-mail descrevendo:</p>
                    <ul>
                        <li>O que aconteceu</li>
                        <li>O que você esperava que acontecesse</li>
                        <li>Seu dispositivo e navegador</li>
                        <li>Passos para reproduzir o problema</li>
                    </ul>
                    <p>Sua ajuda é fundamental para melhorar o LMania!</p>
                `
            },
            {
                icon: SVG.lightbulb,
                title: 'Sugestões de Melhoria',
                content: `
                    <p>Tem uma ideia para uma nova funcionalidade ou melhoria?
                    Adoramos ouvir sugestões da comunidade de apostadores.</p>
                    <p>Envie sua sugestão por e-mail com o assunto <strong>"Sugestão LMania"</strong>.</p>
                `
            },
            {
                icon: SVG.warning,
                title: 'Jogo Responsável',
                content: `
                    <p>O LMania é uma ferramenta educacional. Se você ou alguém que conhece precisar
                    de ajuda relacionada ao jogo compulsivo:</p>
                    <ul>
                        <li><strong>CVV (Centro de Valorização da Vida):</strong> 188</li>
                        <li><strong>Caixa — Central do Apostador:</strong> 0800 726 0101</li>
                    </ul>
                `
            },
        ];

        sections.forEach(s => {
            const card = document.createElement('div');
            card.className = 'pol-card';

            const header = document.createElement('div');
            header.className = 'pol-card-header';
            header.innerHTML = `
                <span class="pol-card-icon">${s.icon}</span>
                <span class="pol-card-title">${s.title}</span>
            `;

            const body = document.createElement('div');
            body.className = 'pol-card-body';
            body.innerHTML = s.content;

            card.append(header, body);
            wrap.appendChild(card);
        });

        const footer = document.createElement('p');
        footer.className   = 'pol-footer';
        footer.textContent = 'LMania — Ferramenta matemática gratuita para apostadores brasileiros.';
        wrap.appendChild(footer);

        main.appendChild(wrap);
        return { element: main, init: () => this.init() };
    }
}
