import styles from './Bola.module.css';

/** Bolinha de dezena — usada na grade de seleção e na exibição de jogos salvos. */
export default function Bola({ numero, selecionada = false, aoClicar, cor }) {
  const texto = String(numero).padStart(2, '0');
  const className = `${styles.bola} ${selecionada ? styles.selecionada : ''}`;
  const style = cor ? { '--cor': cor } : undefined;

  if (!aoClicar) {
    return (
      <span className={className} style={style}>
        {texto}
      </span>
    );
  }

  return (
    <button type="button" className={className} style={style} onClick={aoClicar}>
      {texto}
    </button>
  );
}
