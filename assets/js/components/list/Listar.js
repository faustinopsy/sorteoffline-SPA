import  LocalStorageJS  from '../lib/LocalStorage.js';
import Modal from '../lib/Modal.js';
export default class Listar {
    constructor(loteria) {
        this.displayValue = '0'
        this.buscalocal = null;
        this.lista = null;
        this.tipo = loteria.nome;
        this.simbolo = loteria.simb;
        this.modal = new Modal();
    }

    init() {
        this.atualizaEstiloCabecalho();
        this.Listar();
        this.renderList(); 
    }

    atualizaEstiloCabecalho() {
        const cabecalho = document.querySelector('.app-header');
        if (cabecalho) {
            cabecalho.style.background = 'linear-gradient(to bottom, rgb(0 0 0), #c44bbc, rgb(194 71 187))'; 
            cabecalho.style.boxShadow = 'none';
        }
    }

    Listar() {
        this.buscalocal = new LocalStorageJS(this.displayValue);
        this.lista = this.buscalocal.listaLoteria(this.simbolo, this.tipo);
    }

    async removerItem(index) {
        const resultado = await this.modal.exibepergunta(
            "Apagar este talão?", 
            "Você não poderá recuperar este item."
        );
        console.log(resultado);
        if (resultado.isConfirmed) {
            this.buscalocal.removerItemLoteria(this.simbolo, this.tipo, index);
            this.Listar();
            this.renderList();
            
            Swal.fire("Apagado!", "O talão foi removido.", "success");
        } else {
            Swal.fire("Cancelado", "O talão está seguro.", "error");
        }
    }

    async excluirTodos() {
        const resultado = await this.modal.exibepergunta(
            "Excluir TUDO?", 
            "Todos os talões serão apagados permanentemente!"
        );

        if (resultado.isConfirmed) {
            this.buscalocal = new LocalStorageJS();
            this.buscalocal.excluirTodos(this.simbolo, this.tipo);
            this.Listar();
            this.renderList();

            Swal.fire("Tudo Apagado!", "Todos os talões foram removidos.", "success");
        } else {
            Swal.fire("Cancelado", "Seus talões estão seguros.", "error");
        }
    }
    
    renderList() {
        const containerDiv = document.querySelector('.container');
        containerDiv.innerHTML = ''; 
        if(this.lista.length > 0){
            const excluirTodosButton = document.createElement('button');
            excluirTodosButton.id = 'bclear'
            excluirTodosButton.style.backgroundColor = 'rgb(195 73 188)'
            excluirTodosButton.style.borderRadius = '20px 20px 0 0'
            excluirTodosButton.style.width = '100%'
            excluirTodosButton.textContent = 'Excluir Tudo';
            excluirTodosButton.addEventListener('click', () => this.excluirTodos());
            containerDiv.appendChild(excluirTodosButton);
        }else{
            containerDiv.innerText = 'Nenhum talão cadastrado';
        }
        
        this.lista.forEach((text, index) => {
            const list = document.createElement('li');
            list.className = 'lista-tens'
            list.id = `item-${index}`;
            list.textContent = `Nº ${index + 1} : ${text} `;

            const removeButton = document.createElement('button');
            removeButton.className = 'limpa-lista'
            removeButton.id = 'list'
            removeButton.textContent = 'Remover';
            removeButton.addEventListener('click', () => this.removerItem(index));
            
            list.appendChild(removeButton);
            containerDiv.appendChild(list);
        });
    }

    render() {
        const mainDiv = document.createElement('div');
        mainDiv.className = 'main';

        const containerDiv = document.createElement('div');
        containerDiv.className = 'container';

        const tecladoDiv = document.createElement('div');
        tecladoDiv.id = 'teclado'; 
        containerDiv.appendChild(tecladoDiv);
        
        mainDiv.appendChild(containerDiv);

        return {
            element: mainDiv,
            init: () => this.init() 
        };
    }
}

