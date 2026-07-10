import Navbar from './components/Navbar.js';
import AboutScreen from './components/screen/About.js';
import MenuGenerator from './components/Home.js';
import LotoFacilScreen from './components/screen/Lotofacil.js';
import LotomaniaScreen from './components/screen/Lotomania.js';
import MegaScreen from './components/screen/Mega.js';
import QuinaScreen from './components/screen/Quina.js';
import Cadastrar from './components/cad/Cadastrar.js';
import Listar from './components/list/Listar.js';
import Conferir from './components/list/Conferir.js';
import Combinar from './components/combinacoes/Combinar.js';
import GraficoParesImpares from './components/graficos/GraficoParesImpares.js';
import Fechar from './components/fechamento/Fechar.js';
import Politicas from './components/screen/Politicas.js';
import Privacidade from './components/screen/Privacidade.js';
import Contato from './components/screen/Contato.js';
import AnalisarJogos from './components/analise/AnalisarJogos.js';
import Blog from './components/blog/Blog.js';
import BlogPost from './components/blog/BlogPost.js';
import Settings from './components/settings/Settings.js';
import { DEFAULT_THEME } from './components/settings/themes.js';

// Mapeamento de link interno → URL do browser (History API)
const URL_MAP = {
    'mega':        '/mega-sena',
    'facil':       '/lotofacil',
    'quina':       '/quina',
    'mania':       '/lotomania',
    'about':        '/sobre',
    'blog':         '/blog',
    'ferramentas':  '/ferramentas',
    'settings':     '/configuracoes',
    'privacidade': '/privacidade',
    'contato':     '/contato',
};

// Mapeamento inverso — URL → link interno
const ROUTE_MAP = Object.fromEntries(
    Object.entries(URL_MAP).map(([k, v]) => [v, k])
);

// Metadados SEO por rota
const META_MAP = {
    '/':           { title: 'Blog | LMania', desc: 'Artigos educacionais sobre loterias brasileiras: probabilidade, estatística, fechamentos matemáticos e estratégias de organização.' },
    'ferramentas': { title: 'Ferramentas | LMania', desc: 'Ferramenta matemática gratuita para apostadores. Analise, organize e confira seus jogos da Mega-Sena, Lotofácil, Quina e Lotomania.' },
    'mega':        { title: 'Mega-Sena | LMania', desc: 'Cadastre, confira e analise seus jogos da Mega-Sena. Crie fechamentos matemáticos e veja estatísticas de frequência das dezenas.' },
    'facil':       { title: 'Lotofácil | LMania', desc: 'Gerencie seus jogos da Lotofácil com análise matemática. Fechamentos condicionais, combinações e estatísticas de frequência.' },
    'quina':       { title: 'Quina | LMania',     desc: 'Organize e analise seus jogos da Quina. Desdobramentos matemáticos, conferência automática de resultados e análise de frequência.' },
    'mania':       { title: 'Lotomania | LMania', desc: 'Gerencie seus jogos da Lotomania com ferramentas matemáticas. Combinações, fechamentos e análise estatística.' },
    'blog':        { title: 'Blog | LMania',      desc: 'Artigos educacionais sobre loterias brasileiras: probabilidade, estatística, fechamentos matemáticos e estratégias de organização.' },
    'about':       { title: 'Sobre o LMania',     desc: 'Conheça o LMania: ferramenta matemática gratuita para apostadores de loterias brasileiras, criada por Rodrigo Faustino.' },
    'privacidade': { title: 'Política de Privacidade | LMania', desc: 'Política de Privacidade do LMania. Saiba como seus dados são tratados — 100% localmente no seu dispositivo.' },
    'contato':     { title: 'Contato | LMania',   desc: 'Entre em contato com o LMania. Dúvidas, sugestões e feedback sobre a ferramenta matemática de loterias.' },
    'politicas':   { title: 'Políticas de Uso | LMania', desc: 'Termos de uso, isenção de responsabilidade e jogo responsável do LMania.' },
    'settings':    { title: 'Configurações | LMania', desc: 'Personalize o LMania: tema, tamanho de fonte e idioma.' },
};

class App {
    constructor() {
        this.appElement   = document.getElementById('app');
        this.userLanguage = (navigator.language || navigator.userLanguage || 'pt').slice(0, 2);
        this.navbar       = new Navbar(this.navigate.bind(this));
        this.loterias     = [
            { nome: 'lotofacil', simb: 'facil', max: 25,  min: 15, draws: 15, fechMin: 16, gMin: 11, preco: 3.50, gradient: 'linear-gradient(160deg, #2e1065 0%, #6b21a8 60%, #9333ea 100%)', accentColor: '#a855f7' },
            { nome: 'lotomania', simb: 'mania', max: 100, min: 50, draws: 20, fechMin: 55, gMin: 16, preco: 3.00, gradient: 'linear-gradient(160deg, #450a0a 0%, #991b1b 60%, #dc2626 100%)', accentColor: '#ef4444' },
            { nome: 'megasena',  simb: 'mega',  max: 60,  min: 6,  draws: 6,  fechMin: 7,  gMin: 4,  preco: 6.00, gradient: 'linear-gradient(160deg, #052e16 0%, #166534 60%, #15803d 100%)', accentColor: '#22c55e' },
            { nome: 'quina',     simb: 'quina', max: 80,  min: 5,  draws: 5,  fechMin: 6,  gMin: 2,  preco: 1.50, gradient: 'linear-gradient(160deg, #172554 0%, #1d4ed8 60%, #3b82f6 100%)', accentColor: '#3b82f6' },
        ];

        // Aplicar tema e fonte salvos antes de renderizar qualquer componente
        this.loadSettings();

        // Listener do botão Voltar/Avançar do browser
        this.addPopStateListener();

        // Ler URL inicial (suporte a deep links)
        const initialLink = this.urlToLink(window.location.pathname);
        this.navigate(initialLink, false);
    }

    // ── Navegação ──────────────────────────────────────────────────────────

    navigate(link, pushState = true) {
        window.scrollTo(0, 0);
        this.appElement.innerHTML = '';

        let componentInstance;

        componentInstance = this.getComponentInstance(link);
        this.ensureNavbar();
        this.navbar.setActive(link);

        if (componentInstance) {
            const { element, init } = componentInstance.render();
            if (element) element.classList.add('page-enter');
            this.appElement.appendChild(element);
            if (typeof init === 'function') init();
        }

        if (pushState) {
            let url;
            if (link.startsWith('blog/')) {
                url = `/${link}`;
            } else {
                url = URL_MAP[link] || `/${link}`;
            }
            history.pushState({ link }, '', url);
            this.updateMetaTags(link);
        }
    }

    addPopStateListener() {
        window.addEventListener('popstate', (event) => {
            const link = event.state?.link ?? this.urlToLink(window.location.pathname);
            this.navigate(link, false);
        });
    }

    urlToLink(pathname) {
        // Ignorar rotas de arquivos estáticos (sitemaps, etc)
        if (pathname.endsWith('.xml') || pathname.includes('/api/')) {
            return null;
        }

        // '/blog/meu-post-slug' → 'blog/meu-post-slug'
        if (pathname.startsWith('/blog/') && pathname.length > 6) {
            return pathname.slice(1);
        }
        return ROUTE_MAP[pathname] ?? '/';
    }

    updateMetaTags(link) {
        // Para posts individuais do blog
        const meta = META_MAP[link] ?? META_MAP['/'];
        document.title = meta.title;
        const desc = document.querySelector('meta[name="description"]');
        if (desc) desc.setAttribute('content', meta.desc);
    }

    // ── Factory de componentes ─────────────────────────────────────────────

    getComponentInstance(link) {
        switch (link) {
            case '/':
            case 'blog':
                return new Blog(this.navigate.bind(this), this.userLanguage);

            case 'ferramentas':
                return new MenuGenerator(this.navigate.bind(this), this.userLanguage);

            case 'mania':    return new LotomaniaScreen(this.navigate.bind(this), this.userLanguage);
            case 'facil':    return new LotoFacilScreen(this.navigate.bind(this), this.userLanguage);
            case 'mega':     return new MegaScreen(this.navigate.bind(this), this.userLanguage);
            case 'quina':    return new QuinaScreen(this.navigate.bind(this), this.userLanguage);
            case 'about':    return new AboutScreen(this.userLanguage);

            case 'cadfacil': return new Cadastrar(this.loterias[0]);
            case 'cadmania': return new Cadastrar(this.loterias[1]);
            case 'cadsena':  return new Cadastrar(this.loterias[2]);
            case 'cadquina': return new Cadastrar(this.loterias[3]);

            case 'listafacil':  return new Listar(this.loterias[0]);
            case 'listarmania': return new Listar(this.loterias[1]);
            case 'listarsena':  return new Listar(this.loterias[2]);
            case 'listarquina': return new Listar(this.loterias[3]);

            case 'conferefacil':  return new Conferir(this.loterias[0]);
            case 'conferirmania': return new Conferir(this.loterias[1]);
            case 'conferirsena':  return new Conferir(this.loterias[2]);
            case 'conferirquina': return new Conferir(this.loterias[3]);

            case 'combinacoesFacil': return new Combinar(this.loterias[0]);
            case 'combinacoesMania': return new Combinar(this.loterias[1]);
            case 'combinacoesSena':  return new Combinar(this.loterias[2]);
            case 'combinacoesQuina': return new Combinar(this.loterias[3]);

            case 'lotofacilpares': return new GraficoParesImpares(this.loterias[0]);
            case 'maniapares':     return new GraficoParesImpares(this.loterias[1]);
            case 'megasenapares':  return new GraficoParesImpares(this.loterias[2]);
            case 'quinapares':     return new GraficoParesImpares(this.loterias[3]);

            case 'analiseFacil': return new AnalisarJogos(this.loterias[0]);
            case 'analiseMania': return new AnalisarJogos(this.loterias[1]);
            case 'analiseSena':  return new AnalisarJogos(this.loterias[2]);
            case 'analiseQuina': return new AnalisarJogos(this.loterias[3]);

            case 'fechaFacil':   return new Fechar(this.loterias[0], this.navigate.bind(this));
            case 'fechaMania':   return new Fechar(this.loterias[1], this.navigate.bind(this));
            case 'fechaSena':    return new Fechar(this.loterias[2], this.navigate.bind(this));
            case 'fechaQuina':   return new Fechar(this.loterias[3], this.navigate.bind(this));

            case 'politicas':    return new Politicas(this.navigate.bind(this));
            case 'privacidade':  return new Privacidade(this.navigate.bind(this));
            case 'contato':      return new Contato(this.navigate.bind(this));

            case 'settings':
                return new Settings(
                    this.navigate.bind(this),
                    this.applyTheme.bind(this),
                    this.applyFontSize.bind(this)
                );

            default:
                // Rota dinâmica de post do blog: 'blog/meu-slug' ou 'blog_post_42'
                if (link.startsWith('blog/')) {
                    const slugOrId = link.replace('blog/', '');
                    return new BlogPost(slugOrId, this.navigate.bind(this), this.userLanguage);
                }
                if (link.startsWith('blog_post_')) {
                    const postId = link.replace('blog_post_', '');
                    return new BlogPost(postId, this.navigate.bind(this), this.userLanguage);
                }
                return null;
        }
    }

    // ── Navbar ─────────────────────────────────────────────────────────────

    removeNavbar() {
        const el = document.querySelector('#navbar');
        if (el) el.remove();
    }

    ensureNavbar() {
        if (!document.querySelector('#navbar')) {
            document.body.insertBefore(this.navbar.render(), this.appElement);
            this.navbar.init();
        }
    }

    // ── Tema e Fonte ────────────────────────────────────────────────────────

    applyTheme(theme) {
        const root = document.documentElement;
        root.style.setProperty('--bg',         theme.bg);
        root.style.setProperty('--surface',    theme.bg);
        root.style.setProperty('--card',       theme.card);
        root.style.setProperty('--border',     theme.border);
        root.style.setProperty('--text',       theme.text);
        root.style.setProperty('--text-muted', theme.muted);
        root.style.setProperty('--accent',     theme.accent);
        root.style.setProperty('--primary',    theme.primary);
        localStorage.setItem('lmania_theme', JSON.stringify(theme));
    }

    applyFontSize(percent) {
        document.documentElement.style.fontSize = `${percent}%`;
        localStorage.setItem('lmania_font_size', String(percent));
    }

    loadSettings() {
        const savedTheme = localStorage.getItem('lmania_theme');
        const savedFont  = localStorage.getItem('lmania_font_size');

        this.applyTheme(savedTheme ? JSON.parse(savedTheme) : DEFAULT_THEME);
        if (savedFont) this.applyFontSize(parseInt(savedFont, 10));
    }
}

new App();
