import  LocalStorageJS  from '../lib/LocalStorage.js';
export default class CadFacil {
    constructor() {
        this.displayValue = '0'
        this.buscalocal = null;
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
            if (button.id !== 'carregar' && button.id !== 'bclear' && button.id !== 'salvarBtn') {
                button.addEventListener('click', () => this.pressButton(button.textContent));
            }
        });
        document.getElementById('salvarBtn').addEventListener('click', () => this.salvar());
    }

    pressButton(num) {
        let numerosSelecionados = this.displayValue === '0' ? [] : this.displayValue.split(',');
        const index = numerosSelecionados.indexOf(num);
        if (index > -1) {
            numerosSelecionados.splice(index, 1);
            document.getElementById(`btn-${num}`).classList.remove('bolas-selecionadas');
        } else {
            if (numerosSelecionados.length < 15) {
                numerosSelecionados.push(num);
                document.getElementById(`btn-${num}`).classList.add('bolas-selecionadas');
            }
        }
    
        this.displayValue = numerosSelecionados.join(',');
        this.updateDisplay();
    }
    
    updateDisplay() {
        const salvarBtn = document.getElementById('salvarBtn');
        const numerosSelecionados = this.displayValue.split(',');
        salvarBtn.disabled = numerosSelecionados.length !== 15 || this.displayValue === '0';
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
        this.buscalocal.salvarLoteria('facil', 'lotofacil');
        this.displayValue = '0';
        this.exibeModal();
        this.clearDisplay();
    }
    exibeModal(){
        Swal.fire({
            title: "Salvo com sucesso!.",
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
        
        const buttons = [
            '01', '02', '03', '04', '05',
            '06', '07', '08', '09', '10',
            '11', '12', '13', '14', '15',
            '16', '17', '18', '19', '20',
            '21', '22', '23', '24', '25'
        ];
        buttons.forEach((text, index) => {
            const button = document.createElement('button');
            button.className = 'bolas';
            button.textContent = text;
            button.id = `btn-${text}`;
            tecladoDiv.appendChild(button);

            if ((index + 1) % 25 === 0) {
                tecladoDiv.appendChild(document.createElement('br'));
            }
        });
        const btns = [
            '🗑️', '💾'
        ];
        btns.forEach((text, index) => {
        const buttonc = document.createElement('button');
        buttonc.textContent = text;
        
        if (text === '🗑️') buttonc.id = 'bclear';
        if (text === '💾') {
            buttonc.id = 'salvarBtn';
            buttonc.disabled = true;
        }
        containerDiv.appendChild(buttonc);
        });
        
        containerDiv.appendChild(tecladoDiv);
        mainDiv.appendChild(containerDiv);
        
        return {
            element: mainDiv,
            init: () => this.init() 
        };
    }
}

