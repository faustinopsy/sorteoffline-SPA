<h1 class="mod">Módulo 6 — Conteúdo e publicação</h1>

A ferramenta está pronta; falta transformá-la em produto público. Neste módulo final adicionamos conteúdo (um blog, que traz visitantes e ajuda no SEO), o espaço de anúncios (padronizado com outros apps da casa), e publicamos o LMania no mundo — instalável, rápido e no ar.

<h1 class="cap"><span class="num">Capítulo 15</span> — Um blog dentro do app</h1>

## 15.1 Por que um blog

Um blog de conteúdo (artigos sobre probabilidade, estatística, estratégias) traz visitantes pelos buscadores e dá autoridade ao app. Ele exemplifica dois padrões importantes que ainda não vimos juntos: **buscar uma lista** e **abrir um item** por uma rota dinâmica.

## 15.2 O service do blog

Como sempre, a comunicação com o servidor mora num service:

```js
// src/services/blog.js
const BLOG_BASE = import.meta.env.VITE_BLOG_API ?? 'https://api.lmania.com.br/blog';

export const listarPosts = () => fetch(`${BLOG_BASE}/posts`).then((r) => r.json());
export const buscarPost = (slug) => fetch(`${BLOG_BASE}/posts/${slug}`).then((r) => r.json());
```

## 15.3 A lista de posts

A tela de blog busca os posts e os lista com links para cada um:

```jsx
// src/pages/Blog/Blog.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listarPosts } from '../../services/blog';
import { useSeo } from '../../hooks/useSeo';

export default function Blog() {
  useSeo('Blog | LMania', 'Artigos sobre loterias, probabilidade e estatística.');
  const [posts, setPosts] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    listarPosts()
      .then((d) => { if (ativo) setPosts(d); })
      .finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, []);

  if (carregando) return <p>Carregando artigos...</p>;
  return (
    <div>
      <h2>Blog</h2>
      {posts.map((post) => (
        <Link key={post.slug} to={`/blog/${post.slug}`} className="card-post">
          <h3>{post.titulo}</h3>
          <p>{post.resumo}</p>
        </Link>
      ))}
    </div>
  );
}
```

## 15.4 O post individual: rota dinâmica

Cada post tem sua própria URL (`/blog/como-funciona-o-fechamento`). A tela lê o `slug` da rota e busca o conteúdo:

```jsx
// src/pages/BlogPost/BlogPost.jsx
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { buscarPost } from '../../services/blog';
import { useSeo } from '../../hooks/useSeo';

export default function BlogPost() {
  const { slug } = useParams();               // o trecho variável da URL
  const [post, setPost] = useState(null);

  useEffect(() => {
    buscarPost(slug).then(setPost);
  }, [slug]);                                  // rebusca se o slug mudar

  useSeo(post ? `${post.titulo} | LMania` : 'Carregando...', post?.resumo ?? '');

  if (!post) return <p>Carregando...</p>;
  return (
    <article>
      <h1>{post.titulo}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.conteudoHtml }} />
    </article>
  );
}
```

<div class="callout cuidado" markdown="1">
<span class="rot">Cuidado — o `dangerouslySetInnerHTML`</span>
Para renderizar HTML vindo do servidor (o corpo do post), usamos `dangerouslySetInnerHTML`. O nome é um aviso sério: se o HTML contiver scripts maliciosos, eles seriam executados na sua página (ataque XSS). Só use com conteúdo de uma fonte **confiável** (o seu próprio backend) e, idealmente, sanitizado no servidor. Nunca injete HTML vindo diretamente de um usuário sem limpá-lo. O nome "dangerously" é literal — respeite-o.
</div>

<div class="callout importante" markdown="1">
<span class="rot">Importante — o padrão "lista → detalhe"</span>
O blog exemplifica um padrão universal: uma tela de **lista** (com links) e uma tela de **detalhe** (que lê um id/slug da rota e busca o item). Você o encontrará em quase todo app — produtos e detalhe de produto, usuários e perfil, posts e artigo. Dominar esse par (lista com `.map()` de `<Link>` + detalhe com `useParams` + busca) é dominar metade das telas que você vai construir na vida.
</div>

Com conteúdo pronto, adicionamos o espaço de anúncios — o item que padroniza o LMania com os outros apps da casa.
