import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar.jsx';
import BannerAnuncio from '../BannerAnuncio/BannerAnuncio.jsx';
import { useCabecalhoAtual } from '../../../context/CabecalhoContext.jsx';
import styles from './Layout.module.css';

/** Home e telas de "listar" mostram o banner — nunca sobre a GradeDezenas (interativa). */
function mostraBanner(pathname) {
  const partes = pathname.split('/').filter(Boolean);
  return pathname === '/ferramentas' || partes[1] === 'listar';
}

export default function Layout() {
  const { gradient, titulo } = useCabecalhoAtual();
  const { pathname } = useLocation();

  return (
    <>
      <header className={styles.header} style={gradient ? { background: gradient } : undefined}>
        <h1>LMania</h1>
        <span>{titulo}</span>
      </header>
      {mostraBanner(pathname) && <BannerAnuncio />}
      <div className={styles.conteudo}>
        <Outlet />
      </div>
      <Navbar />
    </>
  );
}
