<h1 class="cap"><span class="num">Capítulo 16</span> — O espaço de anúncios</h1>

## 16.1 Um banner padronizado entre apps

Apps gratuitos costumam ter anúncios, e é comum que vários apps da mesma casa compartilhem o **mesmo** sistema, gerenciado num servidor central. No LMania, os anúncios vêm de um endpoint compartilhado: `https://kibusao.com/public/api/anuncios.php`. Construímos um `BannerAnuncio` que consome esse endpoint — um componente projetado para ser **idêntico** entre apps.

## 16.2 O contrato do endpoint

O servidor devolve este JSON (o **contrato** — o formato que o componente espera):

```json
{
  "habilitado": true,
  "intervaloMs": 6000,
  "anuncios": [
    { "id": "a1", "tipo": "texto", "titulo": "Anuncie aqui",
      "texto": "Sua marca vista por milhares.", "link": "https://...", "imagemUrl": "" }
  ]
}
```

Regras: se `habilitado` for falso ou a lista vier vazia, **não mostra nada**; com 2+ anúncios, rotaciona a cada `intervaloMs`; `tipo: "imagem"` mostra a imagem, senão o texto; havendo `link`, abre em nova aba.

## 16.3 O componente

```jsx
// src/components/BannerAnuncio/BannerAnuncio.jsx
import { useEffect, useState } from 'react';
import estilos from './BannerAnuncio.module.css';

const ANUNCIOS_URL = 'https://kibusao.com/public/api/anuncios.php';

export default function BannerAnuncio() {
  const [dados, setDados] = useState(null);
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    let vivo = true;
    fetch(ANUNCIOS_URL)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (vivo) setDados(d ?? { habilitado: false, anuncios: [] }); })
      .catch(() => { if (vivo) setDados({ habilitado: false, anuncios: [] }); });
    return () => { vivo = false; };
  }, []);

  const anuncios = dados?.habilitado ? (dados.anuncios ?? []) : [];

  useEffect(() => {
    setIndice(0);
    if (anuncios.length < 2) return undefined;
    const ms = Math.max(2000, dados?.intervaloMs ?? 6000);
    const t = setInterval(() => setIndice((i) => (i + 1) % anuncios.length), ms);
    return () => clearInterval(t);
  }, [anuncios.length, dados?.intervaloMs]);

  if (anuncios.length === 0) return null;   // sem anúncio, sem espaço vazio

  const a = anuncios[indice % anuncios.length];
  const conteudo = a.tipo === 'imagem' && a.imagemUrl
    ? <img className={estilos.imagem} src={a.imagemUrl} alt={a.titulo || 'Anúncio'} />
    : <div className={estilos.texto}><b>{a.titulo}</b><span>{a.texto}</span></div>;

  return (
    <div className={estilos.banner}>
      <span className={estilos.rotulo}>Publicidade</span>
      {a.link
        ? <a href={a.link} target="_blank" rel="noopener noreferrer nofollow">{conteudo}</a>
        : conteudo}
    </div>
  );
}
```

## 16.4 Posicionando no LMania

O banner fica no topo do conteúdo, na Home e nas telas de lista — sem sobrepor a grade de dezenas (que é interativa):

```jsx
// no topo da Home ou das telas de lista
<BannerAnuncio />
```

<div class="callout importante" markdown="1">
<span class="rot">Importante — os detalhes do link (segurança e SEO)</span>
Repare no `rel="noopener noreferrer nofollow"` do link. `noopener`/`noreferrer` impedem que o site de destino manipule sua página (segurança); `nofollow` diz aos buscadores para não passar autoridade de SEO ao link pago (padrão de publicidade). E o rótulo "Publicidade" é transparência com o usuário. São detalhes pequenos que só quem entende inclui — e que fazem diferença em segurança, SEO e confiança.
</div>

<div class="callout dica" markdown="1">
<span class="rot">Dica — o mesmo banner em vários apps</span>
Este `BannerAnuncio` não sabe nada do LMania — só busca os anúncios e se desenha. Por isso ele é "plug-and-play": o mesmo componente encaixa em qualquer app da casa, consumindo o mesmo endpoint, sem uma linha de diferença. É a padronização em ação: um servidor central de anúncios, um componente idêntico, vários apps. Se surgirem mais apps, extraia-o para um pacote compartilhado, com uma única fonte de verdade.
</div>

O LMania está completo em funcionalidades e monetização. Falta o passo final: colocá-lo no mundo. É o deploy — o capítulo de encerramento.
