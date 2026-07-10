import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icone from '../../atoms/Icone/Icone.jsx';
import styles from './Navbar.module.css';

const CONFIG_ROUTES = new Set(['configuracoes', 'politicas', 'privacidade', 'contato', 'sobre']);

function abaAtiva(pathname) {
  const primeiro = pathname.split('/')[1] || '';
  if (pathname === '/' || primeiro === 'blog') return 'blog';
  if (CONFIG_ROUTES.has(primeiro)) return 'settings';
  return 'ferramentas';
}

/** Bottom nav — esconde ao rolar para baixo, mostra ao rolar para cima. */
export default function Navbar() {
  const { pathname } = useLocation();
  const ativa = abaAtiva(pathname);
  const [escondida, setEscondida] = useState(false);
  const ultimaPosicao = useRef(0);

  useEffect(() => {
    function aoRolar() {
      const atual = window.pageYOffset;
      setEscondida(atual > ultimaPosicao.current && atual > 80);
      ultimaPosicao.current = atual;
    }
    window.addEventListener('scroll', aoRolar, { passive: true });
    return () => window.removeEventListener('scroll', aoRolar);
  }, []);

  return (
    <nav className={styles.nav} style={{ bottom: escondida ? -80 : 0 }} aria-label="Navegação principal">
      <Link to="/ferramentas" className={`${styles.item} ${ativa === 'ferramentas' ? styles.ativo : ''}`}>
        <Icone nome="inicio" />
        <span>Início</span>
      </Link>
      <Link to="/blog" className={`${styles.item} ${ativa === 'blog' ? styles.ativo : ''}`} aria-label="Blog">
        <span className={styles.pill}>
          <Icone nome="blog" tamanho={24} />
        </span>
      </Link>
      <Link to="/configuracoes" className={`${styles.item} ${ativa === 'settings' ? styles.ativo : ''}`}>
        <Icone nome="config" />
        <span>Config</span>
      </Link>
    </nav>
  );
}
