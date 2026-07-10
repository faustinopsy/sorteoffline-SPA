import { useState } from 'react';
import toast from 'react-hot-toast';
import Bola from '../../atoms/Bola/Bola.jsx';
import Botao from '../../atoms/Botao/Botao.jsx';
import EstadoLista from '../../molecules/EstadoLista/EstadoLista.jsx';
import { useJogos } from '../../../hooks/useJogos.js';
import { apiSlug } from '../../../services/loterias/config.js';
import { frequenciaDezenas, rankearNumeros } from '../../../services/loterias/estatisticas.js';
import { proporcoes, gerarJogosElite } from '../../../services/loterias/analise.js';
import { buscarUltimosConcursos } from './buscarConcursos.js';
import styles from './Analisar.module.css';

const OPCOES_CONCURSOS = [5, 10, 15, 20, 30];

/** Analisa a frequência dos últimos N concursos e gera 6 jogos "elite". */
export default function Analisar({ loteria }) {
  const [quantidade, setQuantidade] = useState(10);
  const [status, setStatus] = useState('Selecione a quantidade de concursos e clique em Analisar.');
  const [carregando, setCarregando] = useState(false);
  const [analise, setAnalise] = useState(null);
  const { adicionar, adicionarVarios } = useJogos(loteria);

  const analisar = async () => {
    setCarregando(true);
    setAnalise(null);
    setStatus(`⏳ Buscando dados dos últimos ${quantidade} concursos...`);
    try {
      const concursos = await buscarUltimosConcursos(apiSlug(loteria), quantidade, (i, total) =>
        setStatus(`⏳ Carregando concurso ${i}/${total}...`)
      );
      setStatus(`🔢 Calculando frequências de ${concursos.length} concursos...`);

      const freq = frequenciaDezenas(concursos, loteria.max);
      const ranking = rankearNumeros(freq);
      const { qtdFixos, qtdRotativos } = proporcoes(loteria.min);
      const tamanhoPiscina = qtdRotativos * 3;

      const fortes = ranking.slice(0, qtdFixos).map((d) => d.numero);
      const medios = ranking.slice(qtdFixos, qtdFixos + tamanhoPiscina).map((d) => d.numero);
      const frios = ranking.slice(loteria.max - 5).map((d) => d.numero);
      const jogos = gerarJogosElite(fortes, medios, qtdRotativos, tamanhoPiscina);

      setAnalise({ fortes, medios, frios, jogos, totalConcursos: concursos.length });
      setStatus(`✅ ${jogos.length} jogos gerados com base em ${concursos.length} concursos!`);
    } catch (e) {
      setStatus('❌ Erro ao buscar dados. Verifique sua conexão.');
      toast.error(`Falha na análise: ${e.message}`);
    } finally {
      setCarregando(false);
    }
  };

  const salvarJogo = (jogo, i) => {
    adicionar(jogo);
    toast.success(`Jogo ${i + 1} salvo com sucesso!`);
  };

  const salvarTodos = () => {
    adicionarVarios(analise.jogos);
    toast.success(`${analise.jogos.length} jogos salvos com sucesso! Acesse "Listar" para conferir.`);
  };

  const baixarTxt = () => {
    const blob = new Blob([analise.jogos.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jogos_${loteria.url}_elite_${quantidade}concursos.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const grupo = (label, numeros) => (
    <div className={styles.statsRow}>
      <b>{label}:</b>
      <div className={styles.balls}>
        {numeros.map((n) => (
          <Bola key={n} numero={n} cor={loteria.accent} />
        ))}
      </div>
    </div>
  );

  return (
    <div className={styles.wrap}>
      <div className={styles.controles}>
        <select value={quantidade} onChange={(e) => setQuantidade(parseInt(e.target.value, 10))} aria-label="Quantidade de concursos">
          {OPCOES_CONCURSOS.map((v) => (
            <option key={v} value={v}>
              Últimos {v} concursos
            </option>
          ))}
        </select>
        <Botao variante="primario" onClick={analisar} disabled={carregando}>
          🔍 Analisar
        </Botao>
      </div>

      <p className={styles.status} role="status" aria-live="polite">
        {status}
      </p>
      <EstadoLista carregando={carregando} />

      {analise && !carregando && (
        <>
          <p>Resumo: {analise.totalConcursos} concursos analisados</p>
          {grupo('Fortes', analise.fortes)}
          {grupo('Médios', analise.medios)}
          {grupo('Frios', analise.frios)}

          <p>{analise.jogos.length} JOGOS GERADOS</p>
          {analise.jogos.map((jogo, i) => (
            <div key={i} className={styles.jogoCard}>
              <div className={styles.jogoHead}>
                <span>Jogo {i + 1}</span>
                <button type="button" onClick={() => salvarJogo(jogo, i)}>
                  💾 Salvar
                </button>
              </div>
              <div className={styles.balls}>
                {jogo.split(',').map((dez) => (
                  <Bola key={dez} numero={parseInt(dez, 10)} cor={loteria.accent} />
                ))}
              </div>
            </div>
          ))}

          <div className={styles.acoes}>
            <Botao variante="primario" onClick={salvarTodos}>
              💾 Salvar todos
            </Botao>
            <Botao variante="fantasma" onClick={baixarTxt}>
              ⬇ Baixar .txt
            </Botao>
          </div>
        </>
      )}
    </div>
  );
}
