import BuscaApi from '../lib/BuscaApi.js';
import LocalStorageJS from '../lib/LocalStorage.js';

export default class ConfereSena {
    constructor() {
        this.displayValue = '0';
        this.buscalocal = null;
        this.lista = null;
        this.assetInput = null;
        this.buscarButton = null;
        this.meusnumeros = null;
    }

    init() {
        this.bindEvents();
        this.atualizaEstiloCabecalho();
    }
    
    atualizaEstiloCabecalho() {
        const cabecalho = document.querySelector('.app-header');
        if (cabecalho) {
            cabecalho.style.background = 'linear-gradient(rgb(0, 0, 0), rgb(82 196 75), rgb(71 194 117))'; 
            cabecalho.style.boxShadow = 'rgb(79 194 99) 0px 36px 36px 56px'; 
        }
    }

    bindEvents() {
        this.assetInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
    
        this.buscarButton.addEventListener('click', () => {
            if (this.assetInput.value !== '') {
                this.Listar();
            } else {
                this.exibeModal(); 
            }
        });
    }
    
    exibeModal() {
        Swal.fire({
            title: "Preencha um número para busca.",
            showClass: {
                popup: `
                    animate__animated
                    animate__fadeInUp
                    animate__faster
                `
            },
            hideClass: {
                popup: `
                    animate__animated
                    animate__fadeOutDown
                    animate__faster
                `
            }
        });
    }

    comparaNumeros(meusnumeros, numerosSorteados) {
        const numerosAcertados = meusnumeros.filter(numero => numerosSorteados.includes(numero));
        return numerosAcertados.length; 
    }

    async Listar() {
        let numero = this.assetInput.value;
        this.busca = new BuscaApi(numero, 'megasena');
        this.lista = await this.busca.buscaResultadosAPI();
        const numerosSorteados = this.lista.listaDezenas.map(Number);
    
        this.buscalocal = new LocalStorageJS(this.displayValue);
        this.meusnumeros = this.buscalocal.listaLoteria('sena', 'lotosena');
    
        const divnova = document.querySelector('.container');
        const input = document.querySelector('#buscaConcursos');
        const botao = document.querySelector('.sell');
        divnova.innerHTML = '';
        divnova.appendChild(input);
        divnova.appendChild(botao);
        const conteudoNovo = `Concurso Anterior ${this.lista.numeroConcursoAnterior} - 
                              Próximo Concurso ${this.lista.numeroConcursoProximo} 
                              <br>
                              Data: ${this.lista.dataApuracao} - Acumulou: ${this.lista.acumulado ? 'Sim' : 'Não'}
                              <br> Sorteio: ${this.lista.listaDezenas}`;
    
        const conteudoDiv = document.createElement('div');
        conteudoDiv.className = 'lista-tens';
        conteudoDiv.innerHTML = conteudoNovo;
        divnova.appendChild(conteudoDiv);
    
        // Array para armazenar os talões com seus respectivos acertos
        const taloesAcertos = this.meusnumeros.map((numeros, index) => {
            const meustaloes = numeros.split(',').map(Number);
            const acertos = this.comparaNumeros(meustaloes, numerosSorteados);
            return { numeros, acertos, index };
        });
    
        // Ordenar os talões por acertos de forma decrescente
        taloesAcertos.sort((a, b) => b.acertos - a.acertos);
    
        // Renderizar os talões ordenados
        taloesAcertos.forEach(talao => {
            const list = document.createElement('p');
            list.id = talao.index + 1;
            list.className = 'lista-tens';
            list.innerHTML = `<br>Talão <b>${talao.index + 1}: ${talao.numeros} </b>- Acertos: ${talao.acertos}<br>`;
            divnova.appendChild(list);
        });
    
        this.assetInput.value = '';
    }
    
    render() {
        const mainDiv = document.createElement('div');
        mainDiv.className = 'main';
        const containerDiv = document.createElement('div');
        containerDiv.className = 'container';
        const tecladoDiv = document.createElement('div');
        
        this.assetInput = document.createElement('input');
        this.assetInput.setAttribute('type', 'text');
        this.assetInput.setAttribute('placeholder', 'Nº Concurso');
        this.assetInput.id = 'buscaConcursos';
        this.assetInput.required = true;
        containerDiv.appendChild(this.assetInput);
        this.buscarButton = document.createElement('button');
        this.buscarButton.classList.add('btn', 'sell');
        this.buscarButton.textContent = 'Buscar';
        containerDiv.appendChild(this.buscarButton);
    
        containerDiv.appendChild(tecladoDiv);
        mainDiv.appendChild(containerDiv);
        
        return {
            element: mainDiv,
            init: () => this.init()
        };
    }
}
