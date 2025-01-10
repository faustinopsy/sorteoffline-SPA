import  LocalStorageJS  from '../lib/LocalStorage.js';
import Modal from '../lib/Modal.js';
export default class Cadastrar {
    constructor(loteria) {
        this.displayValue = '0'
        this.buscalocal = null;
        this.maxNumeros = loteria.max;
        this.minNumeros = loteria.min;
        this.tipo = loteria.nome;
        this.simbolo = loteria.simb;
        this.modal = new Modal();
    }

    init() {
        this.bindEvents();
        this.updateDisplay();
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
        document.getElementById('bclear').addEventListener('click', () => this.clearDisplay());
        document.querySelectorAll('.bolas').forEach(button => {
            if (button.id !== 'carregar' && button.id !== 'bclear' && button.id !== 'colocarnocarrinho') {
                button.addEventListener('click', () => this.pressButton(button.textContent));
            }
        });
        document.getElementById('colocarnocarrinho').addEventListener('click', () => this.salvar());
    }

    pressButton(num) {
        let numerosSelecionados = this.displayValue === '0' ? [] : this.displayValue.split(',');
        const index = numerosSelecionados.indexOf(num);
        if (index > -1) {
            numerosSelecionados.splice(index, 1);
            document.getElementById(`n${num}`).classList.remove('bolas-selecionadas');
        } else {
            if (numerosSelecionados.length < this.minNumeros) {
                numerosSelecionados.push(num);
                document.getElementById(`n${num}`).classList.add('bolas-selecionadas');
            }
        }
    
        this.displayValue = numerosSelecionados.join(',');
        this.updateDisplay();
    }
    
    updateDisplay() {
        const salvarBtn = document.getElementById('colocarnocarrinho');
        const numerosSelecionados = this.displayValue.split(',');
        salvarBtn.disabled = numerosSelecionados.length !== this.minNumeros || this.displayValue === '0';
        const numerosOrdenados = this.displayValue.split(',')
            .map(num => parseInt(num, 10)) 
            .sort((a, b) => a - b); 
    
        let displayTexto = '';
        numerosOrdenados.forEach((num, index) => {
            displayTexto += num < 10 ? '0' + num : num; 
            if ((index + 1) % 5 === 0 && index < numerosOrdenados.length - 1) {
                displayTexto += '\n'; 
            } else if (index < numerosOrdenados.length - 1) {
                displayTexto += ',';
            }
        });
    
        document.getElementById('display').innerText = displayTexto;
    }
    
    clearDisplay() {
        this.displayValue = '0';
        document.querySelectorAll('.bolas').forEach(button => {
            button.classList.remove('bolas-selecionadas');
        });
        this.updateDisplay();
    }

    salvar() {
        const numerosOrdenados = this.displayValue.split(',')
            .map(num => parseInt(num, 10))
            .sort((a, b) => a - b);
    
        const numerosOrdenadosString = numerosOrdenados.map(num => num < 10 ? '0' + num : num).join(',');
        this.buscalocal = new LocalStorageJS(numerosOrdenadosString);
        this.buscalocal.salvarLoteria(this.simbolo, this.tipo );
        this.displayValue = '0';
        this.modal.exibeModal("Salvo com sucesso!.");
        this.clearDisplay();
    }
    
    render() {
        const mainDiv = document.createElement('div');
        mainDiv.className = 'main';
    
        const containerDiv = document.createElement('div');
        containerDiv.className = 'container';
    
        const statusMessageDiv = document.createElement('div');
        statusMessageDiv.id = 'statusMessage';
        containerDiv.appendChild(statusMessageDiv);
    
        const displayDiv = document.createElement('div');
        displayDiv.id = 'display';
        displayDiv.textContent = this.displayValue;
        containerDiv.appendChild(displayDiv);
    
        const tecladoDiv = document.createElement('div');
        tecladoDiv.id = 'teclado';
    
        for (let i = 1; i <= this.maxNumeros; i++) {
            const button = document.createElement('button');
            button.className = 'bolas';
            button.textContent = i.toString().padStart(2, '0');
            button.id = `n${i.toString().padStart(2, '0')}`;
            tecladoDiv.appendChild(button);
    
        }
    
        const btns = [
            { text: '🗑️', id: 'bclear' },
            { text: '💾', id: 'colocarnocarrinho', disabled: true }
        ];
        btns.forEach(({ text, id, disabled }) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.id = id;
            if (disabled) button.disabled = true;
            containerDiv.appendChild(button);
        });
    
        containerDiv.appendChild(tecladoDiv);
        mainDiv.appendChild(containerDiv);
    
        return {
            element: mainDiv,
            init: () => this.init()
        };
    }
    
}

