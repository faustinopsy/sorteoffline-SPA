import BuscaApi from '../lib/BuscaApi.js';
import LocalStorageJS from '../lib/LocalStorage.js';
import Modal from '../lib/Modal.js';

export default class Conferir {
    constructor(loteria) {
        this.displayValue  = '0';
        this.tipo          = loteria.nome;
        this.simbolo       = loteria.simb;
        this.modal         = new Modal();
        this.assetInput    = null;
        this.buscarButton  = null;
        this.hintEl        = null;
        this.resultArea    = null;
        this._latestCache  = null; // resultado pré-carregado
    }

    init() {
        this.atualizaEstiloCabecalho();
        this.bindEvents();
        this._prefetchLatest();
    }

    atualizaEstiloCabecalho() {
        const cabecalho = document.querySelector('.app-header');
        if (cabecalho) {
            cabecalho.style.background = 'linear-gradient(to bottom, rgb(0 0 0), #c44bbc, rgb(194 71 187))';
            cabecalho.style.boxShadow  = 'none';
        }
    }

    // ── Pré-carrega o último sorteio em background ─────────────────
    async _prefetchLatest() {
        this.hintEl.textContent = 'Buscando último sorteio…';
        try {
            const busca  = new BuscaApi('', this.tipo);
            const lista  = await busca.buscaResultadosAPI();
            if (!lista || !lista.numero) return;

            // Guarda no cache com a chave numerada para reutilização
            const cacheKey = `resultado-${this.tipo}-${lista.numero}`;
            localStorage.setItem(cacheKey, JSON.stringify(lista));

            this._latestCache = lista;

            // Pré-preenche o input e mostra dica
            this.assetInput.value = String(lista.numero);
            this.hintEl.innerHTML =
                `Concurso <strong>${lista.numero}</strong> &nbsp;·&nbsp; ${lista.dataApuracao}` +
                (lista.acumulado ? ' &nbsp;<span class="conf-acumulou">Acumulou!</span>' : '');
        } catch (e) {
            this.hintEl.textContent = '';
        }
    }

    bindEvents() {
        this.assetInput.addEventListener('input', e => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            // Se o usuário mudou o número, limpa o cache pré-carregado
            if (this._latestCache && e.target.value !== String(this._latestCache.numero)) {
                this._latestCache = null;
            }
        });

        this.buscarButton.addEventListener('click', () => {
            const val = this.assetInput.value.trim();
            if (!val) {
                this.modal.exibeModal('Preencha um número para busca.');
                return;
            }
            this.conferir(val);
        });
    }

    comparaNumeros(meus, sorteados) {
        return meus.filter(n => sorteados.includes(n)).length;
    }

    async conferir(numero) {
        this.buscarButton.disabled   = true;
        this.buscarButton.textContent = 'Buscando…';
        this.resultArea.innerHTML    = '';

        try {
            // Se o resultado já foi pré-carregado e o número bate, usa direto
            let lista = (this._latestCache && String(this._latestCache.numero) === String(numero))
                ? this._latestCache
                : await new BuscaApi(numero, this.tipo).buscaResultadosAPI();

            if (!lista) return;

            const sorteados = lista.listaDezenas.map(Number);
            const meusTaloes = new LocalStorageJS(this.displayValue)
                .listaLoteria(this.simbolo, this.tipo);

            this._renderResultado(lista, sorteados, meusTaloes);
        } catch (e) {
            this.resultArea.innerHTML = '<p style="color:var(--danger);text-align:center">Erro ao buscar concurso.</p>';
        } finally {
            this.buscarButton.disabled    = false;
            this.buscarButton.textContent = 'Buscar';
        }
    }

    _renderResultado(lista, sorteados, meusTaloes) {
        // ── Card do sorteio ────────────────────────────────────────
        const card = document.createElement('div');
        card.className = 'conf-card';
        card.innerHTML = `
            <div class="conf-card__header">
                <span class="conf-card__numero">Concurso ${lista.numero}</span>
                <span class="conf-card__data">${lista.dataApuracao}</span>
            </div>
            ${lista.acumulado ? '<span class="conf-acumulou">Acumulou!</span>' : ''}
            <div class="conf-dezenas">
                ${sorteados.map(n =>
                    `<span class="conf-dezena">${String(n).padStart(2,'0')}</span>`
                ).join('')}
            </div>
            <div class="conf-card__footer">
                <span>Concurso anterior: <b>${lista.numeroConcursoAnterior}</b></span>
                <span>Próximo: <b>${lista.numeroConcursoProximo}</b></span>
            </div>
        `;
        this.resultArea.appendChild(card);

        if (!meusTaloes || meusTaloes.length === 0) {
            const empty = document.createElement('p');
            empty.style.cssText = 'text-align:center;color:var(--text-muted);font-size:var(--fs-sm);padding:var(--sp-5)';
            empty.textContent = 'Nenhum talão cadastrado para esta loteria.';
            this.resultArea.appendChild(empty);
            return;
        }

        // ── Talões ordenados por acertos ───────────────────────────
        const sec = document.createElement('p');
        sec.className = 'conf-section-label';
        sec.textContent = 'SEUS TALÕES';
        this.resultArea.appendChild(sec);

        meusTaloes
            .map((numeros, index) => ({
                numeros,
                acertos: this.comparaNumeros(numeros.split(',').map(Number), sorteados),
                index,
            }))
            .sort((a, b) => b.acertos - a.acertos)
            .forEach(talao => {
                const t = document.createElement('div');
                t.className = 'conf-talao' + (talao.acertos > 0 ? ' conf-talao--hit' : '');
                t.innerHTML = `
                    <div class="conf-talao__head">
                        <span class="conf-talao__num">Talão ${talao.index + 1}</span>
                        <span class="conf-talao__acertos">${talao.acertos} acerto${talao.acertos !== 1 ? 's' : ''}</span>
                    </div>
                    <div class="conf-talao__numeros">${talao.numeros}</div>
                `;
                this.resultArea.appendChild(t);
            });
    }

    render() {
        const mainDiv = document.createElement('div');
        mainDiv.className = 'main';

        const containerDiv = document.createElement('div');
        containerDiv.className = 'container';

        // Input de concurso
        this.assetInput = document.createElement('input');
        this.assetInput.type        = 'text';
        this.assetInput.id          = 'buscaConcursos';
        this.assetInput.placeholder = 'Nº do Concurso';
        this.assetInput.className   = 'conf-input';
        this.assetInput.inputMode   = 'numeric';

        // Dica com concurso/data pré-carregado
        this.hintEl = document.createElement('p');
        this.hintEl.className = 'conf-hint';

        // Botão
        this.buscarButton = document.createElement('button');
        this.buscarButton.type      = 'button';
        this.buscarButton.className = 'btn sell conf-btn';
        this.buscarButton.textContent = 'Buscar';

        // Área de resultados
        this.resultArea = document.createElement('div');
        this.resultArea.className = 'conf-result-area';

        containerDiv.appendChild(this.assetInput);
        containerDiv.appendChild(this.hintEl);
        containerDiv.appendChild(this.buscarButton);
        containerDiv.appendChild(this.resultArea);
        mainDiv.appendChild(containerDiv);

        return { element: mainDiv, init: () => this.init() };
    }
}
