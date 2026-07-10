import Bola from '../../atoms/Bola/Bola.jsx';
import Botao from '../../atoms/Botao/Botao.jsx';
import styles from './LinhaJogo.module.css';

/** Um jogo salvo: lista de bolinhas + ação de remover e/ou contagem de acertos. */
export default function LinhaJogo({ indice, numeros, cor, acertos, aoRemover }) {
  const dezenas = numeros.split(',').map(Number);
  return (
    <div className={styles.linha}>
      <strong>Nº {indice + 1}</strong>
      <div className={styles.bolas}>
        {dezenas.map((n) => (
          <Bola key={n} numero={n} cor={cor} />
        ))}
      </div>
      {typeof acertos === 'number' && (
        <span className={styles.acertos}>
          {acertos} acerto{acertos !== 1 ? 's' : ''}
        </span>
      )}
      {aoRemover && (
        <Botao variante="perigo" onClick={aoRemover} aria-label={`Remover talão ${indice + 1}`}>
          Remover
        </Botao>
      )}
    </div>
  );
}
