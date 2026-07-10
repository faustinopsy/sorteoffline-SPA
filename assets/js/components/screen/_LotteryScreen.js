import Footer from '../Footer.js';

/**
 * _LotteryScreen.js — Classe base para as 4 telas de loteria.
 * Subclasses apenas definem menuItems, gradient, cor e label.
 */

// Conteúdo educacional estático por loteria — indexável pelo Google
const LOTTERY_INFO = {
    'Mega-Sena': {
        intro: 'A <strong>Mega-Sena</strong> é a maior loteria do Brasil, criada em 1996 pela Caixa Econômica Federal. Para ganhar o prêmio máximo (sena), é necessário acertar os 6 números sorteados dentre 60 dezenas disponíveis.',
        stats: [
            { label: 'Dezenas no volante', value: '60' },
            { label: 'Números por jogo', value: '6 a 15' },
            { label: 'Sorteios por semana', value: '2 (Qua e Sáb)' },
            { label: 'Probabilidade (6 nº)', value: '1 em 50.063.860' },
        ],
        faq: [
            { q: 'Como funciona a Mega-Sena?', a: 'Você escolhe de 6 a 15 números de 1 a 60. Acertando 4, 5 ou 6 números você ganha nas faixas de quadra, quina ou sena.' },
            { q: 'O que é fechamento matemático?', a: 'É uma estrutura de múltiplos jogos que garante uma cobertura mínima: se N dezenas do seu grupo estiverem entre as sorteadas, ao menos um jogo terá a quantidade de acertos definida.' },
        ],
    },
    'Lotofácil': {
        intro: 'A <strong>Lotofácil</strong> é a loteria com melhores probabilidades de acerto do Brasil, criada em 2003. O apostador marca de 15 a 20 números de um total de 25 e concorre a prêmios acertando de 11 a 15 dezenas.',
        stats: [
            { label: 'Dezenas no volante', value: '25' },
            { label: 'Números por jogo', value: '15 a 20' },
            { label: 'Sorteios por semana', value: '5 (Seg a Sex)' },
            { label: 'Probabilidade (15 nº)', value: '1 em 3.268.760' },
        ],
        faq: [
            { q: 'Por que a Lotofácil é a mais fácil?', a: 'Você marca 15 de 25 números e precisa acertar apenas 11 para ganhar um prêmio. A probabilidade é muito maior do que em outras loterias.' },
            { q: 'Quantos jogos tem um fechamento?', a: 'Depende do fechamento. Jogar 16 números gera 16 jogos de 15 dezenas; jogar 20 números pode gerar centenas de jogos dependendo da estrutura utilizada.' },
        ],
    },
    'Quina': {
        intro: 'A <strong>Quina</strong> é uma das loterias mais tradicionais do Brasil, criada em 1994. O apostador escolhe de 5 a 15 números de um universo de 80 dezenas e concorre acertando 2, 3, 4 ou 5 números.',
        stats: [
            { label: 'Dezenas no volante', value: '80' },
            { label: 'Números por jogo', value: '5 a 15' },
            { label: 'Sorteios por semana', value: '5 (Seg a Sex)' },
            { label: 'Probabilidade (5 nº)', value: '1 em 24.040.016' },
        ],
        faq: [
            { q: 'Qual a diferença entre quina e quadra?', a: 'Na Quina, acertar 5 números é o prêmio máximo (quina). Acertar 4 é a quadra, 3 é o terno e 2 é a duquina — cada faixa tem seu prêmio.' },
            { q: 'Como o LMania ajuda na Quina?', a: 'O LMania permite cadastrar seus jogos, analisar a frequência histórica das dezenas e criar fechamentos matemáticos para maximizar a cobertura do seu grupo.' },
        ],
    },
    'Lotomania': {
        intro: 'A <strong>Lotomania</strong> é uma loteria única no Brasil: o apostador marca exatamente 50 números de um universo de 100 dezenas. Foram sorteados 20 números por concurso e você ganha acertando 15, 16, 17, 18, 19 ou 20 — ou até acertando zero!',
        stats: [
            { label: 'Dezenas no volante', value: '100' },
            { label: 'Números por jogo', value: 'Exatamente 50' },
            { label: 'Sorteios por semana', value: '2 (Ter e Sex)' },
            { label: 'Sorteados por concurso', value: '20 dezenas' },
        ],
        faq: [
            { q: 'O que significa acertar zero na Lotomania?', a: 'Se nenhuma das suas 50 dezenas estiver entre as 20 sorteadas, você também ganha um prêmio! Isso é exclusividade da Lotomania.' },
            { q: 'Como funciona o fechamento na Lotomania?', a: 'Você escolhe um grupo de 50 a 60 dezenas e o LMania gera múltiplos bilhetes de 50 números que garantem uma cobertura mínima definida matematicamente.' },
        ],
    },
};

export default class LotteryScreen {
    constructor(navigateCallback, lang) {
        this.navigateCallback = navigateCallback;
        this.userLanguage = lang;
        // Subclass must define:
        //   this.screenLabel  (string)  — ex: 'Mega-Sena'
        //   this.gradient     (string)  — CSS gradient
        //   this.glowColor    (string)  — box-shadow color
        //   this.accentColor  (string)  — hex color for accent bar
        //   this.menuItems    (array)   — [ {href, icon, text, key} ]
    }

    /** Called by subclass after setting fields */
    _setup() {
        this.loadLanguage();
        this.init();
    }

    loadLanguage() {
        const lang = this.userLanguage.split('-')[0];
        fetch(`/assets/js/lang/${lang}.json`)
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
            header.style.background = this.gradient;
            header.style.boxShadow  = 'none';
        }
        const titulo = document.getElementById('titulo');
        if (titulo) titulo.textContent = this.screenLabel;
    }

    render() {
        const wrapper = document.createElement('div');
        wrapper.className = 'main page-enter';

        /* Section eyebrow */
        const eyebrow = document.createElement('div');
        eyebrow.style.cssText = `
            width:100%; padding: 20px 16px 8px;
            font-size:10px; font-weight:700; letter-spacing:4px;
            color:var(--text-muted); text-transform:uppercase;
        `;
        eyebrow.textContent = 'O QUE DESEJA FAZER?';
        wrapper.appendChild(eyebrow);

        /* Card grid */
        const grid = document.createElement('div');
        grid.className = 'menu';

        this.menuItems.forEach(item => {
            const card = this._buildCard(item);
            grid.appendChild(card);
        });

        wrapper.appendChild(grid);

        /* Disclaimer */
        const disclaimer = this._buildDisclaimer();
        wrapper.appendChild(disclaimer);

        /* Conteúdo educacional estático (indexável pelo Google) */
        const info = LOTTERY_INFO[this.screenLabel];
        if (info) {
            const infoSection = this._buildInfoSection(info);
            wrapper.appendChild(infoSection);
        }

        /* Footer com links institucionais */
        const footer = new Footer(this.navigateCallback);
        wrapper.appendChild(footer.render());

        return { element: wrapper };
    }

    _buildDisclaimer() {
        const box = document.createElement('div');
        box.className = 'lottery-disclaimer';
        box.innerHTML = `
            <span class="lottery-disclaimer__icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
            </span>
            <p>Ferramenta educacional e matemática. Não garantimos ganhos.
            <a href="#" data-nav="politicas" class="lottery-disclaimer__link">Saiba mais.</a></p>
        `;
        box.addEventListener('click', e => {
            const link = e.target.closest('[data-nav]');
            if (link) { e.preventDefault(); this.navigateCallback(link.dataset.nav); }
        });
        return box;
    }

    _buildInfoSection(info) {
        const section = document.createElement('section');
        section.className = 'lottery-info';
        section.setAttribute('aria-label', `Sobre a ${this.screenLabel}`);

        // Introdução
        const intro = document.createElement('div');
        intro.className = 'lottery-info__intro';
        intro.innerHTML = `<p>${info.intro}</p>`;
        section.appendChild(intro);

        // Tabela de stats
        if (info.stats?.length) {
            const statsTitle = document.createElement('h3');
            statsTitle.className = 'lottery-info__subtitle';
            statsTitle.textContent = 'Dados da Loteria';
            section.appendChild(statsTitle);

            const statsGrid = document.createElement('div');
            statsGrid.className = 'lottery-stats';

            info.stats.forEach(stat => {
                const item = document.createElement('div');
                item.className = 'lottery-stats__item';
                item.innerHTML = `
                    <span class="lottery-stats__value">${stat.value}</span>
                    <span class="lottery-stats__label">${stat.label}</span>
                `;
                statsGrid.appendChild(item);
            });

            section.appendChild(statsGrid);
        }

        // FAQ
        if (info.faq?.length) {
            const faqTitle = document.createElement('h3');
            faqTitle.className = 'lottery-info__subtitle';
            faqTitle.textContent = 'Perguntas Frequentes';
            section.appendChild(faqTitle);

            const faqList = document.createElement('div');
            faqList.className = 'lottery-faq';
            faqList.setAttribute('itemscope', '');
            faqList.setAttribute('itemtype', 'https://schema.org/FAQPage');

            info.faq.forEach(item => {
                const entry = document.createElement('div');
                entry.className = 'lottery-faq__item';
                entry.setAttribute('itemscope', '');
                entry.setAttribute('itemprop', 'mainEntity');
                entry.setAttribute('itemtype', 'https://schema.org/Question');

                const q = document.createElement('p');
                q.className = 'lottery-faq__q';
                q.setAttribute('itemprop', 'name');
                q.textContent = item.q;

                const aWrap = document.createElement('div');
                aWrap.setAttribute('itemscope', '');
                aWrap.setAttribute('itemprop', 'acceptedAnswer');
                aWrap.setAttribute('itemtype', 'https://schema.org/Answer');

                const a = document.createElement('p');
                a.className = 'lottery-faq__a';
                a.setAttribute('itemprop', 'text');
                a.textContent = item.a;

                aWrap.appendChild(a);
                entry.appendChild(q);
                entry.appendChild(aWrap);
                faqList.appendChild(entry);
            });

            section.appendChild(faqList);
        }

        return section;
    }

    _buildCard(item) {
        const card = document.createElement('div');
        card.className = 'menu__item';
        card.setAttribute('role',     'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', item.ariaLabel || item.text);

        /* Accent bar top */
        const bar = document.createElement('div');
        bar.style.cssText = `
            position:absolute; top:0; left:0; right:0;
            height:3px; border-radius:24px 24px 0 0;
            background:${this.accentColor};
            opacity:0; transition:opacity 220ms ease;
        `;
        card.appendChild(bar);

        /* Icon — SVG inline ou imagem */
        let iconEl;
        if (item.svg) {
            iconEl = document.createElement('div');
            iconEl.className = 'menu__icon menu__icon--svg';
            iconEl.innerHTML = item.svg;
            iconEl.style.cssText += `border-color:${this.accentColor}33; color:${this.accentColor};`;
        } else {
            iconEl = document.createElement('img');
            iconEl.className = 'menu__icon';
            iconEl.src = item.icon || '';
            iconEl.alt = item.text;
            iconEl.style.borderColor = `${this.accentColor}33`;
        }

        /* Label */
        const label = document.createElement('span');
        label.style.cssText = `
            font-size:11px; font-weight:800;
            color:var(--text); letter-spacing:0.5px;
            text-transform:uppercase; text-align:center;
        `;
        label.setAttribute('data-i18n', item.key);
        label.textContent = item.text;

        card.appendChild(iconEl);
        card.appendChild(label);

        const go = () => this.navigateCallback(item.href);
        card.addEventListener('click', go);
        card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') go(); });
        card.addEventListener('mouseenter', () => { bar.style.opacity = '1'; });
        card.addEventListener('mouseleave', () => { bar.style.opacity = '0'; });

        return card;
    }
}
