import LotteryScreen from './_LotteryScreen.js';
import { ICONS } from '../icons.js';

export default class QuinaScreen extends LotteryScreen {
    constructor(navigateCallback, lang) {
        super(navigateCallback, lang);
        this.screenLabel  = 'Quina';
        this.gradient     = 'linear-gradient(160deg, #172554 0%, #1d4ed8 60%, #3b82f6 100%)';
        this.glowColor    = 'rgba(29,78,216,0.55)';
        this.accentColor  = '#3b82f6';
        this.menuItems = [
            { href: 'conferirquina',   svg: ICONS.conferir,    text: 'Conferir',    key: 'CONFERIR',   ariaLabel: 'Conferir jogos da Quina' },
            { href: 'listarquina',     svg: ICONS.listar,      text: 'Listar',      key: 'LISTAR',     ariaLabel: 'Listar talões da Quina' },
            { href: 'cadquina',        svg: ICONS.cadastrar,   text: 'Cadastrar',   key: 'CADASTRAR',  ariaLabel: 'Cadastrar jogo da Quina' },
            { href: 'combinacoesQuina',svg: ICONS.combinacoes, text: 'Combinações', key: 'COMBINACAO', ariaLabel: 'Combinações da Quina' },
            { href: 'quinapares',      svg: ICONS.atualizar,   text: 'Atualizar',   key: 'ATUAL',      ariaLabel: 'Atualizar resultados Quina' },
            { href: 'analiseQuina',    svg: ICONS.analise,     text: 'Análise',     key: 'ANALISE',    ariaLabel: 'Analisar frequência Quina' },
            { href: 'fechaQuina',      svg: ICONS.fechamento,  text: 'Fechamento',  key: 'FECHAMENTO', ariaLabel: 'Fechamento condicional Quina' },
            { href: 'politicas',       svg: ICONS.alerta,      text: 'Políticas',   key: 'POLITICAS',  ariaLabel: 'Políticas de uso e responsabilidade' },
        ];
        this._setup();
    }
}
