import { Link } from 'react-router-dom';
import Icone from '../../components/atoms/Icone/Icone.jsx';
import Footer from '../../components/organisms/Footer/Footer.jsx';
import { ABAS, ORDEM_ABAS } from './abas.js';
import { LOTTERY_INFO } from './loteriaInfo.js';

/** Grade de ferramentas de uma loteria + conteúdo educacional (SEO) + FAQ. */
export default function LoteriaMenu({ loteria }) {
  const info = LOTTERY_INFO[loteria.nome];

  return (
    <div className="page-enter">
      <p style={{ textAlign: 'center', padding: '20px 16px 8px', fontSize: 10, fontWeight: 700, letterSpacing: 4, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
        O que deseja fazer?
      </p>
      <div className="menu">
        {ORDEM_ABAS.map((aba) => (
          <Link key={aba} to={`/${loteria.url}/${aba}`} className="menu__item" style={{ '--cor': loteria.accent }}>
            <Icone nome={ABAS[aba].icone} className="menu__icon--svg" />
            <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase' }}>{ABAS[aba].label}</span>
          </Link>
        ))}
        <Link to="/politicas" className="menu__item" style={{ '--cor': loteria.accent }}>
          <Icone nome="alerta" />
          <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase' }}>Políticas</span>
        </Link>
      </div>

      <div style={{ display: 'flex', gap: 8, margin: '0 16px 16px', padding: 12, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14 }}>
        <Icone nome="alerta" />
        <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>
          Ferramenta educacional e matemática. Não garantimos ganhos. <Link to="/politicas">Saiba mais.</Link>
        </p>
      </div>

      {info && (
        <section style={{ padding: '0 16px 16px' }} aria-label={`Sobre a ${loteria.nome}`}>
          <p dangerouslySetInnerHTML={{ __html: info.intro }} />
          <h3>Dados da Loteria</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
            {info.stats.map((s) => (
              <div key={s.label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 10, textAlign: 'center' }}>
                <div style={{ fontWeight: 800 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
          <h3>Perguntas Frequentes</h3>
          <div itemScope itemType="https://schema.org/FAQPage">
            {info.faq.map((item) => (
              <div key={item.q} itemScope itemProp="mainEntity" itemType="https://schema.org/Question" style={{ marginBottom: 12 }}>
                <p itemProp="name" style={{ fontWeight: 700 }}>{item.q}</p>
                <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <p itemProp="text" style={{ color: 'var(--text-muted)' }}>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
