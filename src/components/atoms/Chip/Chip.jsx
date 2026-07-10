import styles from './Chip.module.css';

/** Chip clicável (filtros de categoria do blog, etc.). */
export default function Chip({ ativo, children, ...props }) {
  return (
    <button type="button" className={`${styles.chip} ${ativo ? styles.ativo : ''}`} {...props}>
      {children}
    </button>
  );
}
