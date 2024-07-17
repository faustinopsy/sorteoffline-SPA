import  LocalStorageJS  from '../lib/LocalStorage.js';
export default class ListaQuina {
    constructor() {
        this.displayValue = '0'
        this.buscalocal = null;
        this.lista = null;
        
    }

    init() {
        this.atualizaEstiloCabecalho();
        this.Listar();
        this.renderList(); 
    }

    atualizaEstiloCabecalho() {
        const cabecalho = document.querySelector('.app-header');
        if (cabecalho) {
            cabecalho.style.background = 'linear-gradient(rgb(0, 0, 0), rgb(63 98 230), rgb(47 118 200))'; 
            cabecalho.style.boxShadow = 'rgb(47 118 200) 0px 36px 36px 56px'; 
        }
    }

    Listar() {
        this.buscalocal = new LocalStorageJS(this.displayValue);
        this.lista = this.buscalocal.listaLoteria('quina', 'lotoquina');
    }

    removerItem(index) {
        this.buscalocal.removerItemLoteria('quina', 'lotoquina', index);
        this.Listar();
        this.renderList();
    }
    excluirTodos(){
        this.buscalocal = new LocalStorageJS();
        this.buscalocal.excluirTodos('quina', 'lotoquina');
        this.Listar();
        this.renderList();
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

