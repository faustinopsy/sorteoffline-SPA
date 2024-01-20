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
        this.atualizaEstiloCabecalho();
    }
    
    atualizaEstiloCabecalho() {
        const cabecalho = document.querySelector('.app-header');
        if (cabecalho) {
            cabecalho.style.background = 'linear-gradient(to bottom, rgb(0 0 0), #c44bbc, rgb(194 71 187))'; 
            cabecalho.style.boxShadow = '0 36px 36px 56px rgb(199 86 194)'; 
        }
    }

    bindEvents() {
        
    }
    attachEventListeners() {
        this.buscarButton.addEventListener('click', () => this.Listar());
        
    }
    comparaNumeros(meusnumeros, numerosSorteados) {
        const numerosAcertados = meusnumeros.filter(numero => numerosSorteados.includes(numero));
        return numerosAcertados.length; 
    }
    async Listar() {
        let numero = this.assetInput.value;
        this.busca = new BuscaApi(numero,'lotofacil');
        this.lista = await this.busca.buscaResultadosAPI();
        const numerosSorteados = this.lista.listaDezenas.map(Number);

        this.buscalocal = new LocalStorageJS(this.displayValue)
        this.meusnumeros = this.buscalocal.ListaLotofacil()
        console.log(this.buscalocal.ListaLotofacil())

        const divnova = document.querySelector('.main');
        divnova.innerHTML +=  `Data: ${this.lista.dataApuracao}
                            <br> Sorteio: ${this.lista.listaDezenas}`
         this.meusnumeros.forEach((numeros, index) => {
            const meustaloes = numeros.split(',').map(Number);
            const acertos = this.comparaNumeros(meustaloes, numerosSorteados);

            const list = document.createElement('p');
            list.id = index+1;
            divnova.innerHTML += `<br>Talão ${index+1}: ${numeros} - Acertos: ${acertos}`;

        });
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

