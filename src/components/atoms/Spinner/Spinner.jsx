import styles from './Spinner.module.css';

export default function Spinner() {
  return <div className={styles.spinner} role="status" aria-label="Carregando" />;
}
