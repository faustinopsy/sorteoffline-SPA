import LocalStorageJS from '../lib/LocalStorage.js';

export default class CombinaMania {
    constructor() {
        this.numerosSelecionados = new Set();
        this.maxNumeros = 100;
    }

    salvarCombinacoes(combinacoes) {
        combinacoes.forEach(combinacao => {
            const combinacaoString = combinacao.map(num => num < 10 ? '0' + num : num).join(',');
            this.buscalocal = new LocalStorageJS(combinacaoString);
            this.buscalocal.salvarLoteria('mania', 'lotomania');
        });

        this.exibeModal('Combinações salvas com sucesso!');
    }

    exibeModal(mensagem) {
        Swal.fire({
            title: mensagem,
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

    gerarCombinacoes(arr, tamanho, limite) {
        function auxiliar(init, left, k) {
            if (resultados.length >= limite) {
                return;
            }
            if (k === 0) {
                resultados.push(init);
                return;
            }
            for (let i = 0; i <= left.length - k; i++) {
                auxiliar(init.concat(left[i]), left.slice(i + 1), k - 1);
            }
        }

        var resultados = [];
        auxiliar([], arr, tamanho);
        return resultados;
    }

    selecionarCombinacoesAleatorias(combinacoes, quantidade) {
        let selecionadas = [];
        let indicesUsados = new Set();

        while (selecionadas.length < quantidade) {
            let indiceAleatorio = Math.floor(Math.random() * combinacoes.length);
            if (!indicesUsados.has(indiceAleatorio)) {
                selecionadas.push(combinacoes[indiceAleatorio]);
                indicesUsados.add(indiceAleatorio);
            }
        }

        return selecionadas;
    }

    toggleNumeroSelecionado(numero, button) {
        if (this.numerosSelecionados.has(numero)) {
            this.numerosSelecionados.delete(numero);
            button.classList.remove('bolas-selecionadas');
        } else {
            this.numerosSelecionados.add(numero);
            button.classList.add('bolas-selecionadas');
        }
    }

    renderizarCombinacoes(combinacoesSelecionadas) {
        const modal = document.createElement('div');
        modal.className = 'modal';

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';

        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.className = 'close-button';
        closeButton.style.borderRadius = '0 0 0 20px';
        closeButton.style.backgroundColor = 'rgb(255 80 245 / 0%)';
        closeButton.onclick = () => modal.style.display = 'none';

        modalContent.appendChild(closeButton);

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Salvar Combinações';
        saveButton.className = 'salvarCombinacoes';
        saveButton.addEventListener('click', () => this.salvarCombinacoes(combinacoesSelecionadas));
        modalContent.appendChild(saveButton);

        combinacoesSelecionadas.forEach((combinacao, index) => {
            const combinacaoDiv = document.createElement('div');
            combinacaoDiv.className = 'combinacao';
            combinacaoDiv.innerHTML = `<b>Combinação ${index + 1}: </b><br> ${combinacao.join(', ')}`;
            modalContent.appendChild(combinacaoDiv);
        });

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        modal.style.display = 'block';
    }

    medirPerformance(callback) {
        const memoriaInicial = performance.memory ? performance.memory.usedJSHeapSize : 0;
        const tempoInicial = performance.now();

        callback();

        const tempoFinal = performance.now();
        const memoriaFinal = performance.memory ? performance.memory.usedJSHeapSize : 0;

        console.log(`Tempo de execução: ${(tempoFinal - tempoInicial).toFixed(2)} ms`);
        console.log(`Memória alocada: ${((memoriaFinal - memoriaInicial) / 1024 / 1024).toFixed(2)} MB`);
    }

    render() {
        const mainDiv = document.createElement('div');
        mainDiv.className = 'main';

        const containerDiv = document.createElement('div');
        containerDiv.className = 'container';

        const tecladoDiv = document.createElement('div');
        tecladoDiv.id = 'teclado';

        const inputQuantidade = document.createElement('input');
        inputQuantidade.id = 'combinadisplay';
        inputQuantidade.type = 'number';
        inputQuantidade.placeholder = 'Quantidade de combinações';
        containerDiv.appendChild(inputQuantidade);

        const gerarButton = document.createElement('button');
        gerarButton.className = 'salvaCombinacoes';
        gerarButton.textContent = 'Gerar';
        gerarButton.addEventListener('click', () => {
            const selecao = parseInt(this.numerosSelecionados.size) || 0;
            if (parseInt(selecao) < 6) {
                this.exibeModal('Selecione ao menos 6 números');
                return;
            }
            const quantidade = parseInt(inputQuantidade.value) || 0;
            if (quantidade < 2) {
                this.exibeModal('Gere ao menos 2 combinações');
                return;
            }
            if (quantidade > 1000) {
                this.exibeModal('O limite de combinações é 1000');
                return;
            }
            this.medirPerformance(() => {
                const todasCombinacoes = this.gerarCombinacoes(Array.from(this.numerosSelecionados), 50, quantidade);
                const combinacoesSelecionadas = this.selecionarCombinacoesAleatorias(todasCombinacoes, quantidade);
                this.renderizarCombinacoes(combinacoesSelecionadas);
            });
        });
        containerDiv.appendChild(gerarButton);

        for (let i = 1; i <= this.maxNumeros; i++) {
            const button = document.createElement('button');
            button.className = 'bolas';
            button.textContent = i < 10 ? `0${i}` : `${i}`;
            button.addEventListener('click', () => {
                this.toggleNumeroSelecionado(i, button);
            });
            tecladoDiv.appendChild(button);
        }

        containerDiv.appendChild(tecladoDiv);
        mainDiv.appendChild(containerDiv);

        return {
            element: mainDiv,
            init: () => this.init()
        };
    }

    init() {}
}
