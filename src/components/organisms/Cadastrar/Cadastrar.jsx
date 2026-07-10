import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import GradeDezenas from '../GradeDezenas/GradeDezenas.jsx';
import Bola from '../../atoms/Bola/Bola.jsx';
import Botao from '../../atoms/Botao/Botao.jsx';
import Icone from '../../atoms/Icone/Icone.jsx';
import { useJogos } from '../../../hooks/useJogos.js';
import { paraCanonico, validarTaloesDoArquivo } from './canonico.js';
import styles from './Cadastrar.module.css';

/** Cadastrar jogos: grade de seleção (usa GradeDezenas + useJogos) e importação de .txt. */
export default function Cadastrar({ loteria }) {
  const [selecionados, setSelecionados] = useState(new Set());
  const inputRef = useRef(null);
  const { adicionar, adicionarVarios } = useJogos(loteria);

  const alternar = (n) => {
    setSelecionados((atual) => {
      const novo = new Set(atual);
      if (novo.has(n)) novo.delete(n);
      else if (novo.size < loteria.min) novo.add(n);
      return novo;
    });
  };

  const limpar = () => setSelecionados(new Set());

  const salvar = () => {
    adicionar(paraCanonico(selecionados));
    limpar();
    toast.success('Talão salvo com sucesso!');
  };

  const aoSelecionarArquivo = (e) => {
    const arquivo = e.target.files[0];
    if (!arquivo) return;
    if (arquivo.type !== 'text/plain') {
      toast.error('Apenas arquivos .txt são permitidos.');
      e.target.value = '';
      return;
    }
    const leitor = new FileReader();
    leitor.onload = (ev) => {
      try {
        const taloes = validarTaloesDoArquivo(ev.target.result, loteria.min, loteria.max);
        adicionarVarios(taloes);
        toast.success(`${taloes.length} talões carregados e salvos com sucesso!`);
      } catch (err) {
        toast.error(`Erro no arquivo: ${err.message}`);
      }
      e.target.value = '';
    };
    leitor.onerror = () => {
      toast.error('Erro ao ler o arquivo.');
      e.target.value = '';
    };
    leitor.readAsText(arquivo);
  };

  const contagem = selecionados.size;
  const completo = contagem === loteria.min;
  const pct = Math.round((contagem / loteria.min) * 100);

  return (
    <div className={styles.wrap}>
      <div className={styles.display} aria-label="Números selecionados">
        {contagem === 0 ? (
          <span className={styles.dica}>Selecione {loteria.min} números</span>
        ) : (
          [...selecionados]
            .sort((a, b) => a - b)
            .map((n) => <Bola key={n} numero={n} cor={loteria.accent} />)
        )}
      </div>

      <div className={styles.progressoWrap}>
        <span>
          {contagem} / {loteria.min}
        </span>
        <div className={styles.barra}>
          <div
            className={styles.barraPreench}
            style={{ width: `${pct}%`, background: completo ? 'var(--success)' : undefined }}
          />
        </div>
      </div>

      <div className={styles.acoes}>
        <Botao variante="fantasma" onClick={limpar} aria-label="Limpar seleção">
          <Icone nome="trash" /> Limpar
        </Botao>
        <Botao variante="primario" disabled={!completo} onClick={salvar} aria-label="Salvar talão">
          <Icone nome="save" /> Salvar talão
        </Botao>
      </div>

      <GradeDezenas max={loteria.max} selecionadas={selecionados} aoAlternar={alternar} cor={loteria.accent} />

      <button
        type="button"
        className={styles.fab}
        onClick={() => inputRef.current?.click()}
        aria-label="Carregar talões de arquivo .txt"
        title="Importar .txt"
      >
        <Icone nome="upload" />
      </button>
      <input ref={inputRef} type="file" accept=".txt" style={{ display: 'none' }} onChange={aoSelecionarArquivo} />
    </div>
  );
}
