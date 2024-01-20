export default class LocalStorageJS {
    constructor(dados) {
        this.lotofacil  = dados;
        this.lotomania  = dados;
        this.megasena   = dados;
        this.quina      = dados;
    }

    init() {
       
    }

    salvarLotofacil() {
        const currentCount = parseInt(localStorage.getItem('facil') || '0');
        localStorage.setItem(`lotofacil_${currentCount + 1}`, this.lotofacil);
        localStorage.setItem('facil', (currentCount + 1).toString());
    }
    ListaLotofacil() {
        let taloes = parseInt(localStorage.getItem('facil'));
        let meusnumeros=[];
        for(let i=1;i<=taloes;i++){
            meusnumeros.push(localStorage.getItem(`lotofacil_${i}`));
         }
       return meusnumeros;
    }
    salvarMegaSena() {
        localStorage.setItem("megasena", JSON.stringify(this.megasena));
    }
    ListaMegaSena() {
       return JSON.parse(localStorage.getItem("megasena"));
    }
    salvarLotomania() {
        localStorage.setItem("lotomania", JSON.stringify(this.lotomania));
    }
    ListaLotomania() {
       return JSON.parse(localStorage.getItem("lotomania"));
    }
    salvarQuina() {
        localStorage.setItem("quina", JSON.stringify(this.quina));
    }
    ListaQuina() {
       return JSON.parse(localStorage.getItem("quina"));
    }

    render() {
        
    }
}

