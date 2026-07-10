import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

/** Rodapé institucional — disclaimer + links, repetido em Home e telas de loteria. */
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <nav className={styles.links}>
        <Link to="/sobre">Sobre</Link>
        <Link to="/privacidade">Privacidade</Link>
        <Link to="/politicas">Políticas</Link>
        <Link to="/contato">Contato</Link>
        <Link to="/blog">Blog</Link>
      </nav>
      <p>
        LMania é uma ferramenta educacional e matemática independente. Não possui vínculo com a Caixa Econômica
        Federal e não garante ganhos.
      </p>
      <p>© {new Date().getFullYear()} LMania</p>
    </footer>
  );
}
