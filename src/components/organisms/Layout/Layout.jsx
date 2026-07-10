import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar.jsx';
import BannerAnuncio from '../BannerAnuncio/BannerAnuncio.jsx';
import { useCabecalhoAtual } from '../../../context/CabecalhoContext.jsx';
import { porUrl } from '../../../services/loterias/config.js';
import styles from './Layout.module.css';

// Abas com grade interativa de dezenas — nunca mostrar o banner sobre elas.
const ABAS_SEM_BANNER = new Set(['cadastrar', 'combinar', 'fechar']);

/** Home, Blog (lista/post) e telas não-interativas de loteria mostram o banner. */
function mostraBanner(pathname) {
  const partes = pathname.split('/').filter(Boolean);
  if (pathname === '/' || pathname === '/ferramentas' || partes[0] === 'blog') return true;

  if (porUrl(partes[0])) return !ABAS_SEM_BANNER.has(partes[1]);
  return false;
}

export default function Layout() {
  const { gradient, titulo } = useCabecalhoAtual();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <header className={styles.header} style={gradient ? { background: gradient } : undefined}>
        <h1>
          LMania{titulo ? <span className={styles.separador}> · </span> : null}
          {titulo && <span className={styles.subtitulo}>{titulo}</span>}
        </h1>
      </header>
      {mostraBanner(pathname) && <BannerAnuncio />}
      <div className={styles.conteudo}>
        <Outlet />
      </div>
      <Navbar />
    </>
  );
}
