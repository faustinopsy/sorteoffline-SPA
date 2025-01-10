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

class App {
    constructor() {
        this.appElement = document.getElementById('app');
        this.userLanguage = navigator.language || navigator.userLanguage;
        this.navbar = new Navbar(this.navigate.bind(this));
        //this.addPopStateListener();
        this.navigate('🏠');
        this.loterias = [
            {nome : 'lotofacil', simb: 'facil', max: 25, min: 15},
            {nome : 'lotomania', simb: 'mania', max: 100, min: 50},
            {nome : 'megasena', simb: 'mega', max: 60, min: 6},
            {nome : 'quina', simb: 'quina', max: 80, min: 5},
        ]
    }

    navigate(link) {
        this.appElement.innerHTML = '';
        let componentInstance;

        if (link === '🏠') {
            componentInstance = new MenuGenerator(this.navigate.bind(this), this.userLanguage);
            this.removeNavbar();
        } else {
            componentInstance = this.getComponentInstance(link);
            this.ensureNavbar();
        }

        if (componentInstance) {
            const { element, init } = componentInstance.render();
            this.appElement.appendChild(element);
            if (init && typeof init === 'function') {
                init();
            }
        }
    }

    addPopStateListener() {
        window.addEventListener('popstate', (event) => {
            const path = window.location.pathname.replace('/', '');
            history.pushState(null, '', path);
        });
    }

    getComponentInstance(link) {
        //window.location.hash = link;
        //history.pushState(null, '', link);

        switch (link) {
            case 'mania': return new LotomaniaScreen(this.navigate.bind(this), this.userLanguage);
            case 'facil': return new LotoFacilScreen(this.navigate.bind(this), this.userLanguage);
            case 'mega': return new MegaScreen(this.navigate.bind(this), this.userLanguage);
            case 'quina': return new QuinaScreen(this.navigate.bind(this), this.userLanguage);
            case 'about': return new AboutScreen(this.userLanguage);
            
            case 'cadfacil': return new Cadastrar(this.loterias[0]);
            case 'cadmania': return new Cadastrar(this.loterias[1]);
            case 'cadsena': return new Cadastrar(this.loterias[2]);
            case 'cadquina': return new Cadastrar(this.loterias[3]);

            case 'listafacil': return new Listar(this.loterias[0]);
            case 'listarmania': return new Listar(this.loterias[1]);
            case 'listarsena': return new Listar(this.loterias[2]);
            case 'listarquina': return new Listar(this.loterias[3]);

            case 'conferefacil': return new Conferir(this.loterias[0]);
            case 'conferirmania': return new Conferir(this.loterias[1]);
            case 'conferirsena': return new Conferir(this.loterias[2]);
            case 'conferirquina': return new Conferir(this.loterias[3]);

            case 'combinacoesFacil': return new Combinar(this.loterias[0]);
            case 'combinacoesSena': return new Combinar(this.loterias[1]);
            case 'combinacoesMania': return new Combinar(this.loterias[2]);
            case 'combinacoesQuina': return new Combinar(this.loterias[3]);

            case 'lotofacilpares': return new GraficoParesImpares(this.loterias[0]);
            case 'maniapares': return new GraficoParesImpares(this.loterias[1]);
            case 'megasenapares': return new GraficoParesImpares(this.loterias[2]);
            case 'quinapares': return new GraficoParesImpares(this.loterias[3]);
            default: return null;
        }
    }

    removeNavbar() {
        const navbarElement = document.querySelector('#navbar');
        if (navbarElement) {
            navbarElement.remove();
        }
    }

    ensureNavbar() {
        const existingNavbar = document.querySelector('#navbar');
        if (!existingNavbar) {
            document.body.insertBefore(this.navbar.render(), this.appElement);
            this.navbar.init();
        }
    }
}


new App();
