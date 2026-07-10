import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar.jsx';
import BannerAnuncio from '../BannerAnuncio/BannerAnuncio.jsx';
import { useCabecalhoAtual } from '../../../context/CabecalhoContext.jsx';
import styles from './Layout.module.css';

/** Home, Blog (lista/post) e telas de "listar" mostram o banner — nunca sobre a GradeDezenas (interativa). */
function mostraBanner(pathname) {
  const partes = pathname.split('/').filter(Boolean);
  return pathname === '/ferramentas' || partes[0] === 'blog' || pathname === '/' || partes[1] === 'listar';
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
