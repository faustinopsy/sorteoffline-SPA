import CardLoteria from '../../components/molecules/CardLoteria/CardLoteria.jsx';
import Footer from '../../components/organisms/Footer/Footer.jsx';
import { useCabecalho } from '../../context/CabecalhoContext.jsx';
import { useSeo } from '../../hooks/useSeo.js';
import { LOTERIAS } from '../../services/loterias/config.js';

const SUBTITULOS = {
  lotofacil: '11 a 15 números',
  'mega-sena': '4 a 6 números',
  quina: '3 a 5 números',
  lotomania: '16 a 20 números',
};

/** Grade das 4 loterias — tela "Ferramentas". */
export default function Home() {
  useCabecalho('linear-gradient(160deg, #0f172a 0%, #1e3a5f 50%, #0f4c81 100%)', 'Boa Sorte! 🍀');
  useSeo(
    'Ferramentas | LMania',
    'Ferramenta matemática gratuita para apostadores. Analise, organize e confira seus jogos da Mega-Sena, Lotofácil, Quina e Lotomania.'
  );

  return (
    <div className="page-enter">
      <p style={{ textAlign: 'center', padding: '24px 16px 8px', fontSize: 11, fontWeight: 700, letterSpacing: 4, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
        Escolha sua loteria
      </p>
      <div className="menu">
        {LOTERIAS.map((l) => (
          <CardLoteria key={l.url} loteria={l} subtitulo={SUBTITULOS[l.url]} />
        ))}
      </div>
      <Footer />
    </div>
  );
}
