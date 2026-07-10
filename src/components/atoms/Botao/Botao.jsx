import styles from './Botao.module.css';

/** Botão padrão do app. `variante`: primario | perigo | fantasma. */
export default function Botao({ variante = 'primario', className = '', ...props }) {
  return <button type="button" className={`${styles.botao} ${styles[variante]} ${className}`} {...props} />;
}
