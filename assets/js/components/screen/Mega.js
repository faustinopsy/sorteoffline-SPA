import LotteryScreen from './_LotteryScreen.js';
import { ICONS } from '../icons.js';

export default class MegaScreen extends LotteryScreen {
    constructor(navigateCallback, lang) {
        super(navigateCallback, lang);
        this.screenLabel  = 'Mega-Sena';
        this.gradient     = 'linear-gradient(160deg, #052e16 0%, #166534 60%, #15803d 100%)';
        this.glowColor    = 'rgba(21,128,61,0.55)';
        this.accentColor  = '#22c55e';
        this.menuItems = [
            { href: 'conferirsena',    svg: ICONS.conferir,    text: 'Conferir',    key: 'CONFERIR',   ariaLabel: 'Conferir jogos da Mega-Sena' },
            { href: 'listarsena',      svg: ICONS.listar,      text: 'Listar',      key: 'LISTAR',     ariaLabel: 'Listar talões da Mega-Sena' },
            { href: 'cadsena',         svg: ICONS.cadastrar,   text: 'Cadastrar',   key: 'CADASTRAR',  ariaLabel: 'Cadastrar jogo da Mega-Sena' },
            { href: 'combinacoesSena', svg: ICONS.combinacoes, text: 'Combinações', key: 'COMBINACAO', ariaLabel: 'Combinações da Mega-Sena' },
            { href: 'megasenapares',   svg: ICONS.atualizar,   text: 'Atualizar',   key: 'ATUAL',      ariaLabel: 'Atualizar resultados Mega-Sena' },
            { href: 'analiseSena',     svg: ICONS.analise,     text: 'Análise',     key: 'ANALISE',    ariaLabel: 'Analisar frequência Mega-Sena' },
            { href: 'fechaSena',       svg: ICONS.fechamento,  text: 'Fechamento',  key: 'FECHAMENTO', ariaLabel: 'Fechamento condicional Mega-Sena' },
            { href: 'politicas',       svg: ICONS.alerta,      text: 'Políticas',   key: 'POLITICAS',  ariaLabel: 'Políticas de uso e responsabilidade' },
        ];
        this._setup();
    }
}
