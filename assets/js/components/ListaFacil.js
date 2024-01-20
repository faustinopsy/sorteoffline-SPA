import  LocalStorageJS  from './LocalStorage.js';
export default class ListaFacil {
    constructor() {
        this.displayValue = '0'
        this.buscalocal = null;
        this.lista = null;
        this.Listar();
    }

    init() {
        this.atualizaEstiloCabecalho();
    }

    atualizaEstiloCabecalho() {
        const cabecalho = document.querySelector('.app-header');
        if (cabecalho) {
            cabecalho.style.background = 'linear-gradient(to bottom, rgb(0 0 0), #c44bbc, rgb(194 71 187))'; 
            cabecalho.style.boxShadow = '0 36px 36px 56px rgb(199 86 194)'; 
        }
    }

    Listar() {
        this.buscalocal = new LocalStorageJS(this.displayValue);
        this.lista = this.buscalocal.ListaLotofacil();
    }

    
    render() {
        
        const mainDiv = document.createElement('div');
        mainDiv.className = 'main';

        const containerDiv = document.createElement('div');
        containerDiv.className = 'container';

        const statusMessageDiv = document.createElement('div');
        statusMessageDiv.id = 'statusMessage';
        containerDiv.appendChild(statusMessageDiv);

        const tecladoDiv = document.createElement('div');
        this.lista.forEach((text, index) => {
            const list = document.createElement('p');
            list.id = index+1;
            list.textContent = `Nº ${index+1} : ${text}`;
            tecladoDiv.appendChild(list);

        });
        
        containerDiv.appendChild(tecladoDiv);
        mainDiv.appendChild(containerDiv);
        
        return {
            element: mainDiv,
            init: () => this.init() 
        };
    }
}

