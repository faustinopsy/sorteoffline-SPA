import BuscaApi from '../lib/BuscaApi.js';

export default class GraficoParesImpares {
    constructor(tipo) {
        this.pares = 0;
        this.impares = 0;
        this.container = null;
        this.buscalocal = null;
        this.lista = null;
        this.numeros = null
        this.paresImparesChart = null;
        this.tipo = tipo;
    }

    async buscaDadosAPI() {
        try {
            this.busca = new BuscaApi('', this.tipo);
            this.lista = await this.busca.buscaResultadosAPI();
            this.numeros = this.lista.dezenasSorteadasOrdemSorteio.map(Number);
            console.log('Números Sorteados:', this.numeros);
            this.pares = this.numeros.filter((num) => num % 2 === 0).length;
            this.impares = this.numeros.filter((num) => num % 2 !== 0).length;
            console.log('Pares:', this.pares, 'Ímpares:', this.impares);

            this.renderGraficos();
        } catch (error) {
            console.error('Erro ao buscar dados da API:', error);
        }
    }

    renderGraficos() {
        const paresImparesCanvas = this.container.querySelector('#pares-impares');
        const numeros = this.container.querySelector('#numeros');

        if (this.paresImparesChart) {
            this.paresImparesChart.destroy();
        }
        numeros.innerHTML = this.numeros

        this.paresImparesChart = new Chart(paresImparesCanvas.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Pares', 'Ímpares'],
                datasets: [
                    {
                        label: 'Quantidade',
                        data: [this.pares, this.impares],
                        backgroundColor: ['rgba(0, 123, 255, 0.5)', 'rgba(220, 53, 69, 0.5)'],
                        borderColor: ['rgba(0, 123, 255, 1)', 'rgba(220, 53, 69, 1)'],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });

    }

    render() {
        this.container = document.createElement('div');
        this.container.className = 'grafico-container main';
        this.container.style.flexDirection = 'Collumn'
        const numeros = document.createElement('p')
        numeros.id = 'numeros'
        numeros.style.fontSize= '1.5rem';
        numeros.style.position = 'relative';
        numeros.style.width= '70%';
        numeros.style.marginLeft = 'auto';
        const paresImparesCanvas = document.createElement('canvas');
        paresImparesCanvas.id = 'pares-impares';
        this.container.appendChild(numeros);
        this.container.appendChild(paresImparesCanvas);

        return {
            element: this.container,
            init: () => this.buscaDadosAPI()
        };
    }
}
