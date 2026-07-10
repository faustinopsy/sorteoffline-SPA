import { useCabecalho } from '../../context/CabecalhoContext.jsx';
import { useSeo } from '../../hooks/useSeo.js';
import { useTema } from '../../context/TemaContext.jsx';
import { TEMAS, TAMANHOS_FONTE } from '../../services/temas.js';

/** Tema + tamanho de fonte — persistidos via TemaContext. */
export default function Configuracoes() {
  useCabecalho('linear-gradient(135deg, #0f0f0f 0%, #374151 60%, #6b7280 100%)', 'Configurações');
  useSeo('Configurações | LMania', 'Personalize o LMania: tema, tamanho de fonte e idioma.');

  const { tema, setTema, fonte, setFonte } = useTema();

  return (
    <div className="page-enter" style={{ padding: 16 }}>
      <section style={{ marginBottom: 24 }}>
        <p style={{ fontWeight: 700, marginBottom: 8 }}>Paletas</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
          {TEMAS.map((t) => (
            <button
              key={t.nome}
              type="button"
              onClick={() => setTema(t)}
              aria-label={`Aplicar tema ${t.nome}`}
              style={{
                border: t.nome === tema.nome ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                borderRadius: 10,
                padding: 6,
                background: 'var(--card)',
                cursor: 'pointer',
              }}
            >
              <div style={{ height: 36, borderRadius: 6, background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: t.primary }} />
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: t.accent }} />
              </div>
              <span style={{ display: 'block', fontSize: 9, marginTop: 4, color: 'var(--text-muted)' }}>{t.nome}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <p style={{ fontWeight: 700, marginBottom: 8 }}>Fonte</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          {TAMANHOS_FONTE.map((tamanho) => (
            <button
              key={tamanho}
              type="button"
              onClick={() => setFonte(tamanho)}
              style={{
                border: tamanho === fonte ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                borderRadius: 10,
                padding: 10,
                background: 'var(--card)',
                cursor: 'pointer',
              }}
            >
              <span style={{ display: 'block', fontWeight: 800 }}>Aa</span>
              <span style={{ display: 'block', fontSize: 10, opacity: 0.7 }}>{tamanho}%</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
