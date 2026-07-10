import LotteryScreen from './_LotteryScreen.js';
import { ICONS } from '../icons.js';

export default class LotomaniaScreen extends LotteryScreen {
    constructor(navigateCallback, lang) {
        super(navigateCallback, lang);
        this.screenLabel  = 'Lotomania';
        this.gradient     = 'linear-gradient(160deg, #450a0a 0%, #991b1b 60%, #dc2626 100%)';
        this.glowColor    = 'rgba(220,38,38,0.55)';
        this.accentColor  = '#ef4444';
        this.menuItems = [
            { href: 'conferirmania',   svg: ICONS.conferir,    text: 'Conferir',    key: 'CONFERIR',   ariaLabel: 'Conferir jogos da Lotomania' },
            { href: 'listarmania',     svg: ICONS.listar,      text: 'Listar',      key: 'LISTAR',     ariaLabel: 'Listar talões da Lotomania' },
            { href: 'cadmania',        svg: ICONS.cadastrar,   text: 'Cadastrar',   key: 'CADASTRAR',  ariaLabel: 'Cadastrar jogo da Lotomania' },
            { href: 'combinacoesMania',svg: ICONS.combinacoes, text: 'Combinações', key: 'COMBINACAO', ariaLabel: 'Combinações da Lotomania' },
            { href: 'maniapares',      svg: ICONS.atualizar,   text: 'Atualizar',   key: 'ATUAL',      ariaLabel: 'Atualizar resultados Lotomania' },
            { href: 'analiseMania',    svg: ICONS.analise,     text: 'Análise',     key: 'ANALISE',    ariaLabel: 'Analisar frequência Lotomania' },
            { href: 'fechaMania',      svg: ICONS.fechamento,  text: 'Fechamento',  key: 'FECHAMENTO', ariaLabel: 'Fechamento condicional Lotomania' },
            { href: 'politicas',       svg: ICONS.alerta,      text: 'Políticas',   key: 'POLITICAS',  ariaLabel: 'Políticas de uso e responsabilidade' },
        ];
        this._setup();
    }
}
