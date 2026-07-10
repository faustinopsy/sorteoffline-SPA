import toast from 'react-hot-toast';
import LinhaJogo from '../../molecules/LinhaJogo/LinhaJogo.jsx';
import EstadoLista from '../../molecules/EstadoLista/EstadoLista.jsx';
import Botao from '../../atoms/Botao/Botao.jsx';
import { useConfirmacao } from '../../molecules/Modal/useConfirmacao.jsx';
import { useJogos } from '../../../hooks/useJogos.js';
import styles from './ListaJogos.module.css';

/** Lista jogos salvos de uma loteria — remover individual ou excluir tudo. */
export default function ListaJogos({ loteria }) {
  const { jogos, remover, excluirTodos } = useJogos(loteria);
  const { confirmar, elemento } = useConfirmacao();

  const aoRemover = async (index) => {
    const ok = await confirmar('Apagar este talão?', 'Você não poderá recuperar este item.');
    if (ok) {
      remover(index);
      toast.success('O talão foi removido.');
    }
  };

  const aoExcluirTudo = async () => {
    const ok = await confirmar('Excluir TUDO?', 'Todos os talões serão apagados permanentemente!');
    if (ok) {
      excluirTodos();
      toast.success('Todos os talões foram removidos.');
    }
  };

  return (
    <div className={styles.wrap}>
      {elemento}
      {jogos.length > 0 && (
        <Botao variante="perigo" onClick={aoExcluirTudo}>
          Excluir Tudo
        </Botao>
      )}
      <EstadoLista vazio={jogos.length === 0} mensagemVazio="Nenhum talão cadastrado" />
      {jogos.map((numeros, i) => (
        <LinhaJogo key={i} indice={i} numeros={numeros} cor={loteria.accent} aoRemover={() => aoRemover(i)} />
      ))}
    </div>
  );
}
