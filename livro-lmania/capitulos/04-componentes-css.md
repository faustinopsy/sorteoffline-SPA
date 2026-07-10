<h1 class="mod">Módulo 2 — Arquitetura e estilo</h1>

Um app cresce sem virar caos quando é bem organizado. Aqui você aprende a construir a interface com peças reutilizáveis (Atomic Design), a estilizá-las sem conflitos (CSS Modules), e a dar ao LMania um sistema de **temas** claro/escuro — tudo apoiado nos design tokens que definimos no Módulo 1.

<h1 class="cap"><span class="num">Capítulo 4</span> — Componentes reutilizáveis e CSS Modules</h1>

## 4.1 Props e Atomic Design

Um componente vira reutilizável quando recebe dados por **props**. E organizamos os componentes em três níveis (**Atomic Design**): **átomos** (peças mínimas: `Bola`, `Botao`), **moléculas** (átomos combinados: `CardLoteria`), **organismos** (blocos com estado e lógica: `GradeDezenas`, `Navbar`, `PainelResultados`).

Vamos extrair a `Bola` do capítulo anterior num átomo próprio:

```jsx
// src/components/atoms/Bola/Bola.jsx
import estilos from './Bola.module.css';

export default function Bola({ numero, selecionada = false, aoClicar }) {
  return (
    <button
      className={`${estilos.bola} ${selecionada ? estilos.selecionada : ''}`}
      onClick={() => aoClicar?.(numero)}
    >
      {numero}
    </button>
  );
}
```

A `Bola` é "burra": não sabe o que é uma loteria, só desenha um número e avisa quando é clicada (via `aoClicar`). Esse padrão — **dados descem por props, eventos sobem por callbacks** — é a espinha dorsal do React, e o que torna a `Bola` reutilizável em qualquer grade.

## 4.2 CSS Modules: estilo sem conflito

CSS é global — uma regra `.bola` afetaria toda `.bola` da página. O **Vite** resolve isso com os **CSS Modules**: nomeie o arquivo `Componente.module.css` e importe como objeto. O Vite gera nomes únicos por baixo, isolando cada componente.

```css
/* src/components/atoms/Bola/Bola.module.css */
.bola {
  width: 40px; height: 40px; border-radius: 50%;
  background: var(--card); color: var(--text);
  border: 1px solid var(--border); font-weight: 600; cursor: pointer;
}
.selecionada {
  background: var(--accent); color: #fff; border-color: var(--accent);
}
```

Note que usamos os **tokens** (`var(--card)`, `var(--accent)`) do Módulo 1 — não cores fixas. A bolinha selecionada fica na cor de destaque, seja ela qual for no tema atual.

## 4.3 Uma molécula: o card de loteria

A Home mostra as quatro loterias numa grade de cards. Cada card é uma molécula que recebe a config e avisa quando é escolhido:

```jsx
// src/components/molecules/CardLoteria/CardLoteria.jsx
import estilos from './CardLoteria.module.css';

export default function CardLoteria({ loteria, aoEscolher }) {
  return (
    <button
      className={estilos.card}
      style={{ '--cor': loteria.accent }}    // passa a cor da loteria via CSS variable
      onClick={() => aoEscolher(loteria)}
    >
      <span className={estilos.nome}>{loteria.nome}</span>
      <span className={estilos.info}>{loteria.escolhe} a {loteria.max} dezenas</span>
    </button>
  );
}
```

<div class="callout dica" markdown="1">
<span class="rot">Dica — passando valores dinâmicos ao CSS</span>
Repare no `style={{ '--cor': loteria.accent }}`: passamos a cor específica da loteria como uma variável CSS inline. No `.module.css`, o card usa `var(--cor)` para a borda ou o brilho. Assim, cada card tem a cor da sua loteria (roxo para Lotofácil, verde para Mega...) com **um** componente e **um** CSS — sem quatro variações. É a mistura elegante de props (React) com variáveis (CSS).
</div>

## 4.4 A grade da Home

A Home monta os cards com um `.map()` sobre a config — a mesma inversão de sempre: dados descrevem, componente desenha:

```jsx
// src/pages/Home/Home.jsx
import { LOTERIAS } from '../../services/loterias/config';
import CardLoteria from '../../components/molecules/CardLoteria/CardLoteria';

export default function Home() {
  const navegar = useNavigate();
  return (
    <div className="grade-loterias">
      {LOTERIAS.map((l) => (
        <CardLoteria key={l.url} loteria={l} aoEscolher={(lot) => navegar(`/${lot.url}`)} />
      ))}
    </div>
  );
}
```

<div class="callout importante" markdown="1">
<span class="rot">Importante — o ganho concreto da reutilização</span>
Adicionar uma quinta loteria ao LMania? Basta uma linha no arquivo de config — a Home ganha o card automaticamente, a tela de loteria funciona parametrizada, tudo sem escrever componentes novos. É a recompensa de construir com peças (Atomic Design) e centralizar dados (a config). O app cresce por configuração, não por cópia.
</div>

Com componentes e estilo prontos, o próximo passo é o sistema de temas — que aproveita os tokens para claro/escuro instantâneo.
