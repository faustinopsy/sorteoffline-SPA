import  LocalStorageJS  from '../lib/LocalStorage.js';
export default class ListaFacil {
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
            cabecalho.style.background = 'linear-gradient(to bottom, rgb(0 0 0), #c44bbc, rgb(194 71 187))'; 
            cabecalho.style.boxShadow = '0 36px 36px 56px rgb(199 86 194)'; 
        }
    }

    Listar() {
        this.buscalocal = new LocalStorageJS(this.displayValue);
        this.lista = this.buscalocal.listaLoteria('facil', 'lotofacil');
    }

    removerItem(index) {
        this.buscalocal.removerItemLoteria('facil', 'lotofacil', index);
        this.Listar();
        this.renderList();
    }
    excluirTodos(){
        this.buscalocal = new LocalStorageJS();
        this.buscalocal.excluirTodos('facil', 'lotofacil');
        this.Listar();
        this.renderList();
    }
    renderList() {
        const containerDiv = document.querySelector('.container');
        containerDiv.innerHTML = ''; 
        if(this.lista.length > 0){
            const excluirTodosButton = document.createElement('button');
            excluirTodosButton.id = 'bclear'
            excluirTodosButton.textContent = 'Excluir Tudo';
            excluirTodosButton.addEventListener('click', () => this.excluirTodos());
            containerDiv.appendChild(excluirTodosButton);
        }else{
            containerDiv.innerText = 'Nenhum talão cadastrado';
        }
        
        this.lista.forEach((text, index) => {
            const list = document.createElement('li');
            list.id = `item-${index}`;
            list.textContent = `Nº ${index + 1} : ${text} `;

            const removeButton = document.createElement('button');
            removeButton.id = 'bclear'
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

