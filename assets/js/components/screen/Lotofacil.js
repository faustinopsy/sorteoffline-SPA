import LotteryScreen from './_LotteryScreen.js';
import { ICONS } from '../icons.js';

export default class LotoFacilScreen extends LotteryScreen {
    constructor(navigateCallback, lang) {
        super(navigateCallback, lang);
        this.screenLabel  = 'Lotofácil';
        this.gradient     = 'linear-gradient(160deg, #2e1065 0%, #6b21a8 60%, #9333ea 100%)';
        this.glowColor    = 'rgba(147,51,234,0.55)';
        this.accentColor  = '#a855f7';
        this.menuItems = [
            { href: 'conferefacil',    svg: ICONS.conferir,    text: 'Conferir',    key: 'CONFERIR',   ariaLabel: 'Conferir jogos da Lotofácil' },
            { href: 'listafacil',      svg: ICONS.listar,      text: 'Listar',      key: 'LISTAR',     ariaLabel: 'Listar talões da Lotofácil' },
            { href: 'cadfacil',        svg: ICONS.cadastrar,   text: 'Cadastrar',   key: 'CADASTRAR',  ariaLabel: 'Cadastrar jogo da Lotofácil' },
            { href: 'combinacoesFacil',svg: ICONS.combinacoes, text: 'Combinações', key: 'COMBINACAO', ariaLabel: 'Combinações da Lotofácil' },
            { href: 'lotofacilpares',  svg: ICONS.atualizar,   text: 'Atualizar',   key: 'ATUAL',      ariaLabel: 'Atualizar resultados Lotofácil' },
            { href: 'analiseFacil',    svg: ICONS.analise,     text: 'Análise',     key: 'ANALISE',    ariaLabel: 'Analisar frequência Lotofácil' },
            { href: 'fechaFacil',      svg: ICONS.fechamento,  text: 'Fechamento',  key: 'FECHAMENTO', ariaLabel: 'Fechamento condicional Lotofácil' },
            { href: 'politicas',       svg: ICONS.alerta,      text: 'Políticas',   key: 'POLITICAS',  ariaLabel: 'Políticas de uso e responsabilidade' },
        ];
        this._setup();
    }
}
