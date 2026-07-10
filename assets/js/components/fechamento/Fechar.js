import { getMatrices, generateCovering } from '../../data/coberturas/greedy.js';
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
    save: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
             <polyline points="17 21 17 13 7 13 7 21"/>
             <polyline points="7 3 7 8 15 8"/>
           </svg>`,
};

export default class Fechar {
    constructor(loteria, navigate = null) {
        this.loteria      = loteria;
        this.navigate     = navigate;
        this.modal        = new Modal();
        this.selected     = new Set();     // números marcados
        this.activeMatrix = null;          // { id, g, a, feasibility }
        this.lastTickets  = [];            // resultado da última geração

        // Refs DOM
        this._counter    = null;
        this._teclado    = null;
        this._panel      = null;
        this._matrixList = null;
        this._btnGerar   = null;
        this._results    = null;
    }

    // ── Ciclo de vida ──────────────────────────────────────────────
    init() {
        this.atualizaEstiloCabecalho();
        this.updateCounter();
    }

    atualizaEstiloCabecalho() {
        const h = document.querySelector('.app-header');
        if (h) { h.style.background = this.loteria.gradient; h.style.boxShadow = 'none'; }
        const t = document.getElementById('titulo');
        if (t) t.textContent = 'Fechamento';
    }

    // ── Interação ──────────────────────────────────────────────────
    toggleBall(n, btn) {
        if (this.selected.has(n)) {
            this.selected.delete(n);
            btn.classList.remove('bolas-selecionadas');
        } else {
            this.selected.add(n);
            btn.classList.add('bolas-selecionadas');
        }
        // Ao alterar seleção, resetar matriz escolhida e resultados
        this.activeMatrix = null;
        this.lastTickets  = [];
        this._results.hidden = true;
        this.updateCounter();
        if (!this._panel.hidden) this.updateMatrixList();
    }

    clearAll() {
        this.selected.clear();
        this.activeMatrix = null;
        this.lastTickets  = [];
        this._teclado.querySelectorAll('.bolas-selecionadas')
            .forEach(b => b.classList.remove('bolas-selecionadas'));
        this._panel.hidden   = true;
        this._results.hidden = true;
        this._btnGerar.disabled = true;
        this.updateCounter();
    }

    // ── Contador e painel de matrizes ─────────────────────────────
    updateCounter() {
        const N       = this.selected.size;
        const fechMin = this.loteria.fechMin;

        if (N < fechMin) {
            this._counter.textContent = `${N} dezenas — selecione pelo menos ${fechMin}`;
            this._panel.hidden = true;
        } else {
            this._counter.textContent = `${N} dezenas selecionadas`;
            if (this._panel.hidden) {
                this._panel.hidden = false;
                this.updateMatrixList();
            }
        }
    }

    updateMatrixList() {
        const N       = this.selected.size;
        const { min, draws, gMin } = this.loteria;
        const matrices = getMatrices(N, min, draws, gMin);

        this._matrixList.innerHTML = '';
        this._btnGerar.disabled    = true;
        this.activeMatrix          = null;

        if (matrices.length === 0) {
            const msg = document.createElement('p');
            msg.className   = 'fech-no-matrices';
            msg.textContent = `Nenhum fechamento disponível para cálculo automático com ${N} dezenas. `
                            + `O cálculo em tempo real requer selecionar próximo ao mínimo da loteria (${min} dezenas).`;
            this._matrixList.appendChild(msg);
            return;
        }

        matrices.forEach(m => {
            const row = document.createElement('button');
            row.type      = 'button';
            row.className = 'fech-matrix-row';

            const idEl = document.createElement('span');
            idEl.className   = 'fech-matrix-id';
            idEl.textContent = m.id;

            const descEl = document.createElement('span');
            descEl.className   = 'fech-matrix-desc';
            descEl.textContent = m.desc;

            row.append(idEl, descEl);

            if (m.feasibility === 'slow') {
                row.classList.add('fech-matrix-row--slow');
                const badge = document.createElement('span');
                badge.className   = 'fech-badge';
                badge.textContent = '⏱';
                badge.title       = 'Pode demorar alguns segundos';
                row.appendChild(badge);
            }

            row.addEventListener('click', () => {
                this._matrixList.querySelectorAll('.fech-matrix-row--active')
                    .forEach(r => r.classList.remove('fech-matrix-row--active'));
                row.classList.add('fech-matrix-row--active');
                this.activeMatrix       = m;
                this._btnGerar.disabled = false;
            });

            this._matrixList.appendChild(row);
        });
    }

    // ── Geração do fechamento ──────────────────────────────────────
    gerarFechamento() {
        if (!this.activeMatrix) return;

        const { g, a, id, feasibility: feas } = this.activeMatrix;
        const dezenas = Array.from(this.selected).sort((x, y) => x - y);

        // Mostra spinner imediatamente
        this._results.hidden  = false;
        this._btnGerar.disabled = true;
        this._results.innerHTML = `
            <div class="fech-computing">
                <div class="fech-spinner"></div>
                <p class="fech-computing-label">Calculando ${id}…</p>
                ${feas === 'slow'
                    ? '<p class="fech-slow-warn">⏱ Esta matriz pode levar alguns segundos — aguarde.</p>'
                    : ''}
            </div>`;

        // Cede para o browser renderizar o spinner antes de bloquear
        setTimeout(() => {
            const result = generateCovering(dezenas, this.loteria.min, g, a, 100, 8_000);
            this.lastTickets        = result.tickets;
            this._btnGerar.disabled = false;
            this.showResults(result);
        }, 60);
    }

    // ── Exibição dos resultados ────────────────────────────────────
    showResults({ tickets, total, covered, timedOut }) {
        const { preco, accentColor } = this.loteria;
        const pct       = total > 0 ? Math.round((covered / total) * 100) : 0;
        const totalCost = (tickets.length * preco)
            .toFixed(2).replace('.', ',');

        this._results.innerHTML = '';

        // ── Resumo ─────────────────────────────────────────────
        const summary = document.createElement('div');
        summary.className = 'fech-summary';

        const rows = [
            ['Fechamento',  this.activeMatrix.id],
            ['Talões',      `${tickets.length} cartões de ${this.loteria.min} dezenas`],
            ['Total',       `R$ ${totalCost}`, 'fech-price'],
            ['Cobertura',   `${covered}/${total} cenários (${pct}%)`],
        ];
        rows.forEach(([label, value, extra]) => {
            const r = document.createElement('div');
            r.className = 'fech-summary-row';
            r.innerHTML = `<span class="fech-summary-label">${label}</span>
                           <span class="fech-summary-value${extra ? ' ' + extra : ''}">${value}</span>`;
            summary.appendChild(r);
        });
        this._results.appendChild(summary);

        // ── Avisos ─────────────────────────────────────────────
        if (timedOut || covered < total) {
            const warn = document.createElement('p');
            warn.className = 'fech-warn';
            warn.textContent = timedOut
                ? `⚠ Tempo esgotado. ${tickets.length} talões gerados com cobertura parcial (${pct}%).`
                : `⚠ Cobertura parcial: ${pct}% dos cenários cobertos com ${tickets.length} talões (limite de 100 atingido).`;
            this._results.appendChild(warn);
        }

        if (tickets.length === 0) {
            const msg = document.createElement('p');
            msg.className   = 'fech-no-matrices';
            msg.textContent = 'Nenhum talão gerado. Tente escolher outro tipo de fechamento.';
            this._results.appendChild(msg);
            return;
        }

        // ── Lista de talões ────────────────────────────────────
        const list = document.createElement('div');
        list.className = 'fech-ticket-list';

        tickets.forEach((t, i) => {
            const row = document.createElement('div');
            row.className = 'fech-ticket';

            const num = document.createElement('span');
            num.className   = 'fech-ticket-num';
            num.textContent = `#${String(i + 1).padStart(2, '0')}`;
            row.appendChild(num);

            t.forEach(n => {
                const ball = document.createElement('span');
                ball.className   = 'fech-ball';
                ball.textContent = String(n).padStart(2, '0');
                row.appendChild(ball);
            });

            list.appendChild(row);
        });
        this._results.appendChild(list);

        // ── Botão salvar ───────────────────────────────────────
        const saveBtn = document.createElement('button');
        saveBtn.type      = 'button';
        saveBtn.className = 'fech-btn-save';
        saveBtn.innerHTML = `${SVG.save}<span>Salvar ${tickets.length} talões</span>`;
        saveBtn.addEventListener('click', () => this.salvarTodos(tickets));
        this._results.appendChild(saveBtn);

        this._results.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // ── Persistência ───────────────────────────────────────────────
    salvarTodos(tickets) {
        const { simb, nome } = this.loteria;
        tickets.forEach(t => {
            const str = t.map(n => String(n).padStart(2, '0')).join(',');
            new LocalStorageJS(str).salvarLoteria(simb, nome);
        });
        this.modal.exibeModal(`${tickets.length} talões salvos com sucesso!`);
    }

    // ── Render ─────────────────────────────────────────────────────
    render() {
        const main = document.createElement('div');
        main.className        = 'main';
        main.dataset.loteria  = this.loteria.nome;

        const wrap = document.createElement('div');
        wrap.className = 'fech-wrap';

        // ── Barra superior ─────────────────────────────────────
        const topBar = document.createElement('div');
        topBar.className = 'fech-top';

        this._counter = document.createElement('span');
        this._counter.className = 'fech-counter';

        const clearBtn = document.createElement('button');
        clearBtn.type      = 'button';
        clearBtn.className = 'fech-clear';
        clearBtn.setAttribute('aria-label', 'Limpar seleção');
        clearBtn.innerHTML = SVG.trash;
        clearBtn.addEventListener('click', () => this.clearAll());

        topBar.append(this._counter, clearBtn);
        wrap.appendChild(topBar);

        // ── Banner de aviso + link para políticas ──────────────
        const disclaimer = document.createElement('div');
        disclaimer.className = 'fech-disclaimer';
        disclaimer.innerHTML = `
            <div class="fech-disclaimer-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17" stroke-width="2.5"/>
                </svg>
            </div>
            <div class="fech-disclaimer-text">
                <strong>Nenhum ganho é garantido.</strong>
                O fechamento aumenta a cobertura matemática das suas dezenas, mas não elimina o acaso do sorteio.
                Jogue com responsabilidade. Limite: 100 talões por fechamento.
            </div>
        `;

        const polBtn = document.createElement('button');
        polBtn.type      = 'button';
        polBtn.className = 'fech-pol-btn';
        polBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 width="14" height="14">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17" stroke-width="2.5"/>
            </svg>
            Políticas de Uso
        `;
        polBtn.addEventListener('click', () => this.navigate && this.navigate('politicas'));
        disclaimer.appendChild(polBtn);

        wrap.appendChild(disclaimer);

        // ── Teclado numérico ───────────────────────────────────
        this._teclado = document.createElement('div');
        this._teclado.id = 'teclado';

        for (let i = 1; i <= this.loteria.max; i++) {
            const btn = document.createElement('button');
            btn.type        = 'button';
            btn.className   = 'bolas';
            btn.id          = `fn${String(i).padStart(2, '0')}`;
            btn.textContent = String(i).padStart(2, '0');
            btn.addEventListener('click', () => this.toggleBall(i, btn));
            this._teclado.appendChild(btn);
        }
        wrap.appendChild(this._teclado);

        // ── Painel de escolha de matriz ────────────────────────
        this._panel = document.createElement('div');
        this._panel.className = 'fech-panel';
        this._panel.hidden    = true;

        const panelTitle = document.createElement('p');
        panelTitle.className   = 'fech-panel-title';
        panelTitle.textContent = 'Tipo de Fechamento';

        this._matrixList = document.createElement('div');
        this._matrixList.className = 'fech-matrix-list';

        this._btnGerar = document.createElement('button');
        this._btnGerar.type      = 'button';
        this._btnGerar.className = 'fech-btn-gerar';
        this._btnGerar.disabled  = true;
        this._btnGerar.textContent = 'Gerar Fechamento';
        this._btnGerar.addEventListener('click', () => this.gerarFechamento());

        this._panel.append(panelTitle, this._matrixList, this._btnGerar);
        wrap.appendChild(this._panel);

        // ── Painel de resultados ───────────────────────────────
        this._results = document.createElement('div');
        this._results.className = 'fech-results';
        this._results.hidden    = true;
        wrap.appendChild(this._results);

        main.appendChild(wrap);
        return { element: main, init: () => this.init() };
    }
}
