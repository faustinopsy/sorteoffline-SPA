/**
 * Politicas.js — Políticas de Uso e Isenção de Responsabilidade do LMania.
 */
export default class Politicas {
    constructor(navigateCallback) {
        this.navigateCallback = navigateCallback;
    }

    init() {
        this.atualizaEstiloCabecalho();
    }

    atualizaEstiloCabecalho() {
        const h = document.querySelector('.app-header');
        if (h) {
            h.style.background = 'linear-gradient(160deg, #1c0f00 0%, #92400e 60%, #d97706 100%)';
            h.style.boxShadow  = 'none';
        }
        const t = document.getElementById('titulo');
        if (t) t.textContent = 'Políticas de Uso';
    }

    render() {
        const main = document.createElement('div');
        main.className = 'main';

        const wrap = document.createElement('div');
        wrap.className = 'pol-wrap';

        // ── Cabeçalho da página ────────────────────────────────
        const hero = document.createElement('div');
        hero.className = 'pol-hero';
        hero.innerHTML = `
            <div class="pol-hero-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17" stroke-width="2.5"/>
                </svg>
            </div>
            <h2 class="pol-hero-title">LMania</h2>
            <p class="pol-hero-sub">Políticas de Uso & Isenção de Responsabilidade</p>
        `;
        wrap.appendChild(hero);

        // ── Seções de conteúdo ─────────────────────────────────
        const sections = [
            {
                icon: '⚠',
                title: 'Isenção de Responsabilidade',
                highlight: true,
                content: `
                    <p>O <strong>LMania</strong> é uma ferramenta matemática de apoio ao apostador.
                    <strong>Nenhum ganho financeiro é garantido</strong> pelo uso deste aplicativo.</p>
                    <p>Os desdobramentos e fechamentos condicionais são estruturas matemáticas que
                    aumentam a cobertura de combinações possíveis, reduzindo a aleatoriedade —
                    mas <strong>não eliminam o acaso</strong> inerente aos jogos de loteria.</p>
                    <p>O LMania não tem qualquer vínculo com a Caixa Econômica Federal, com os
                    organizadores das loterias ou com qualquer outra entidade reguladora.</p>
                `,
            },
            {
                icon: '🎲',
                title: 'O que são Desdobramentos e Fechamentos?',
                content: `
                    <p>Um <strong>desdobramento</strong> é a geração de múltiplos jogos a partir de
                    um conjunto maior de dezenas selecionadas, garantindo que certas combinações
                    sejam sempre cobertas.</p>
                    <p>Um <strong>fechamento condicional</strong> (<em>N-min-g-a</em>) é uma coleção
                    de cartões tal que, se pelo menos <em>a</em> das suas <em>N</em> dezenas forem
                    sorteadas, ao menos um cartão terá <em>g</em> acertos.</p>
                    <p>Isso <strong>aumenta as chances</strong> dentro do conjunto selecionado, mas
                    não garante que as dezenas certas estarão na sua seleção.</p>
                `,
            },
            {
                icon: '🛡',
                title: 'Jogo Responsável',
                content: `
                    <p>Aposte apenas o que você pode perder. A loteria é um entretenimento,
                    não uma forma de renda ou investimento.</p>
                    <ul>
                        <li>Estabeleça um limite de gastos mensais;</li>
                        <li>Nunca use dinheiro reservado para necessidades básicas;</li>
                        <li>Se sentir que o jogo está causando problemas, busque ajuda.</li>
                    </ul>
                    <p>Central de Atendimento ao Apostador (Caixa): <strong>0800 726 0101</strong></p>
                `,
            },
            {
                icon: '🔒',
                title: 'Privacidade e Dados',
                content: `
                    <p>O LMania funciona <strong>100% localmente</strong> no seu dispositivo.
                    Todos os seus talões e configurações são armazenados apenas no
                    <code>localStorage</code> do navegador — <strong>nenhum dado é enviado
                    a servidores de terceiros</strong>.</p>
                    <p>Os resultados dos concursos são buscados diretamente na API pública da
                    Caixa Econômica Federal e cacheados localmente para uso offline.</p>
                `,
            },
            {
                icon: 'ℹ',
                title: 'Sobre o LMania',
                content: `
                    <p><strong>LMania</strong> é um Progressive Web App (PWA) gratuito,
                    desenvolvido para apostadores que desejam organizar e analisar seus jogos
                    com mais método.</p>
                    <p>Funcionalidades disponíveis: cadastro de talões, conferência automática de
                    resultados, geração de combinações, fechamentos condicionais, análise estatística
                    e gráficos de frequência.</p>
                    <p style="color:var(--text-dim);font-size:var(--fs-xs)">
                        Versão 1.0 · © ${new Date().getFullYear()} LMania ·
                        Desenvolvido por Rodrigo Faustino
                    </p>
                `,
            },
        ];

        sections.forEach(s => {
            const card = document.createElement('div');
            card.className = 'pol-card' + (s.highlight ? ' pol-card--warn' : '');

            const header = document.createElement('div');
            header.className = 'pol-card-header';
            header.innerHTML = `
                <span class="pol-card-icon">${s.icon}</span>
                <span class="pol-card-title">${s.title}</span>
            `;

            const body = document.createElement('div');
            body.className = 'pol-card-body';
            body.innerHTML  = s.content;

            card.append(header, body);
            wrap.appendChild(card);
        });

        // ── Rodapé ─────────────────────────────────────────────
        const footer = document.createElement('p');
        footer.className   = 'pol-footer';
        footer.textContent = 'Ao utilizar o LMania você concorda com os termos acima.';
        wrap.appendChild(footer);

        main.appendChild(wrap);
        return { element: main, init: () => this.init() };
    }
}
