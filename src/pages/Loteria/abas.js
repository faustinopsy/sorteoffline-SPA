import Cadastrar from '../../components/organisms/Cadastrar/Cadastrar.jsx';
import ListaJogos from '../../components/organisms/ListaJogos/ListaJogos.jsx';
import Conferir from '../../components/organisms/Conferir/Conferir.jsx';
import Combinar from '../../components/organisms/Combinar/Combinar.jsx';
import Fechar from '../../components/organisms/Fechar/Fechar.jsx';
import GraficoParesImpares from '../../components/organisms/GraficoParesImpares/GraficoParesImpares.jsx';
import Analisar from '../../components/organisms/Analisar/Analisar.jsx';

export const ABAS = {
  conferir: { label: 'Conferir', icone: 'conferir', Componente: Conferir },
  listar: { label: 'Listar', icone: 'listar', Componente: ListaJogos },
  cadastrar: { label: 'Cadastrar', icone: 'cadastrar', Componente: Cadastrar },
  combinar: { label: 'Combinações', icone: 'combinacoes', Componente: Combinar },
  grafico: { label: 'Atualizar', icone: 'atualizar', Componente: GraficoParesImpares },
  analisar: { label: 'Análise', icone: 'analise', Componente: Analisar },
  fechar: { label: 'Fechamento', icone: 'fechamento', Componente: Fechar },
};

export const ORDEM_ABAS = ['conferir', 'listar', 'cadastrar', 'combinar', 'grafico', 'analisar', 'fechar'];
