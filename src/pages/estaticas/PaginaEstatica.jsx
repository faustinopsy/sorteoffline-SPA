import { useCabecalho } from '../../context/CabecalhoContext.jsx';
import { useSeo } from '../../hooks/useSeo.js';

/** Wrapper genérico para as páginas de conteúdo estático (Sobre/Contato/Políticas/Privacidade). */
export default function PaginaEstatica({ gradient, titulo, seoTitulo, seoDesc, secoes }) {
  useCabecalho(gradient, titulo);
  useSeo(seoTitulo, seoDesc);

  return (
    <div className="page-enter" style={{ padding: 16 }}>
      <h1>{titulo}</h1>
      {secoes.map((s) => (
        <section key={s.title} style={{ marginBottom: 20 }}>
          <h2>{s.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: s.content }} />
        </section>
      ))}
    </div>
  );
}
