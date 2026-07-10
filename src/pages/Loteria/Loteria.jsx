import { useParams, Navigate } from 'react-router-dom';
import { porUrl } from '../../services/loterias/config.js';
import { useCabecalho } from '../../context/CabecalhoContext.jsx';
import { useSeo } from '../../hooks/useSeo.js';
import { ABAS } from './abas.js';
import LoteriaMenu from './LoteriaMenu.jsx';

const META = {
  'mega-sena': { title: 'Mega-Sena | LMania', desc: 'Cadastre, confira e analise seus jogos da Mega-Sena. Crie fechamentos matemáticos e veja estatísticas de frequência das dezenas.' },
  lotofacil: { title: 'Lotofácil | LMania', desc: 'Gerencie seus jogos da Lotofácil com análise matemática. Fechamentos condicionais, combinações e estatísticas de frequência.' },
  quina: { title: 'Quina | LMania', desc: 'Organize e analise seus jogos da Quina. Desdobramentos matemáticos, conferência automática de resultados e análise de frequência.' },
  lotomania: { title: 'Lotomania | LMania', desc: 'Gerencie seus jogos da Lotomania com ferramentas matemáticas. Combinações, fechamentos e análise estatística.' },
};

/** Tela parametrizada por :loteria/:aba — um único conjunto de organismos serve às 4 loterias. */
export default function Loteria() {
  const { loteria: url, aba } = useParams();
  const config = porUrl(url);
  const meta = META[url];

  useCabecalho(config?.gradient, aba ? ABAS[aba]?.label : config?.nome);
  useSeo(meta?.title, meta?.desc);

  if (!config) return <Navigate to="/ferramentas" replace />;
  if (!aba) return <LoteriaMenu loteria={config} />;

  const Aba = ABAS[aba];
  if (!Aba) return <Navigate to={`/${url}`} replace />;

  const { Componente } = Aba;
  return <Componente loteria={config} />;
}
