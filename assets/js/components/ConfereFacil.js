import  BuscaApi  from './BuscaApi.js';
import  LocalStorageJS  from './LocalStorage.js';
export default class ConfereFacil {
    constructor() {
        this.displayValue = '0'
        this.buscalocal = null;
        this.lista = null;
        this.assetInput = null;
        this.buscarButton = null;
        this.meusnumeros = null;
    }

    init() {
        this.attachEventListeners();
    }

    bindEvents() {
        
    }
    attachEventListeners() {
        this.buscarButton.addEventListener('click', () => this.Listar());
        
    }

    async Listar() {
        let numero = this.assetInput.value;
        this.busca = new BuscaApi(numero,'lotofacil');
        this.lista = await this.busca.buscaResultadosAPI();
        console.log(this.lista)

        this.buscalocal = new LocalStorageJS(this.displayValue)
        this.meusnumeros = this.buscalocal.ListaLotofacil()
        console.log(this.buscalocal.ListaLotofacil())

        const divnova = document.querySelector('.main');
        divnova.innerHTML +=  `${this.lista.dataApuracao}
         <br> ${this.lista.listaDezenas} 
         <br> ${this.meusnumeros}`
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

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'actions';
    
        this.assetInput = document.createElement('input');
        this.assetInput.setAttribute('type', 'text');
        this.assetInput.setAttribute('placeholder', 'Nº Concurso');
        this.assetInput.id ='valorTransferencia';
        this.assetInput.required = true;
        actionsDiv.appendChild(this.assetInput);

        this.buscarButton = document.createElement('button');
        this.buscarButton.classList.add('btn', 'sell');
        this.buscarButton.textContent = 'Buscar';
        actionsDiv.appendChild(this.buscarButton);
    
        
        
        tecladoDiv.appendChild(actionsDiv);
        containerDiv.appendChild(tecladoDiv);
        mainDiv.appendChild(containerDiv);
        
        return {
            element: mainDiv,
            init: () => this.init() 
        };
    }
}

