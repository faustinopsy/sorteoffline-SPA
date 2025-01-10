import Navbar from './components/Navbar.js';
import AboutScreen from './components/screen/About.js';
import MenuGenerator from './components/Home.js';
import LotomaniaScreen from './components/screen/Lotomania.js';
import LotoFacilScreen from './components/screen/Lotofacil.js';
import CadFacil from './components/cad/CadFacil.js';
import CadQuina from './components/cad/CadQuina.js';
import ListaFacil from './components/list/ListaFacil.js';
import ListaQuina from './components/list/ListaQuina.js';
import ConfereFacil from './components/list/ConfereFacil.js';
import ConfereQuina from './components/list/ConfereQuina.js';
import MegaScreen from './components/screen/Mega.js';
import QuinaScreen from './components/screen/Quina.js';

import CombinaFacil from './components/combinacoes/CombinaFacil.js';
import CombinaSena from './components/combinacoes/CombinaSena.js';
import CombinaQuina from './components/combinacoes/CombinaQuina.js';
import CombinaMania from './components/combinacoes/CombinaMania.js';
import ListaSena from './components/list/ListaSena.js';
import CadSena from './components/cad/CadSena.js';
import ConfereSena from './components/list/ConfereSena.js';

import ListaMania from './components/list/ListaMania.js';
import CadMania from './components/cad/CadMania.js';
import ConfereMania from './components/list/ConfereMania.js';

import GraficoParesImpares from './components/graficos/GraficoParesImpares.js';
class App {
    constructor() {
        this.appElement = document.getElementById('app');
        this.userLanguage = navigator.language || navigator.userLanguage;
        this.navbar = new Navbar(this.navigate.bind(this));
        //this.addPopStateListener();
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
        //window.location.hash = link;
        //history.pushState(null, '', link);

        switch (link) {
            case 'mania': return new LotomaniaScreen(this.navigate.bind(this), this.userLanguage);
            case 'facil': return new LotoFacilScreen(this.navigate.bind(this), this.userLanguage);
            case 'mega': return new MegaScreen(this.navigate.bind(this), this.userLanguage);
            case 'quina': return new QuinaScreen(this.navigate.bind(this), this.userLanguage);
            case 'about': return new AboutScreen(this.userLanguage);
            case 'cadfacil': return new CadFacil();
            case 'cadquina': return new CadQuina();
            case 'listafacil': return new ListaFacil();
            case 'listarquina': return new ListaQuina();
            case 'conferirquina': return new ConfereQuina();
            case 'cadsena': return new CadSena();
            case 'listarsena': return new ListaSena();
            case 'conferirsena': return new ConfereSena();
            case 'cadmania': return new CadMania();
            case 'listarmania': return new ListaMania();
            case 'conferirmania': return new ConfereMania();
            
            case 'conferefacil': return new ConfereFacil();
            case 'combinacoesFacil': return new CombinaFacil();
            case 'combinacoesQuina': return new CombinaQuina();
            case 'combinacoesSena': return new CombinaSena();
            case 'combinacoesMania': return new CombinaMania();
            case 'lotofacilpares': return new GraficoParesImpares('lotofacil');
            case 'megasenapares': return new GraficoParesImpares('megasena');
            case 'maniapares': return new GraficoParesImpares('lotomania');
            case 'quinapares': return new GraficoParesImpares('quina');
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
