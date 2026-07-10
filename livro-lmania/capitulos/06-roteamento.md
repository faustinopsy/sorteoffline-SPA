<h1 class="mod">Módulo 3 — As telas de loteria</h1>

O app ganha telas de verdade. Neste módulo montamos a navegação (com URLs amigáveis e SEO), a tela de cada loteria com a grade de dezenas, e o fluxo de salvar e listar jogos — a funcionalidade central do LMania, apoiada na persistência local que aprofundamos no módulo seguinte.

<h1 class="cap"><span class="num">Capítulo 6</span> — Navegação com React Router e SEO</h1>

## 6.1 URLs reais numa SPA

O LMania tem telas — Home, cada loteria, blog, configurações — e queremos URLs de verdade (`/mega-sena`, não `#mega`), para que o usuário possa compartilhar links, o botão voltar funcione, e os buscadores indexem. Isso é o **React Router**:

```bash
npm install react-router-dom
```

## 6.2 Declarando as rotas

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:loteria" element={<Loteria />} />   {/* mega-sena, quina... */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
```

## 6.3 Uma rota dinâmica para as quatro loterias

Repare na rota `/:loteria` — os dois-pontos marcam um trecho **variável**. Em vez de quatro telas quase iguais (uma por loteria), temos **uma** que lê o parâmetro e busca a config:

```jsx
// src/pages/Loteria/Loteria.jsx
import { useParams } from 'react-router-dom';
import { LOTERIAS } from '../../services/loterias/config';

export default function Loteria() {
  const { loteria } = useParams();                        // 'mega-sena'
  const config = LOTERIAS.find((l) => l.url === loteria);
  if (!config) return <p>Loteria não encontrada.</p>;
  return <TelaLoteria config={config} />;                  // uma tela, parametrizada
}
```

Uma tela parametrizada substitui quatro. O `useParams()` lê o trecho variável da URL — e a config (Módulo 2) faz o resto.

## 6.4 Navegando: `Link` e `useNavigate`

Para links, o `<Link>` (muda a URL sem recarregar); após uma ação, o `useNavigate`:

```jsx
import { Link, useNavigate } from 'react-router-dom';
<Link to="/mega-sena">Mega-Sena</Link>

const navegar = useNavigate();
navegar('/quina');    // navega por código
navegar(-1);          // volta uma tela
```

<div class="callout cuidado" markdown="1">
<span class="rot">Cuidado — nunca `location.reload()`</span>
No JavaScript antigo, recarregar a página era comum para "atualizar" a tela. Em React é um erro: destrói o estado e a fluidez. Para mudar de tela, `navegar(...)`; para atualizar dados, mude o estado. Se sentir vontade de recarregar, é sinal de que algo deveria ser estado ou Context.
</div>

## 6.5 SEO por rota

Diferente do Provas (um app interno), o LMania é público — então o SEO importa. Cada tela deve ter um título e uma descrição próprios, para os buscadores. Um hook simples resolve:

```js
// src/hooks/useSeo.js
import { useEffect } from 'react';
export function useSeo(titulo, descricao) {
  useEffect(() => {
    document.title = titulo;
    document.querySelector('meta[name="description"]')?.setAttribute('content', descricao);
  }, [titulo, descricao]);
}
// na tela: useSeo('Mega-Sena | LMania', 'Cadastre e confira seus jogos da Mega-Sena.');
```

<div class="callout dica" markdown="1">
<span class="rot">Dica — SEO em SPA tem limites (e soluções)</span>
Como uma SPA renderiza no navegador, alguns buscadores antigos podem não "ver" o conteúdo gerado por JavaScript. Para blogs e páginas públicas, a solução avançada é **SSR** (renderização no servidor, com frameworks como Next.js) ou pré-renderização. Para o LMania, o `useSeo` (título + descrição por rota) já cobre o essencial, e os buscadores modernos executam JavaScript. Comece simples; migre para SSR só se o SEO for crítico e você medir necessidade.
</div>

Com a navegação pronta, vamos à tela mais importante: a de uma loteria, onde o usuário monta e salva um jogo.
