import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Chip from '../../components/atoms/Chip/Chip.jsx';
import EstadoLista from '../../components/molecules/EstadoLista/EstadoLista.jsx';
import { useCabecalho } from '../../context/CabecalhoContext.jsx';
import { useSeo } from '../../hooks/useSeo.js';
import { listarPosts } from '../../services/blog.js';

/** Lista de posts do blog com filtro por categoria. */
export default function Blog() {
  useCabecalho(null, 'Blog');
  useSeo(
    'Blog | LMania',
    'Artigos educacionais sobre loterias brasileiras: probabilidade, estatística, fechamentos matemáticos e estratégias de organização.'
  );

  const [posts, setPosts] = useState(null);
  const [erro, setErro] = useState(null);
  const [categoria, setCategoria] = useState('all');

  useEffect(() => {
    listarPosts('pt')
      .then(setPosts)
      .catch(setErro);
  }, []);

  const categorias = useMemo(() => {
    if (!posts) return [];
    return ['all', ...new Set(posts.map((p) => p.category))];
  }, [posts]);

  const filtrados = useMemo(() => {
    if (!posts) return [];
    return categoria === 'all' ? posts : posts.filter((p) => p.category === categoria);
  }, [posts, categoria]);

  return (
    <div className="page-enter" style={{ padding: 16 }}>
      <EstadoLista carregando={!posts && !erro} erro={erro} vazio={posts?.length === 0} mensagemVazio="Nenhum post publicado ainda." />

      {posts?.length > 0 && (
        <>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 16 }}>
            {categorias.map((c) => (
              <Chip key={c} ativo={c === categoria} onClick={() => setCategoria(c)}>
                {c === 'all' ? 'Todos' : c}
              </Chip>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtrados.map((p) => (
              <Link
                key={p.id}
                to={`/blog/${p.slug || p.id}`}
                style={{ display: 'block', padding: 16, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, textDecoration: 'none' }}
              >
                <strong>{p.title}</strong>
                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{p.excerpt}</p>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
