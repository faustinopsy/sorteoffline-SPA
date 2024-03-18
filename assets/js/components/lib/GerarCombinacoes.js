import LocalStorageJS from '../lib/LocalStorage.js';
export default class GeradorCombinacoes {
    constructor() {
        this.numerosSelecionados = new Set();
        this.maxNumeros = 25;
    }
    salvarCombinacoes(combinacoes) {
        combinacoes.forEach(combinacao => {
            const combinacaoString = combinacao.map(num => num < 10 ? '0' + num : num).join(',');
            this.buscalocal = new LocalStorageJS(combinacaoString);
            this.buscalocal.salvarLoteria('facil', 'lotofacil');
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
    gerarCombinacoes(arr, tamanho) {
        function auxiliar(init, left, k) {
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

        while(selecionadas.length < quantidade) {
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
        closeButton.onclick = () => modal.style.display = 'none';

        modalContent.appendChild(closeButton);

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Salvar Combinações';
        saveButton.className = 'salvarBtn';
        saveButton.addEventListener('click', () => this.salvarCombinacoes(combinacoesSelecionadas));
        modalContent.appendChild(saveButton);


        combinacoesSelecionadas.forEach((combinacao, index) => {
            const combinacaoDiv = document.createElement('div');
            combinacaoDiv.className = 'combinacao';
            combinacaoDiv.innerHTML = `<b>Combinação  ${index + 1}: </b><br> ${combinacao.join(', ')}`;
            modalContent.appendChild(combinacaoDiv);
        });
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        modal.style.display = 'block';
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
        gerarButton.id = 'salvarBtn'
        gerarButton.textContent = 'Gerar';
        gerarButton.addEventListener('click', () => {
            const quantidade = parseInt(inputQuantidade.value) || 0;
            if(quantidade<2){
                this.exibeModal('Gere ao menos 2 combinações')
                return
            }
            const todasCombinacoes = this.gerarCombinacoes(Array.from(this.numerosSelecionados), 15);
            const combinacoesSelecionadas = this.selecionarCombinacoesAleatorias(todasCombinacoes, quantidade);
            this.renderizarCombinacoes(combinacoesSelecionadas);
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

    init() {
       
    }
}
