import  LocalStorageJS  from './LocalStorage.js';
export default class CadFacil {
    constructor() {
        this.displayValue = '0'
        this.buscalocal = null;
    }

    init() {
        this.bindEvents();
        this.updateDisplay();
    }

    bindEvents() {
        document.getElementById('bclear').addEventListener('click', () => this.clearDisplay());
        document.querySelectorAll('.bolas').forEach(button => {
            if (button.id !== 'carregar' && button.id !== 'bclear' && button.id !== 'salvarBtn') {
                button.addEventListener('click', () => this.pressButton(button.textContent));
            }
        });
        document.getElementById('salvarBtn').addEventListener('click', () => this.salvar());
        //document.getElementById('modalCloseBtn').addEventListener('click', () => this.closeModal());
    }

    pressButton(num) {
        if (this.displayValue === '0') {
            this.displayValue = num;
        } else {
            this.displayValue += ','+ num;
        }
        this.updateDisplay();
    }

    updateDisplay() {
        document.getElementById('display').innerText = this.displayValue;
    }

    clearDisplay() {
        this.displayValue = '0';
        this.updateDisplay();
        this.buscalocal = new LocalStorageJS(this.displayValue)
        console.log(this.buscalocal.ListaLotofacil())
    }

    salvar() {
        this.buscalocal = new LocalStorageJS(this.displayValue)
        this.buscalocal.salvarLotofacil();
        this.displayValue = '0';
        this.updateDisplay();
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
            '11', '12', '13','14','15',
            '16', '17', '18','19','20',
            '21', '22', '23','24','25'
        ];
        buttons.forEach((text, index) => {
            const button = document.createElement('button');
            button.className = 'bolas';
            button.textContent = text;
            
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
        if (text === '💾') buttonc.id = 'salvarBtn';
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

