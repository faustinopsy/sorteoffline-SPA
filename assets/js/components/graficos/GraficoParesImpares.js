import BuscaApi from '../lib/BuscaApi.js';

export default class GraficoParesImpares {
    constructor(loteria) {
        this.pares          = 0;
        this.impares        = 0;
        this.container      = null;
        this.numeros        = null;
        this.paresImparesChart = null;
        this.tipo           = loteria.nome;
    }

    async buscaDadosAPI() {
        this._setLoading(true);
        try {
            const busca = new BuscaApi('', this.tipo);
            const lista = await busca.buscaResultadosAPI();

            this.numeros = lista.dezenasSorteadasOrdemSorteio.map(Number);
            this.pares   = this.numeros.filter(n => n % 2 === 0).length;
            this.impares = this.numeros.filter(n => n % 2 !== 0).length;

            this._renderConcursoInfo(lista.numero, lista.dataApuracao);
            this._renderGraficos();
        } catch (error) {
            console.error('Erro ao buscar dados da API:', error);
            this._setLoading(false);
        }
    }

    _setLoading(on) {
        const info = this.container.querySelector('#concurso-info');
        if (info) info.textContent = on ? 'Carregando...' : '';
    }

    _renderConcursoInfo(numero, data) {
        const info = this.container.querySelector('#concurso-info');
        if (!info) return;

        info.innerHTML = `
            <span class="ci-badge">Concurso <strong>${numero}</strong></span>
            <span class="ci-sep">·</span>
            <span class="ci-date">${data}</span>
        `;
    }

    _renderGraficos() {
        const canvas  = this.container.querySelector('#pares-impares');
        const numEl   = this.container.querySelector('#numeros');

        if (this.paresImparesChart) this.paresImparesChart.destroy();

        // Números ordenados formatados
        const ordenados = [...this.numeros].sort((a, b) => a - b);
        numEl.innerHTML = ordenados
            .map(n => `<span class="bola-num">${String(n).padStart(2, '0')}</span>`)
            .join('');

        this.paresImparesChart = new Chart(canvas.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Pares', 'Ímpares'],
                datasets: [{
                    label: 'Quantidade',
                    data: [this.pares, this.impares],
                    backgroundColor: ['rgba(59,130,246,0.45)', 'rgba(239,68,68,0.45)'],
                    borderColor:     ['rgba(59,130,246,1)',    'rgba(239,68,68,1)'],
                    borderWidth: 2,
                    borderRadius: 8,
                }],
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1, color: '#94a3b8' },
                        grid:  { color: 'rgba(255,255,255,0.05)' },
                    },
                    x: {
                        ticks: { color: '#94a3b8', font: { weight: '700' } },
                        grid:  { display: false },
                    },
                },
            },
        });
    }

    render() {
        this.container = document.createElement('div');
        this.container.className = 'main grafico-container';

        // ── Cabeçalho com concurso + data ──────────────────────────
        const infoRow = document.createElement('div');
        infoRow.id        = 'concurso-info';
        infoRow.className = 'concurso-info';
        infoRow.textContent = 'Carregando...';

        // ── Bolinhas dos números sorteados ─────────────────────────
        const numEl = document.createElement('div');
        numEl.id        = 'numeros';
        numEl.className = 'numeros-sorteados';

        // ── Canvas do gráfico ──────────────────────────────────────
        const canvas = document.createElement('canvas');
        canvas.id = 'pares-impares';

        this.container.appendChild(infoRow);
        this.container.appendChild(numEl);
        this.container.appendChild(canvas);

        return { element: this.container, init: () => this.buscaDadosAPI() };
    }
}
