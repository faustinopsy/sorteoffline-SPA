import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Bola from '../../atoms/Bola/Bola.jsx';
import LinhaJogo from '../../molecules/LinhaJogo/LinhaJogo.jsx';
import EstadoLista from '../../molecules/EstadoLista/EstadoLista.jsx';
import Botao from '../../atoms/Botao/Botao.jsx';
import { useJogos } from '../../../hooks/useJogos.js';
import { buscarResultado } from '../../../services/resultados.js';
import { conferir as conferirJogos } from '../../../services/loterias/conferencia.js';
import { apiSlug } from '../../../services/loterias/config.js';
import styles from './Conferir.module.css';

/** Busca o resultado oficial da Caixa e confere contra os jogos salvos. */
export default function Conferir({ loteria }) {
  const { jogos } = useJogos(loteria);
  const [numero, setNumero] = useState('');
  const [dica, setDica] = useState('Buscando último sorteio…');
  const [resultado, setResultado] = useState(null);
  const [buscando, setBuscando] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;
    buscarResultado(apiSlug(loteria))
      .then((lista) => {
        if (!ativo || !lista?.numero) return;
        setNumero(String(lista.numero));
        setDica(
          `Concurso ${lista.numero} · ${lista.dataApuracao}${lista.acumulado ? ' · Acumulou!' : ''}`
        );
      })
      .catch(() => ativo && setDica(''));
    return () => {
      ativo = false;
    };
  }, [loteria]);

  const buscar = async () => {
    if (!numero.trim()) {
      toast.error('Preencha um número para busca.');
      return;
    }
    setBuscando(true);
    setErro(null);
    try {
      const lista = await buscarResultado(apiSlug(loteria), numero.trim());
      setResultado(lista);
    } catch (e) {
      setErro(e);
    } finally {
      setBuscando(false);
    }
  };

  const sorteados = resultado?.listaDezenas?.map(Number) || [];
  const conferidos = resultado ? conferirJogos(jogos, sorteados) : [];

  return (
    <div className={styles.wrap}>
      <input
        className={styles.input}
        type="text"
        inputMode="numeric"
        placeholder="Nº do Concurso"
        value={numero}
        onChange={(e) => setNumero(e.target.value.replace(/[^0-9]/g, ''))}
      />
      {dica && <p className={styles.dica}>{dica}</p>}
      <Botao variante="primario" onClick={buscar} disabled={buscando}>
        {buscando ? 'Buscando…' : 'Buscar'}
      </Botao>

      <EstadoLista carregando={buscando} erro={erro} />

      {resultado && (
        <>
          <div className={styles.card}>
            <div>
              <strong>Concurso {resultado.numero}</strong> · {resultado.dataApuracao}
            </div>
            {resultado.acumulado && <span>Acumulou!</span>}
            <div className={styles.dezenas}>
              {sorteados.map((n) => (
                <Bola key={n} numero={n} cor={loteria.accent} />
              ))}
            </div>
            <div>
              Concurso anterior: <b>{resultado.numeroConcursoAnterior}</b> &nbsp; Próximo:{' '}
              <b>{resultado.numeroConcursoProximo}</b>
            </div>
          </div>

          <EstadoLista vazio={conferidos.length === 0} mensagemVazio="Nenhum talão cadastrado para esta loteria." />
          {conferidos.length > 0 && <p className={styles.secao}>SEUS TALÕES</p>}
          {conferidos.map((t) => (
            <LinhaJogo key={t.index} indice={t.index} numeros={t.numeros} acertos={t.acertos} cor={loteria.accent} />
          ))}
        </>
      )}
    </div>
  );
}
