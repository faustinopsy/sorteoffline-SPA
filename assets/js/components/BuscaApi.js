export default class BuscaApi {
    constructor(consurso, loteria) {
        this.displayValue = '0'
        this.numero = consurso;
        this.loteria = loteria;
    }

    init() {
        this.bindEvents();
        this.updateDisplay();
    }

    bindEvents() {
        
    }

    async buscaResultadosAPI() {
        const cacheKey = `resultado-${this.loteria}-${this.numero}`;
    
        const cachedResult = localStorage.getItem(cacheKey);
        if (cachedResult) {
            return JSON.parse(cachedResult);
        }
    
        try {
            const response = await fetch(`https://servicebus2.caixa.gov.br/portaldeloterias/api/${this.loteria}/${this.numero}`, {
                method: 'GET',
                redirect: 'follow'
            });
    
            if (!response.ok) {
                console.log(`Erro HTTP! status: ${response.status}`);
            } else {
                const resultado = await response.json();
                localStorage.setItem(cacheKey, JSON.stringify(resultado));
                return resultado;
            }
    
        } catch (error) {
            console.log(`Falha ao conectar: ${error.message}`);
        }
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

