import Navbar from './components/Navbar.js';
import AboutScreen from './components/screen/About.js';
import MenuGenerator from './components/Home.js';
import LotomaniaScreen from './components/screen/Lotomania.js';
import LotoFacilScreen from './components/screen/Lotofacil.js';
import CadFacil from './components/cad/CadFacil.js';
import ListaFacil from './components/list/ListaFacil.js';
import ConfereFacil from './components/list/ConfereFacil.js';
import MegaScreen from './components/screen/Mega.js';
import QuinaScreen from './components/screen/Quina.js';
import GeradorCombinacoes from './components/lib/GerarCombinacoes.js';

class App {
    constructor() {
        this.appElement = document.getElementById('app');
        this.userLanguage = navigator.language || navigator.userLanguage;
        this.navbar = new Navbar(this.navigate.bind(this));
        this.addPopStateListener();
        this.navigate('🏠');
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
        window.location.hash = link;
        history.pushState(null, '', link);

        switch (link) {
            case 'mania': return new LotomaniaScreen(this.navigate.bind(this), this.userLanguage);
            case 'facil': return new LotoFacilScreen(this.navigate.bind(this), this.userLanguage);
            case 'mega': return new MegaScreen(this.navigate.bind(this), this.userLanguage);
            case 'quina': return new QuinaScreen(this.navigate.bind(this), this.userLanguage);
            case 'about': return new AboutScreen(this.userLanguage);
            case 'cadfacil': return new CadFacil();
            case 'listafacil': return new ListaFacil();
            case 'conferefacil': return new ConfereFacil();
            case 'combinacoesFacil': return new GeradorCombinacoes();
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
        }
    }
}


new App();
