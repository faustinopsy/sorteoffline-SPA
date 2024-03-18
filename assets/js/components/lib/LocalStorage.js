export default class LocalStorageJS {
    constructor(dados) {
        this.dados = dados;
    }

    salvarLoteria(chaveContador, chaveTalao) {
        const currentCount = parseInt(localStorage.getItem(chaveContador) || '0');
        localStorage.setItem(`${chaveTalao}_${currentCount + 1}`, this.dados);
        localStorage.setItem(chaveContador, (currentCount + 1).toString());
    }

    listaLoteria(chaveContador, chaveTalao) {
        let taloes = parseInt(localStorage.getItem(chaveContador));
        let meusnumeros = [];
        for (let i = 1; i <= taloes; i++) {
            meusnumeros.push(localStorage.getItem(`${chaveTalao}_${i}`));
        }
        return meusnumeros;
    }

    removerItemLoteria(chaveContador, chaveTalao, index) {
        localStorage.removeItem(`${chaveTalao}_${index}`);

        const currentCount = parseInt(localStorage.getItem(chaveContador));
        if (currentCount > 1) {
            for (let i = index + 1; i <= currentCount; i++) {
                const item = localStorage.getItem(`${chaveTalao}_${i}`);
                localStorage.setItem(`${chaveTalao}_${i - 1}`, item);
                localStorage.removeItem(`${chaveTalao}_${i}`);
            }
        }
        localStorage.setItem(chaveContador, (currentCount - 1).toString());
    }
    excluirTodos(chaveContador, chaveTalao) {
        let taloes = parseInt(localStorage.getItem(chaveContador));
        for (let i = 1; i <= taloes; i++) {
            localStorage.removeItem(`${chaveTalao}_${i}`);
        }
        localStorage.setItem(chaveContador, '0');
    }
    
    render() {
        
    }
}
