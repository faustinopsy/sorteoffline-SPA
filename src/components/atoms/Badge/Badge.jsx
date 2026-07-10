import styles from './Badge.module.css';

/** Rótulo pequeno (ex.: "⏱" para fechamentos lentos, contadores). */
export default function Badge({ variante, children, title }) {
  return (
    <span className={`${styles.badge} ${variante ? styles[variante] : ''}`} title={title}>
      {children}
    </span>
  );
}
