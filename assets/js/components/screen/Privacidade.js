export default class Privacidade {
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
        if (t) t.textContent = 'Política de Privacidade';
    }

    render() {
        const main = document.createElement('div');
        main.className = 'main';

        const wrap = document.createElement('div');
        wrap.className = 'pol-wrap';

        // ── Hero ───────────────────────────────────────────────
        const hero = document.createElement('div');
        hero.className = 'pol-hero';
        hero.innerHTML = `
            <div class="pol-hero-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
            </div>
            <h2 class="pol-hero-title">LMania</h2>
            <p class="pol-hero-sub">Política de Privacidade</p>
            <p class="pol-hero-date">Última atualização: maio de 2026</p>
        `;
        wrap.appendChild(hero);

        const SVG = {
            fileText: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
            database: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`,
            globe:    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
            shield:   `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
            wifi:     `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>`,
            link:     `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
            users:    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
            edit:     `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
            mail:     `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
        };

        const sections = [
            {
                icon: SVG.fileText,
                title: '1. Introdução',
                content: `
                    <p>Esta Política de Privacidade descreve como o <strong>LMania</strong> trata as informações dos seus usuários.</p>
                    <p>O LMania é um Progressive Web App (PWA) gratuito para análise e organização de jogos de loterias brasileiras.
                    Ao usar o LMania, você concorda com as práticas descritas neste documento.</p>
                `
            },
            {
                icon: SVG.database,
                title: '2. Dados Armazenados Localmente',
                content: `
                    <p>O LMania armazena as seguintes informações <strong>exclusivamente no seu próprio dispositivo</strong>,
                    através da API <code>localStorage</code> do navegador:</p>
                    <ul>
                        <li>Jogos e talões cadastrados por você (números escolhidos, data)</li>
                        <li>Resultados de concursos cacheados para uso offline</li>
                        <li>Preferências de configuração (tema, tamanho de fonte)</li>
                        <li>Idioma selecionado</li>
                    </ul>
                    <p><strong>Nenhum desses dados é enviado a nossos servidores ou a terceiros.</strong>
                    Você pode apagá-los a qualquer momento limpando os dados do site no seu navegador.</p>
                `
            },
            {
                icon: SVG.globe,
                title: '3. Dados Transmitidos pela Rede',
                content: `
                    <p>O LMania realiza as seguintes requisições de rede:</p>
                    <ul>
                        <li><strong>API pública da Caixa Econômica Federal</strong> (<code>servicebus2.caixa.gov.br</code>):
                        para buscar resultados oficiais dos concursos. Nenhum dado pessoal é enviado nessa requisição.</li>
                        <li><strong>Nossa API de blog</strong> (<code>lmania.com.br/api</code>):
                        para carregar artigos do blog. A requisição contém apenas o idioma selecionado e o identificador do artigo.</li>
                    </ul>
                    <p>Não utilizamos cookies de rastreamento, pixels de propaganda ou qualquer tecnologia de identificação do usuário.</p>
                `
            },
            {
                icon: SVG.shield,
                title: '4. Não Coletamos Dados Pessoais',
                content: `
                    <p>O LMania <strong>não coleta, não processa e não armazena</strong> dados pessoais identificáveis, incluindo:</p>
                    <ul>
                        <li>Nome, e-mail ou qualquer informação de cadastro (não há login)</li>
                        <li>Endereço IP ou geolocalização</li>
                        <li>Histórico de navegação ou comportamento no app</li>
                        <li>Dados financeiros ou bancários</li>
                    </ul>
                `
            },
            {
                icon: SVG.wifi,
                title: '5. Service Worker e Cache Offline',
                content: `
                    <p>O LMania utiliza um <strong>Service Worker</strong> para funcionar offline.
                    Ele armazena em cache arquivos estáticos do aplicativo (HTML, CSS, JavaScript e imagens)
                    no <em>Cache Storage</em> do seu navegador.</p>
                    <p>Esses arquivos não contêm dados pessoais e são utilizados apenas para permitir o
                    funcionamento do app sem conexão com a internet.</p>
                `
            },
            {
                icon: SVG.link,
                title: '6. Links Externos',
                content: `
                    <p>Artigos do blog podem conter links para sites externos (ex.: Caixa Econômica Federal,
                    fontes de dados estatísticos). O LMania não se responsabiliza pelas políticas de
                    privacidade desses sites.</p>
                `
            },
            {
                icon: SVG.users,
                title: '7. Menores de Idade',
                content: `
                    <p>O LMania é destinado a maiores de 18 anos. Loterias são produtos de entretenimento
                    regulamentados para adultos. Não coletamos intencionalmente dados de menores de idade.</p>
                `
            },
            {
                icon: SVG.edit,
                title: '8. Alterações nesta Política',
                content: `
                    <p>Esta política pode ser atualizada periodicamente. A data da última atualização é
                    sempre indicada no topo deste documento. O uso continuado do aplicativo após qualquer
                    alteração constitui aceite das novas condições.</p>
                `
            },
            {
                icon: SVG.mail,
                title: '9. Contato',
                content: `
                    <p>Em caso de dúvidas sobre esta Política de Privacidade, entre em contato:</p>
                    <ul>
                        <li><strong>E-mail:</strong> rodrigohipnose@gmail.com</li>
                        <li><strong>Desenvolvedor:</strong> Rodrigo Faustino</li>
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
        footer.textContent = 'Ao utilizar o LMania você concorda com esta Política de Privacidade.';
        wrap.appendChild(footer);

        main.appendChild(wrap);
        return { element: main, init: () => this.init() };
    }
}
