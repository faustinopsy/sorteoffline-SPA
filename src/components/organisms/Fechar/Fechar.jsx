import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import GradeDezenas from '../GradeDezenas/GradeDezenas.jsx';
import Botao from '../../atoms/Botao/Botao.jsx';
import Badge from '../../atoms/Badge/Badge.jsx';
import Spinner from '../../atoms/Spinner/Spinner.jsx';
import Icone from '../../atoms/Icone/Icone.jsx';
import { useJogos } from '../../../hooks/useJogos.js';
import { getMatrices } from '../../../services/loterias/coberturas.js';
import { fechar } from '../../../services/loterias/fechamento.js';
import styles from './Fechar.module.css';

/** Fechamento condicional (wheeling): escolhe matriz g/a e gera talões via greedy set-cover. */
export default function Fechar({ loteria }) {
  const [selecionados, setSelecionados] = useState(new Set());
  const [matrizAtiva, setMatrizAtiva] = useState(null);
  const [computando, setComputando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const { adicionarVarios } = useJogos(loteria);

  const N = selecionados.size;
  const matrizes = useMemo(
    () => (N >= loteria.fechMin ? getMatrices(N, loteria.min, loteria.sorteia, loteria.gMin) : []),
    [N, loteria]
  );

  const alternar = (n) => {
    setSelecionados((atual) => {
      const novo = new Set(atual);
      novo.has(n) ? novo.delete(n) : novo.add(n);
      return novo;
    });
    setMatrizAtiva(null);
    setResultado(null);
  };

  const gerar = () => {
    if (!matrizAtiva) return;
    setComputando(true);
    setResultado(null);
    setTimeout(() => {
      const dezenas = [...selecionados].sort((a, b) => a - b);
      const r = fechar(dezenas, loteria.min, matrizAtiva.g, matrizAtiva.a, 100, 8_000);
      setResultado(r);
      setComputando(false);
    }, 60);
  };

  const salvarTodos = () => {
    const canonicos = resultado.tickets.map((t) => t.map((n) => String(n).padStart(2, '0')).join(','));
    adicionarVarios(canonicos);
    toast.success(`${resultado.tickets.length} talões salvos com sucesso!`);
  };

  const custoTotal = resultado ? (resultado.tickets.length * loteria.preco).toFixed(2).replace('.', ',') : '0';
  const pct = resultado?.total > 0 ? Math.round((resultado.covered / resultado.total) * 100) : 0;

  return (
    <div className={styles.wrap}>
      <div className={styles.top}>
        <span>{N < loteria.fechMin ? `${N} dezenas — selecione pelo menos ${loteria.fechMin}` : `${N} dezenas selecionadas`}</span>
        <button type="button" aria-label="Limpar seleção" onClick={() => { setSelecionados(new Set()); setMatrizAtiva(null); setResultado(null); }}>
          <Icone nome="trash" />
        </button>
      </div>

      <div className={styles.disclaimer}>
        <Icone nome="alerta" />
        <p>
          <strong>Nenhum ganho é garantido.</strong> O fechamento aumenta a cobertura matemática das suas dezenas,
          mas não elimina o acaso do sorteio. Jogue com responsabilidade. Limite: 100 talões por fechamento.{' '}
          <Link to="/politicas">Políticas de Uso</Link>
        </p>
      </div>

      <GradeDezenas max={loteria.max} selecionadas={selecionados} aoAlternar={alternar} cor={loteria.accent} />

      {N >= loteria.fechMin && (
        <div className={styles.matrizes}>
          <p>Tipo de Fechamento</p>
          {matrizes.length === 0 && (
            <p>Nenhum fechamento disponível para cálculo automático com {N} dezenas.</p>
          )}
          {matrizes.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`${styles.linhaMatriz} ${matrizAtiva?.id === m.id ? styles.ativa : ''}`}
              onClick={() => setMatrizAtiva(m)}
            >
              <span>{m.id}</span>
              <span>{m.desc}</span>
              {m.feasibility === 'slow' && <Badge title="Pode demorar alguns segundos">⏱</Badge>}
              {m.trivial && (
                <Badge title="A condição é tão ampla que qualquer talão de min dezenas já garante sozinho — vai gerar só 1 talão.">
                  1 talão
                </Badge>
              )}
            </button>
          ))}
          <Botao variante="primario" disabled={!matrizAtiva} onClick={gerar}>
            Gerar Fechamento
          </Botao>
        </div>
      )}

      {computando && (
        <div className={styles.computando}>
          <Spinner />
          <p>Calculando {matrizAtiva?.id}…</p>
          {matrizAtiva?.feasibility === 'slow' && <p>⏱ Esta matriz pode levar alguns segundos — aguarde.</p>}
        </div>
      )}

      {resultado && !computando && (
        <>
          <div className={styles.resumo}>
            <div className={styles.linhaResumo}><span>Fechamento</span><span>{matrizAtiva.id}</span></div>
            <div className={styles.linhaResumo}><span>Talões</span><span>{resultado.tickets.length} cartões de {loteria.min} dezenas</span></div>
            <div className={styles.linhaResumo}><span>Total</span><span>R$ {custoTotal}</span></div>
            <div className={styles.linhaResumo}><span>Cobertura</span><span>{resultado.covered}/{resultado.total} cenários ({pct}%)</span></div>
          </div>

          {(resultado.timedOut || resultado.covered < resultado.total) && (
            <p className={styles.aviso}>
              {resultado.timedOut
                ? `⚠ Tempo esgotado. ${resultado.tickets.length} talões gerados com cobertura parcial (${pct}%).`
                : `⚠ Cobertura parcial: ${pct}% dos cenários cobertos com ${resultado.tickets.length} talões (limite de 100 atingido).`}
            </p>
          )}

          {matrizAtiva.trivial && resultado.tickets.length <= 1 && (
            <p>
              ℹ Essa condição é tão ampla que qualquer talão de {loteria.min} dezenas já garante {matrizAtiva.g} pts
              sozinho — por isso apenas 1 talão foi necessário. Escolha uma matriz sem o selo "1 talão" para um
              fechamento que realmente precise de vários cartões.
            </p>
          )}

          {resultado.tickets.length === 0 ? (
            <p>Nenhum talão gerado. Tente escolher outro tipo de fechamento.</p>
          ) : (
            <>
              {resultado.tickets.map((t, i) => (
                <div key={i} className={styles.talao}>
                  <b>#{String(i + 1).padStart(2, '0')}</b>
                  {t.map((n) => (
                    <span key={n}>{String(n).padStart(2, '0')}</span>
                  ))}
                </div>
              ))}
              <Botao variante="primario" onClick={salvarTodos}>
                <Icone nome="save" /> Salvar {resultado.tickets.length} talões
              </Botao>
            </>
          )}
        </>
      )}
    </div>
  );
}
