import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EstadoLista from '../../components/molecules/EstadoLista/EstadoLista.jsx';
import { useCabecalho } from '../../context/CabecalhoContext.jsx';
import { buscarPost, buscarPostPorSlug } from '../../services/blog.js';
import { sanitizarHtml, tempoLeitura } from './sanitizar.js';

/** Post individual do blog — aceita slug ou id numérico na URL. */
export default function BlogPost() {
  useCabecalho(null, 'Blog');
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    setPost(null);
    setErro(null);
    const busca = /^\d+$/.test(slug) ? buscarPost(slug) : buscarPostPorSlug(slug);
    busca.then(setPost).catch(setErro);
  }, [slug]);

  useEffect(() => {
    if (!post) return;
    document.title = post.title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', post.excerpt || '');

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'blog-jsonld';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      datePublished: post.publishedAt,
      description: post.excerpt,
    });
    document.head.querySelector('#blog-jsonld')?.remove();
    document.head.appendChild(script);
    return () => script.remove();
  }, [post]);

  if (erro) return <EstadoLista erro={erro} />;
  if (!post) return <EstadoLista carregando />;

  return (
    <article className="page-enter" style={{ padding: 16 }}>
      <h1>{post.title}</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{tempoLeitura(post.content || '')} min de leitura</p>
      <div dangerouslySetInnerHTML={{ __html: sanitizarHtml(post.content || '') }} />
    </article>
  );
}
