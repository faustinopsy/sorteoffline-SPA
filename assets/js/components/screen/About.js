export default class AboutScreen {
    constructor(lang) {
        this.userLanguage = lang;
    }

    init() {
        this.atualizaEstiloCabecalho();
    }

    atualizaEstiloCabecalho() {
        const header = document.querySelector('.app-header');
        if (header) {
            header.style.background = 'linear-gradient(160deg, #0c1a2e 0%, #1a3a5c 60%, #1e4976 100%)';
            header.style.boxShadow  = 'none';
        }
        const titulo = document.getElementById('titulo');
        if (titulo) titulo.textContent = 'Sobre o LMania';
    }

    render() {
        const main = document.createElement('div');
        main.className = 'main';

        const wrap = document.createElement('div');
        wrap.className = 'about-wrap';
        wrap.setAttribute('itemscope', '');
        wrap.setAttribute('itemtype', 'https://schema.org/WebApplication');

        // ── Hero ───────────────────────────────────────────────
        const hero = document.createElement('div');
        hero.className = 'about-hero';
        hero.innerHTML = `
            <div class="about-hero__logo">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="52" height="52">
                    <circle cx="24" cy="24" r="22" fill="rgba(59,130,246,0.15)" stroke="rgba(59,130,246,0.5)" stroke-width="1.5"/>
                    <text x="24" y="32" text-anchor="middle" font-size="22" font-weight="900" fill="#3b82f6" font-family="system-ui,sans-serif">L</text>
                </svg>
            </div>
            <h1 class="about-hero__name" itemprop="name">LMania</h1>
            <p class="about-hero__tagline" itemprop="description">
                Ferramenta matemática gratuita para apostadores inteligentes de loterias brasileiras.
            </p>
        `;
        wrap.appendChild(hero);

        // ── Seções ─────────────────────────────────────────────
        const SVG = {
            target:  `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
            book:    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
            tool:    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
            user:    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
            lock:    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
            info:    `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
        };

        // ── Disclaimer educacional ─────────────────────────────
        const disclaimer = document.createElement('div');
        disclaimer.className = 'about-disclaimer';
        disclaimer.innerHTML = `
            <span class="about-disclaimer__icon">${SVG.info}</span>
            <p>O LMania é uma <strong>ferramenta educacional e matemática</strong>.
            Não facilitamos apostas reais — apenas organizamos, analisamos e geramos combinações.
            Aposte com responsabilidade.</p>
        `;
        wrap.appendChild(disclaimer);

        const sections = [
            {
                icon: SVG.target,
                title: 'Nossa Missão',
                content: `
                    <p>O LMania nasceu da ideia simples de que os apostadores merecem ferramentas matemáticas de qualidade, gratuitas e acessíveis.</p>
                    <p>Nossa missão é ajudar você a <strong>organizar seus jogos com método</strong>, entender a matemática por trás das loterias e tomar decisões mais conscientes sobre como jogar.</p>
                `
            },
            {
                icon: SVG.book,
                title: 'História do Projeto',
                content: `
                    <p>O LMania foi criado em 2024 por <strong>Rodrigo Faustino</strong>, desenvolvedor apaixonado por matemática combinatória e estatística aplicada.</p>
                    <p>O projeto começou como uma ferramenta pessoal para organizar jogos da Lotofácil e evoluiu para um Progressive Web App completo, com suporte a <strong>Mega-Sena, Lotofácil, Quina e Lotomania</strong>.</p>
                    <p>Hoje o LMania oferece fechamentos condicionais, análise estatística, gráficos de frequência e conferência automática de resultados — tudo rodando <strong>100% no seu dispositivo</strong>, sem coleta de dados.</p>
                `
            },
            {
                icon: SVG.tool,
                title: 'O que o LMania faz',
                content: `
                    <ul>
                        <li><strong>Cadastro de talões</strong> — Registre seus jogos e mantenha tudo organizado</li>
                        <li><strong>Conferência automática</strong> — Confira seus jogos com os resultados oficiais da Caixa</li>
                        <li><strong>Geração de combinações</strong> — Crie desdobramentos matemáticos personalizados</li>
                        <li><strong>Fechamentos condicionais</strong> — Estruturas matemáticas que garantem cobertura mínima</li>
                        <li><strong>Análise estatística</strong> — Frequência de dezenas, pares/ímpares e muito mais</li>
                        <li><strong>Blog educacional</strong> — Artigos sobre probabilidade, estratégia e matemática das loterias</li>
                    </ul>
                `
            },
            {
                icon: SVG.user,
                title: 'Sobre o Desenvolvedor',
                content: `
                    <p><strong>Rodrigo Faustino</strong> é desenvolvedor de software com experiência em PHP, JavaScript e desenvolvimento de Progressive Web Apps.</p>
                    <p>Apaixonado por matemática combinatória e estatística, criou o LMania para colocar ferramentas profissionais de análise ao alcance de todos, de forma gratuita e sem barreiras.</p>
                    <p itemprop="author" itemscope itemtype="https://schema.org/Person">
                        <meta itemprop="name" content="Rodrigo Faustino">
                        <meta itemprop="email" content="rodrigohipnose@gmail.com">
                    </p>
                `
            },
            {
                icon: SVG.lock,
                title: 'Privacidade & Dados',
                content: `
                    <p>O LMania funciona <strong>100% localmente</strong> no seu dispositivo.</p>
                    <p>Todos os seus talões e configurações são armazenados apenas no <code>localStorage</code> do navegador — <strong>nenhum dado pessoal é enviado a servidores de terceiros</strong>.</p>
                    <p>Os resultados dos concursos são buscados diretamente na <strong>API pública da Caixa Econômica Federal</strong> e cacheados localmente para uso offline.</p>
                `
            },
        ];

        sections.forEach(s => {
            const card = document.createElement('div');
            card.className = 'about-card';

            const header = document.createElement('div');
            header.className = 'about-card__header';
            header.innerHTML = `
                <span class="about-card__icon">${s.icon}</span>
                <h2 class="about-card__title">${s.title}</h2>
            `;

            const body = document.createElement('div');
            body.className = 'about-card__body';
            body.innerHTML = s.content;

            card.append(header, body);
            wrap.appendChild(card);
        });

        // ── Versão ─────────────────────────────────────────────
        const footer = document.createElement('p');
        footer.className = 'about-footer';
        footer.innerHTML = `Versão 1.0 · © ${new Date().getFullYear()} LMania · Desenvolvido por Rodrigo Faustino
            <br><a href="#" data-nav="privacidade" class="about-footer__link">Política de Privacidade</a> ·
            <a href="#" data-nav="politicas" class="about-footer__link">Termos de Uso</a> ·
            <a href="#" data-nav="contato" class="about-footer__link">Contato</a>
        `;
        wrap.appendChild(footer);

        main.appendChild(wrap);
        return { element: main, init: () => this.init() };
    }
}
