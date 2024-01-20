import Navbar from './components/Navbar.js';
import MenuGenerator from './components/Home.js';
import LotomaniaScreen from './components/Lotomania.js';
import LotoFacilScreen from './components/LotoFacil.js';
import CadFacil from './components/CadFacil.js';
import MegaScreen from './components/Mega.js';
import QuinaScreen from './components/Quina.js';

const app = document.getElementById('app');

let userLanguage = navigator.language || navigator.userLanguage; 

function navigate(link) {
    app.innerHTML = '';
    let componentInstance;
    if (link === '🏠') {
        componentInstance = new MenuGenerator(navigate,userLanguage);
        removeNavbar(); 
    } else {
        componentInstance = getComponentInstance(link);
        ensureNavbar(); 
    }

    if (componentInstance) {
        const { element, init } = componentInstance.render();
        app.appendChild(element);
        if (init && typeof init === 'function') {
            init(); 
        }
    }
}
window.addEventListener('popstate', function(event) {
    const path = window.location.pathname.replace('/', '');
    history.pushState(null, '', path);
});

function getComponentInstance(link) {
    window.location.hash = link;
    history.pushState(null, '', link);
    
    switch (link) {
        case 'mania': return new LotomaniaScreen(navigate,userLanguage);
        case 'facil': return new LotoFacilScreen(navigate,userLanguage);
        case 'mega': return new MegaScreen(navigate,userLanguage);
        case 'quina': return new QuinaScreen(navigate,userLanguage);
        case 'cadfacil': return new CadFacil();
        default: return null;
    }
}

function removeNavbar() {
    const navbarElement = document.querySelector('#navbar');
    if (navbarElement) {
        navbarElement.remove();
    }
}

function ensureNavbar() {
    const existingNavbar = document.querySelector('#navbar');
    if (!existingNavbar) {
        document.body.insertBefore( navbar.render(), app);
    }
}
const navbar = new Navbar(navigate);
navigate('🏠');