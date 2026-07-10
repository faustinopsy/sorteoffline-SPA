import BuscaApi from '../lib/BuscaApi.js';
import LocalStorageJS from '../lib/LocalStorage.js';
import Modal from '../lib/Modal.js';

/**
 * AnalisarJogos — Módulo de Análise Estatística e Geração de Jogos Elite
 *
 * Algoritmo:
 *   1. Busca os últimos N concursos via API (com cache localStorage)
 *   2. Calcula a frequência de cada dezena no período
 *   3. Ranqueia e separa em: Fortes (base fixa) | Médios (rotação) | Frios (excluídos)
 *   4. Gera 6 jogos completos com máxima diversidade nos médios (via combinatória)
 *   5. Permite salvar cada jogo individualmente, salvar todos, ou baixar como .txt
 *
 * Proporções por loteria:
 *   - Lotofácil (min=15): 12 fixos + 3 rotativos
 *   - Mega-Sena (min=6):   4 fixos + 2 rotativos
 *   - Quina     (min=5):   3 fixos + 2 rotativos
 *   - Lotomania (min=50): 44 fixos + 6 rotativos
 */
export default class AnalisarJogos {
    constructor(loteria) {
        this.maxNumeros = loteria.max;
        this.minNumeros = loteria.min;
        this.tipo       = loteria.nome;
        this.simbolo    = loteria.simb;
        this.modal      = new Modal();
        this.jogosGerados       = [];
        this.isLoading          = false;
        this.quantidadeConcursos = 10;

        // Define proporções de fixos vs rotativos de acordo com o tamanho do jogo
        if (this.minNumeros <= 6) {
            this.qtdFixos    = this.minNumeros - 2; // min 2 rotativos
            this.qtdRotativos = 2;
        } else if (this.minNumeros <= 20) {
            this.qtdFixos    = this.minNumeros - 3; // 3 rotativos (padrão Lotofácil)
            this.qtdRotativos = 3;
        } else {
            this.qtdFixos    = this.minNumeros - 6; // 6 rotativos para jogos grandes (Lotomania)
            this.qtdRotativos = 6;
        }

        // Pool de médios = qtdRotativos * 3 garante diversidade nas 6 combinações
        this.tamanhoPiscina = this.qtdRotativos * 3;
    }

    // ─── API ──────────────────────────────────────────────────────────────────

    /**
     * Busca múltiplos concursos sequencialmente, aproveitando o cache do BuscaApi.
     * Primeiro obtém o último concurso para descobrir o número atual,
     * depois retrocede N-1 concursos.
     */
    async buscarMultiplosConcursos(quantidade) {
        // Busca o último concurso (string vazia → API retorna o mais recente)
        const primeiraBusca = new BuscaApi('', this.tipo);
        const ultimo = await primeiraBusca.buscaResultadosAPI();

        if (!ultimo) {
            throw new Error('Não foi possível conectar à API da Caixa. Verifique sua conexão.');
        }

        const numeroUltimo = parseInt(ultimo.numero, 10);
        const concursos = [ultimo];

        // Busca os concursos anteriores (usa cache quando disponível)
        for (let i = 1; i < quantidade; i++) {
            const numeroAlvo = numeroUltimo - i;
            if (numeroAlvo < 1) break;

            this.atualizaStatusUI(`⏳ Carregando concurso ${numeroAlvo}... (${i}/${quantidade - 1})`);

            const busca = new BuscaApi(String(numeroAlvo), this.tipo);
            const resultado = await busca.buscaResultadosAPI();
            if (resultado) concursos.push(resultado);
        }

        return concursos;
    }

    // ─── ESTATÍSTICAS ─────────────────────────────────────────────────────────

    /**
     * Conta a frequência de cada dezena em todos os concursos fornecidos.
     * Compatível com os campos 'listaDezenas' e 'dezenas' da API da Caixa.
     */
    calcularFrequencia(concursos) {
        const frequencia = {};
        for (let i = 1; i <= this.maxNumeros; i++) frequencia[i] = 0;

        concursos.forEach(c => {
            // A API pode retornar 'listaDezenas' (padrão atual) ou 'dezenas' (legado)
            const dezenas = c.listaDezenas || c.dezenas || [];
            dezenas.forEach(n => {
                const num = parseInt(n, 10);
                if (Object.prototype.hasOwnProperty.call(frequencia, num)) {
                    frequencia[num]++;
                }
            });
        });

        return frequencia;
    }

    /**
     * Ordena as dezenas por frequência decrescente.
     * Em caso de empate, o número menor tem prioridade (estabilidade).
     */
    rankearNumeros(frequencia) {
        return Object.keys(frequencia)
            .map(n => ({ numero: parseInt(n, 10), qtd: frequencia[n] }))
            .sort((a, b) => b.qtd - a.qtd || a.numero - b.numero);
    }

    // ─── GERAÇÃO DE JOGOS ─────────────────────────────────────────────────────

    /**
     * Gera todas as combinações de `tamanho` elementos do array `arr`.
     * Algoritmo recursivo clássico (backtracking).
     * @param {number[]} arr   - Pool de números
     * @param {number}   tamanho - Quantos números em cada combinação
     * @returns {number[][]}
     */
    gerarTodasCombinacoes(arr, tamanho) {
        const resultado = [];

        function backtrack(inicio, combo) {
            if (combo.length === tamanho) {
                resultado.push([...combo]);
                return;
            }
            for (let i = inicio; i < arr.length; i++) {
                combo.push(arr[i]);
                backtrack(i + 1, combo);
                combo.pop();
            }
        }

        backtrack(0, []);
        return resultado;
    }

    /**
     * Seleciona 6 combinações com distribuição uniforme do array total.
     * Garante máxima diversidade: pega primeiro, último e 4 igualmente espaçados.
     */
    selecionarCombinacoesDistribuidas(combinacoes) {
        const total = combinacoes.length;
        if (total <= 6) return combinacoes;

        const indices = new Set([0, total - 1]);
        const passo = Math.floor(total / 5);
        for (let i = 1; i <= 4; i++) {
            indices.add(Math.min(i * passo, total - 1));
        }

        return [...indices].slice(0, 6).map(idx => combinacoes[idx]);
    }

    /**
     * Gera 6 jogos completos: base fixa (fortes) + combinações dos médios.
     * @param {number[]} fortes - Dezenas fixas em todos os jogos
     * @param {number[]} medios - Pool de dezenas rotativas
     * @returns {string[]} Array de 6 strings no formato canônico "03,12,27,..."
     */
    gerarJogos(fortes, medios) {
        // Garante que o pool de médios tem o mínimo necessário para 6 combinações únicas
        const piscina = medios.slice(0, this.tamanhoPiscina);

        const todasCombinacoes = this.gerarTodasCombinacoes(piscina, this.qtdRotativos);
        const selecionadas = this.selecionarCombinacoesDistribuidas(todasCombinacoes);

        return selecionadas.map(combo => {
            const jogoCompleto = [...fortes, ...combo].sort((a, b) => a - b);
            return jogoCompleto.map(n => n.toString().padStart(2, '0')).join(',');
        });
    }

    // ─── FLUXO PRINCIPAL ──────────────────────────────────────────────────────

    /** Ponto de entrada do fluxo de análise. Chamado pelo botão "Analisar". */
    async analisar() {
        if (this.isLoading) return;
        this.isLoading = true;

        this.jogosGerados = [];
        this.limparResultado();
        this.atualizaStatusUI(`⏳ Buscando dados dos últimos ${this.quantidadeConcursos} concursos...`);

        try {
            const concursos = await this.buscarMultiplosConcursos(this.quantidadeConcursos);

            this.atualizaStatusUI(`🔢 Calculando frequências de ${concursos.length} concursos...`);

            const frequencia  = this.calcularFrequencia(concursos);
            const ranking     = this.rankearNumeros(frequencia);

            const fortes  = ranking.slice(0, this.qtdFixos).map(d => d.numero);
            const medios  = ranking.slice(this.qtdFixos, this.qtdFixos + this.tamanhoPiscina).map(d => d.numero);
            const frios   = ranking.slice(this.maxNumeros - 5).map(d => d.numero);

            this.jogosGerados = this.gerarJogos(fortes, medios);

            this.atualizaStatusUI(`✅ ${this.jogosGerados.length} jogos gerados com base em ${concursos.length} concursos!`);
            this.renderizarResultado(ranking, fortes, medios, frios, concursos.length);

        } catch (error) {
            this.atualizaStatusUI('❌ Erro ao buscar dados. Verifique sua conexão.');
            this.modal.exibeModal(`Falha na análise: ${error.message}`);
        } finally {
            this.isLoading = false;
        }
    }

    // ─── PERSISTÊNCIA ─────────────────────────────────────────────────────────

    /** Salva um único jogo no localStorage no formato canônico do projeto. */
    salvarJogo(jogo, indexExibicao) {
        const ls = new LocalStorageJS(jogo);
        ls.salvarLoteria(this.simbolo, this.tipo);
        this.modal.exibeModal(`Jogo ${indexExibicao} salvo com sucesso!`);
    }

    /** Salva todos os jogos gerados de uma vez. */
    salvarTodos() {
        if (this.jogosGerados.length === 0) {
            this.modal.exibeModal('Nenhum jogo gerado. Clique em Analisar primeiro.');
            return;
        }
        this.jogosGerados.forEach(jogo => {
            const ls = new LocalStorageJS(jogo);
            ls.salvarLoteria(this.simbolo, this.tipo);
        });
        this.modal.exibeModal(`${this.jogosGerados.length} jogos salvos com sucesso! Acesse "Listar" para conferir.`);
    }

    /** Gera e baixa um arquivo .txt com os jogos (um por linha, vírgula como separador). */
    baixarTxt() {
        if (this.jogosGerados.length === 0) {
            this.modal.exibeModal('Nenhum jogo para baixar. Clique em Analisar primeiro.');
            return;
        }
        const conteudo = this.jogosGerados.join('\n');
        const blob = new Blob([conteudo], { type: 'text/plain' });
        const url  = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href     = url;
        a.download = `jogos_${this.tipo}_elite_${this.quantidadeConcursos}concursos.txt`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // ─── RENDERIZAÇÃO ─────────────────────────────────────────────────────────

    atualizaStatusUI(texto) {
        const el = document.getElementById('analise-status');
        if (el) el.textContent = texto;
    }

    limparResultado() {
        const el = document.getElementById('analise-resultado');
        if (el) el.innerHTML = '';
    }

    renderizarResultado(ranking, fortes, medios, frios, totalConcursos) {
        const container = document.getElementById('analise-resultado');
        if (!container) return;
        container.innerHTML = '';

        // ── Painel de estatísticas ────────────────────────────────────────────
        const stats = document.createElement('div');
        stats.className = 'analise-stats';

        const statsTitle = document.createElement('p');
        statsTitle.className = 'analise-stats__title';
        statsTitle.textContent = `Resumo: ${totalConcursos} concursos analisados`;
        stats.appendChild(statsTitle);

        const criarGrupo = (label, cor, numeros) => {
            const row = document.createElement('div');
            row.className = 'analise-stats__row';

            const lbl = document.createElement('span');
            lbl.className = 'analise-stats__label';
            lbl.style.color = cor;
            lbl.textContent = label;
            row.appendChild(lbl);

            const balls = document.createElement('div');
            balls.className = 'analise-balls';
            numeros.forEach(n => {
                const b = document.createElement('span');
                b.className = 'analise-ball';
                b.style.borderColor = cor + '55';
                b.style.color = cor;
                b.textContent = String(n).padStart(2, '0');
                balls.appendChild(b);
            });
            row.appendChild(balls);
            return row;
        };

        stats.appendChild(criarGrupo('Fortes', '#f97316', fortes));
        stats.appendChild(criarGrupo('Médios', '#a78bfa', medios));
        stats.appendChild(criarGrupo('Frios',  '#60a5fa', frios));
        container.appendChild(stats);

        // ── Seção label ───────────────────────────────────────────────────────
        const secLabel = document.createElement('p');
        secLabel.className = 'conf-section-label';
        secLabel.textContent = `${this.jogosGerados.length} JOGOS GERADOS`;
        container.appendChild(secLabel);

        // ── Cards dos jogos ───────────────────────────────────────────────────
        this.jogosGerados.forEach((jogo, i) => {
            const dezenas = jogo.split(',');
            const fortesSet = new Set(fortes.map(n => String(n).padStart(2, '0')));

            const card = document.createElement('div');
            card.className = 'analise-jogo-card';
            card.id = `jogo-gerado-${i}`;

            const head = document.createElement('div');
            head.className = 'analise-jogo-card__head';

            const num = document.createElement('span');
            num.className = 'analise-jogo-card__num';
            num.textContent = `Jogo ${i + 1}`;

            const btnSalvar = document.createElement('button');
            btnSalvar.type = 'button';
            btnSalvar.className = 'analise-jogo-card__save';
            btnSalvar.setAttribute('aria-label', `Salvar jogo ${i + 1}`);
            btnSalvar.innerHTML = '💾 Salvar';
            btnSalvar.addEventListener('click', () => this.salvarJogo(jogo, i + 1));

            head.appendChild(num);
            head.appendChild(btnSalvar);
            card.appendChild(head);

            const balls = document.createElement('div');
            balls.className = 'analise-balls';
            dezenas.forEach(dez => {
                const b = document.createElement('span');
                b.className = 'analise-ball' + (fortesSet.has(dez) ? ' analise-ball--forte' : ' analise-ball--rotativo');
                b.textContent = dez;
                balls.appendChild(b);
            });
            card.appendChild(balls);
            container.appendChild(card);
        });

        // ── Ações globais ─────────────────────────────────────────────────────
        if (this.jogosGerados.length > 0) {
            const actions = document.createElement('div');
            actions.className = 'analise-actions';

            const btnTodos = document.createElement('button');
            btnTodos.type = 'button';
            btnTodos.className = 'btn analise-btn-todos';
            btnTodos.textContent = '💾 Salvar todos';
            btnTodos.addEventListener('click', () => this.salvarTodos());

            const btnDown = document.createElement('button');
            btnDown.type = 'button';
            btnDown.className = 'btn analise-btn-txt';
            btnDown.textContent = '⬇ Baixar .txt';
            btnDown.addEventListener('click', () => this.baixarTxt());

            actions.appendChild(btnTodos);
            actions.appendChild(btnDown);
            container.appendChild(actions);
        }
    }

    // ─── CICLO DE VIDA (contrato do projeto) ──────────────────────────────────

    atualizaEstiloCabecalho() {
        const cabecalho = document.querySelector('.app-header');
        if (cabecalho) {
            cabecalho.style.background = 'linear-gradient(to bottom, #000000, #0d2b4e, #0057b7)';
            cabecalho.style.boxShadow  = 'none';
        }
    }

    bindEvents() {
        const btnAnalisar = document.getElementById('btn-analisar');
        const select      = document.getElementById('qtd-concursos');

        if (btnAnalisar) {
            btnAnalisar.addEventListener('click', () => {
                this.quantidadeConcursos = parseInt(select?.value, 10) || 10;
                this.analisar();
            });
        }
    }

    init() {
        this.atualizaEstiloCabecalho();
        // Atualiza o subtítulo do header com o nome da loteria
        const titulo = document.getElementById('titulo');
        if (titulo) titulo.textContent = `🧠 Análise ${this.tipo.charAt(0).toUpperCase() + this.tipo.slice(1)}`;
        this.bindEvents();
    }

    render() {
        // Atualiza título provisório antes do init (render roda antes do append no DOM)
        const tituloEl = document.getElementById('titulo');
        if (tituloEl) tituloEl.textContent = '🧠 Análise';

        const mainDiv = document.createElement('div');
        mainDiv.className = 'main';

        const containerDiv = document.createElement('div');
        containerDiv.className = 'container';

        // ── Controles ─────────────────────────────────────────────────────────
        const ctrlDiv = document.createElement('div');
        ctrlDiv.style.cssText = 'display:flex;gap:8px;width:96%;margin:10px 0 4px;align-items:center;';

        const label = document.createElement('label');
        label.setAttribute('for', 'qtd-concursos');
        label.style.display = 'none'; // label acessível mas invisível
        label.textContent = 'Quantidade de concursos';

        const select = document.createElement('select');
        select.id = 'qtd-concursos';
        select.setAttribute('aria-label', 'Quantidade de concursos a analisar');
        select.className = 'analise-select';

        [5, 10, 15, 20, 30].forEach(v => {
            const opt = document.createElement('option');
            opt.value = String(v);
            opt.textContent = `Últimos ${v} concursos`;
            if (v === 10) opt.selected = true;
            select.appendChild(opt);
        });

        const btnAnalisar = document.createElement('button');
        btnAnalisar.type = 'button';
        btnAnalisar.id   = 'btn-analisar';
        btnAnalisar.textContent = '🔍 Analisar';
        btnAnalisar.className = 'btn analise-btn-analisar';
        btnAnalisar.setAttribute('aria-label', 'Iniciar análise estatística e gerar jogos');

        ctrlDiv.appendChild(label);
        ctrlDiv.appendChild(select);
        ctrlDiv.appendChild(btnAnalisar);
        containerDiv.appendChild(ctrlDiv);

        // ── Status ────────────────────────────────────────────────────────────
        const statusDiv = document.createElement('div');
        statusDiv.id = 'analise-status';
        statusDiv.setAttribute('role', 'status');
        statusDiv.setAttribute('aria-live', 'polite');
        statusDiv.className = 'analise-status';
        statusDiv.textContent = 'Selecione a quantidade de concursos e clique em Analisar.';
        containerDiv.appendChild(statusDiv);

        // ── Área de resultado ─────────────────────────────────────────────────
        const resultadoDiv = document.createElement('div');
        resultadoDiv.id = 'analise-resultado';
        resultadoDiv.style.width = '100%';
        containerDiv.appendChild(resultadoDiv);

        mainDiv.appendChild(containerDiv);

        return {
            element: mainDiv,
            init: () => this.init()
        };
    }
}
