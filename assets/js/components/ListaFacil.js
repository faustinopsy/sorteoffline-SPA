import  LocalStorageJS  from './LocalStorage.js';
export default class ListaFacil {
    constructor() {
        this.displayValue = '0'
        this.buscalocal = null;
        this.lista = null;
        this.Listar();
    }

    init() {
        this.bindEvents();
        this.updateDisplay();
    }

    bindEvents() {
        
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
        console.log(this.lista)
        this.lista.forEach((text, index) => {
            console.log(index+1)
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
