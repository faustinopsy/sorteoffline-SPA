import LocalStorageJS from '../lib/LocalStorage.js';
import Modal from '../lib/Modal.js';

const SVG = {
    trash: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
            </svg>`,
    save:  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>`,
    upload:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>`,
};

export default class Cadastrar {
    constructor(loteria) {
        this.displayValue = '0';
        this.buscalocal   = null;
        this.maxNumeros   = loteria.max;
        this.minNumeros   = loteria.min;
        this.tipo         = loteria.nome;
        this.simbolo      = loteria.simb;
        this.modal        = new Modal();
        this.fileInput    = null;

        // refs
        this._displayEl  = null;
        this._counterEl  = null;
        this._saveBtn    = null;
        this._progressEl = null;
    }

    // ── Lifecycle ──────────────────────────────────────────────────
    init() {
        this.bindEvents();
        this.updateDisplay();
        this.atualizaEstiloCabecalho();
    }

    atualizaEstiloCabecalho() {
        const cabecalho = document.querySelector('.app-header');
        if (cabecalho) {
            cabecalho.style.background = 'linear-gradient(to bottom, rgb(0 0 0), #c44bbc, rgb(194 71 187))';
            cabecalho.style.boxShadow  = 'none';
        }
        const titulo = document.getElementById('titulo');
        if (titulo) titulo.textContent = 'Cadastrar';
    }

    bindEvents() {
        document.getElementById('bclear')
            .addEventListener('click', () => this.clearDisplay());

        document.querySelectorAll('.bolas').forEach(btn => {
            if (!['bclear','colocarnocarrinho'].includes(btn.id)) {
                btn.addEventListener('click', () => this.pressButton(btn.textContent.trim()));
            }
        });

        document.getElementById('colocarnocarrinho')
            .addEventListener('click', () => this.salvar());

        const fileInput = document.getElementById('fileInput');
        this.fileInput  = fileInput;
        document.getElementById('carregarTxt')
            .addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', e => this.handleFileUpload(e));
    }

    // ── Display ────────────────────────────────────────────────────
    updateDisplay() {
        const selecionados = this.displayValue === '0'
            ? []
            : this.displayValue.split(',').map(Number).sort((a, b) => a - b);

        const count = selecionados.length;
        const total = this.minNumeros;

        // Bolinhas no display
        this._displayEl.innerHTML = '';
        if (count === 0) {
            const hint = document.createElement('span');
            hint.className = 'cad-display__hint';
            hint.textContent = `Selecione ${total} número${total !== 1 ? 's' : ''}`;
            this._displayEl.appendChild(hint);
        } else {
            selecionados.forEach(n => {
                const b = document.createElement('span');
                b.className   = 'cad-display__ball';
                b.textContent = String(n).padStart(2, '0');
                this._displayEl.appendChild(b);
            });
        }

        // Contador e barra de progresso
        this._counterEl.textContent = `${count} / ${total}`;
        const pct = Math.round((count / total) * 100);
        this._progressEl.style.width = `${pct}%`;
        this._progressEl.style.background = count === total
            ? 'var(--success)'
            : 'var(--primary)';

        // Habilitar botão de salvar
        this._saveBtn.disabled = count !== total;
    }

    // ── Interação com teclado ──────────────────────────────────────
    pressButton(num) {
        let selecionados = this.displayValue === '0' ? [] : this.displayValue.split(',');
        const idx = selecionados.indexOf(num);
        if (idx > -1) {
            selecionados.splice(idx, 1);
            document.getElementById(`n${num}`)?.classList.remove('bolas-selecionadas');
        } else if (selecionados.length < this.minNumeros) {
            selecionados.push(num);
            document.getElementById(`n${num}`)?.classList.add('bolas-selecionadas');
        }
        this.displayValue = selecionados.length ? selecionados.join(',') : '0';
        this.updateDisplay();
    }

    clearDisplay() {
        this.displayValue = '0';
        document.querySelectorAll('.bolas').forEach(b => b.classList.remove('bolas-selecionadas'));
        this.updateDisplay();
    }

    // ── Persistência ───────────────────────────────────────────────
    salvar() {
        const ordenados = this.displayValue.split(',')
            .map(Number).sort((a, b) => a - b)
            .map(n => String(n).padStart(2, '0')).join(',');

        this.buscalocal = new LocalStorageJS(ordenados);
        this.buscalocal.salvarLoteria(this.simbolo, this.tipo);
        this.clearDisplay();
        this.modal.exibeModal('Talão salvo com sucesso!');
    }

    // ── Upload de arquivo ──────────────────────────────────────────
    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        if (file.type !== 'text/plain') {
            this.modal.exibeModal('Apenas arquivos .txt são permitidos.');
            this.resetFileInput();
            return;
        }
        const reader = new FileReader();
        reader.onload = e => {
            try {
                const taloes = this.validarTaloesDoArquivo(e.target.result);
                this.salvarMultiplosTaloes(taloes);
            } catch (err) {
                this.modal.exibeModal(`Erro no arquivo: ${err.message}`);
            }
            this.resetFileInput();
        };
        reader.onerror = () => {
            this.modal.exibeModal('Erro ao ler o arquivo.');
            this.resetFileInput();
        };
        reader.readAsText(file);
    }

    validarTaloesDoArquivo(content) {
        const linhas = content.split('\n').map(l => l.trim()).filter(Boolean);
        if (!linhas.length) throw new Error('O arquivo está vazio.');

        return linhas.map((linha, i) => {
            const nums = linha.split(/[, ]+/).map(Number);
            if (nums.length !== this.minNumeros)
                throw new Error(`Linha ${i + 1}: esperado ${this.minNumeros} números, encontrado ${nums.length}.`);
            if (nums.some(n => isNaN(n) || n < 1 || n > this.maxNumeros))
                throw new Error(`Linha ${i + 1}: número fora do intervalo 01–${this.maxNumeros}.`);
            return nums.sort((a, b) => a - b).map(n => String(n).padStart(2, '0')).join(',');
        });
    }

    salvarMultiplosTaloes(taloes) {
        taloes.forEach(t => new LocalStorageJS(t).salvarLoteria(this.simbolo, this.tipo));
        this.modal.exibeModal(`${taloes.length} talões carregados e salvos com sucesso!`);
    }

    resetFileInput() {
        if (this.fileInput) this.fileInput.value = null;
    }

    // ── Render ─────────────────────────────────────────────────────
    render() {
        const mainDiv = document.createElement('div');
        mainDiv.className = 'main';
        mainDiv.dataset.loteria = this.tipo;

        const container = document.createElement('div');
        container.className = 'container';

        // ── Display de números selecionados ───────────────────────
        this._displayEl = document.createElement('div');
        this._displayEl.id        = 'display';
        this._displayEl.className = 'cad-display';
        this._displayEl.setAttribute('aria-label', 'Números selecionados');

        // Linha de progresso
        const progressWrap = document.createElement('div');
        progressWrap.className = 'cad-progress-wrap';

        this._counterEl = document.createElement('span');
        this._counterEl.className = 'cad-counter';
        this._counterEl.textContent = `0 / ${this.minNumeros}`;

        const progressBar = document.createElement('div');
        progressBar.className = 'cad-progress-bar';
        this._progressEl = document.createElement('div');
        this._progressEl.className = 'cad-progress-fill';
        progressBar.appendChild(this._progressEl);

        progressWrap.appendChild(this._counterEl);
        progressWrap.appendChild(progressBar);

        container.appendChild(this._displayEl);
        container.appendChild(progressWrap);

        // ── Barra de ações (abaixo do display) ───────────────────
        const actionBar = document.createElement('div');
        actionBar.className = 'cad-action-bar';

        // Limpar
        const clearBtn = document.createElement('button');
        clearBtn.type      = 'button';
        clearBtn.id        = 'bclear';
        clearBtn.className = 'cad-btn cad-btn--clear';
        clearBtn.setAttribute('aria-label', 'Limpar seleção');
        clearBtn.innerHTML = SVG.trash + '<span>Limpar</span>';

        // Salvar
        this._saveBtn = document.createElement('button');
        this._saveBtn.type      = 'button';
        this._saveBtn.id        = 'colocarnocarrinho';
        this._saveBtn.className = 'cad-btn cad-btn--save';
        this._saveBtn.disabled  = true;
        this._saveBtn.setAttribute('aria-label', 'Salvar talão');
        this._saveBtn.innerHTML = SVG.save + '<span>Salvar talão</span>';

        actionBar.appendChild(clearBtn);
        actionBar.appendChild(this._saveBtn);
        container.appendChild(actionBar);

        // ── Teclado numérico ──────────────────────────────────────
        const teclado = document.createElement('div');
        teclado.id = 'teclado';
        for (let i = 1; i <= this.maxNumeros; i++) {
            const btn = document.createElement('button');
            btn.type        = 'button';
            btn.className   = 'bolas';
            btn.id          = `n${String(i).padStart(2, '0')}`;
            btn.textContent = String(i).padStart(2, '0');
            teclado.appendChild(btn);
        }
        container.appendChild(teclado);

        mainDiv.appendChild(container);

        // ── FAB upload ────────────────────────────────────────────
        const fab = document.createElement('button');
        fab.type      = 'button';
        fab.id        = 'carregarTxt';
        fab.className = 'fab cad-fab';
        fab.setAttribute('aria-label', 'Carregar talões de arquivo .txt');
        fab.title     = 'Importar .txt';
        fab.innerHTML = SVG.upload;

        const fileInput = document.createElement('input');
        fileInput.type    = 'file';
        fileInput.id      = 'fileInput';
        fileInput.accept  = '.txt';
        fileInput.style.display = 'none';

        mainDiv.appendChild(fab);
        mainDiv.appendChild(fileInput);

        return { element: mainDiv, init: () => this.init() };
    }
}
