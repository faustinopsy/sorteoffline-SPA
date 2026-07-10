import { Link } from 'react-router-dom';
import styles from './CardLoteria.module.css';

/** Card de loteria na Home — usa a cor de destaque (`accent`) da config. */
export default function CardLoteria({ loteria, subtitulo }) {
  return (
    <Link to={`/${loteria.url}`} className={styles.card} style={{ '--cor': loteria.accent }}>
      <div className={styles.barra} />
      <div className={styles.icone}>{loteria.simb.slice(0, 2).toUpperCase()}</div>
      <span className={styles.nome}>{loteria.nome}</span>
      {subtitulo && <span className={styles.sub}>{subtitulo}</span>}
    </Link>
  );
}
