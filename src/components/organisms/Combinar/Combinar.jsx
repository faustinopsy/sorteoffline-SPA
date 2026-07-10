import { useState } from 'react';
import toast from 'react-hot-toast';
import GradeDezenas from '../GradeDezenas/GradeDezenas.jsx';
import Botao from '../../atoms/Botao/Botao.jsx';
import { useJogos } from '../../../hooks/useJogos.js';
import { gerarCombinacoes, selecionarAleatorias } from '../../../services/loterias/combinacoes.js';
import { paraCanonico } from '../Cadastrar/canonico.js';
import styles from './Combinar.module.css';

/** Gera combinações a partir de um grupo de dezenas selecionadas. */
export default function Combinar({ loteria }) {
  const [selecionados, setSelecionados] = useState(new Set());
  const [quantidade, setQuantidade] = useState('');
  const [combinacoes, setCombinacoes] = useState(null);
  const { adicionarVarios } = useJogos(loteria);

  const alternar = (n) => {
    setSelecionados((atual) => {
      const novo = new Set(atual);
      novo.has(n) ? novo.delete(n) : novo.add(n);
      return novo;
    });
  };

  const gerar = () => {
    if (selecionados.size < loteria.min + 1) {
      toast.error(`Selecione ao menos ${loteria.min + 1} números`);
      return;
    }
    const qtd = parseInt(quantidade, 10) || 0;
    if (qtd < 2) {
      toast.error('Gere ao menos 2 combinações');
      return;
    }
    if (qtd > 1000) {
      toast.error('O limite de combinações é 1000');
      return;
    }
    const todas = gerarCombinacoes([...selecionados], loteria.min, qtd);
    setCombinacoes(selecionarAleatorias(todas, qtd));
  };

  const salvar = () => {
    adicionarVarios(combinacoes.map(paraCanonico));
    toast.success('Combinações salvas com sucesso!');
    setCombinacoes(null);
  };

  return (
    <div className={styles.wrap}>
      <input
        className={styles.input}
        type="number"
        placeholder="Quantidade de combinações"
        value={quantidade}
        onChange={(e) => setQuantidade(e.target.value)}
      />
      <Botao variante="primario" onClick={gerar}>
        Gerar
      </Botao>

      <GradeDezenas max={loteria.max} selecionadas={selecionados} aoAlternar={alternar} cor={loteria.accent} />

      {combinacoes && (
        <>
          <div className={styles.lista}>
            {combinacoes.map((c, i) => (
              <div key={i} className={styles.combinacao}>
                <b>Combinação {i + 1}: </b>
                {c.join(', ')}
              </div>
            ))}
          </div>
          <Botao variante="primario" onClick={salvar}>
            Salvar Combinações
          </Botao>
        </>
      )}
    </div>
  );
}
