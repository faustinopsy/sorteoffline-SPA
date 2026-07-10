<h1 class="cap"><span class="num">Capítulo 2</span> — Ambiente e a estrutura do projeto</h1>

## 2.1 Criando o projeto com Vite

Usamos o **Vite**, a ferramenta moderna para React — sobe em milissegundos e atualiza a tela quase instantaneamente. Confira o Node primeiro (`node --version`, v20+), e crie o projeto:

```bash
npm create vite@latest lmania-react -- --template react
cd lmania-react
npm install
npm run dev
```

Abra `http://localhost:5173`. React rodando em segundos.

## 2.2 Limpando e preparando o terreno

Limpe o `src/App.jsx` (deixe um `<h1>LMania</h1>`) e configure o `src/index.css` com um reset e os **tokens** — as variáveis de design que darão identidade e tema ao app:

```css
/* src/index.css */
* { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --bg: #080c14;          --surface: #0e1420;   --card: #131b2e;
  --border: rgba(255,255,255,.07);  --text: #e8edf5;  --text-muted: #94a3b8;
  --accent: #f97316;      --primary: #3b82f6;   --success: #22c55e;  --danger: #ef4444;
  --sp-2: 8px;  --sp-3: 12px;  --sp-4: 16px;  --sp-6: 24px;
  --radius: 16px;
}

body {
  font-family: -apple-system, "Segoe UI", Roboto, sans-serif;
  background: var(--bg); color: var(--text); min-height: 100dvh;
}
```

<div class="callout dica" markdown="1">
<span class="rot">Dica — tokens desde o começo</span>
Definir as cores e espaçamentos como variáveis (`--accent`, `--sp-4`) já no início parece exagero, mas é o que vai permitir, no Módulo 2, ter **temas** (claro/escuro) e um visual consistente sem repetir cores. Os componentes vão usar `var(--accent)`, nunca um `#f97316` solto. Mude a variável, muda o app inteiro.
</div>

## 2.3 A planta do app

Um app do porte do LMania precisa de organização. Dentro de `src/`, esta é a estrutura que vamos preencher:

```text
src/
├── components/   # atoms (Bola, Botao), molecules (CardLoteria), organisms (Navbar, Grade)
├── pages/        # as telas (Home, Loteria, Blog, Configurações)
├── context/      # estado compartilhado (tema)
├── hooks/        # lógica reutilizável (useLocalStorage...)
├── services/     # lógica pura: loterias (config, combinações, fechamento), storage, resultados
└── assets/       # ícones, dados (tabelas de cobertura)
```

<div class="callout importante" markdown="1">
<span class="rot">Importante — a camada `services/` é o cérebro</span>
Repare na pasta `services/`. Nela vai morar toda a **lógica pura** do LMania — os algoritmos de loteria, o acesso ao storage, a busca de resultados — **sem uma linha de React**. Isso é intencional: lógica pura é testável, reutilizável e não quebra quando a interface muda. É a decisão de arquitetura mais importante do livro, e vamos voltar a ela sempre. A regra: se calcula ou busca dados, vai para `services/`; se desenha a tela, vai para `components/`.
</div>

## 2.4 A configuração das loterias

O LMania tem quatro loterias, cada uma com sua matemática. Centralizamos isso num único arquivo de dados — a fonte da verdade que todas as telas vão consultar:

```js
// src/services/loterias/config.js
export const LOTERIAS = [
  { nome: 'Lotofácil', url: 'lotofacil', max: 25,  escolhe: 15, sorteia: 15, accent: '#a855f7' },
  { nome: 'Lotomania',url: 'lotomania', max: 100, escolhe: 50, sorteia: 20, accent: '#ef4444' },
  { nome: 'Mega-Sena',url: 'mega-sena', max: 60,  escolhe: 6,  sorteia: 6,  accent: '#22c55e' },
  { nome: 'Quina',    url: 'quina',     max: 80,  escolhe: 5,  sorteia: 5,  accent: '#3b82f6' },
];
```

- `max` = quantas dezenas existem no volante; `escolhe` = mínimo de um jogo; `sorteia` = quantas saem; `accent` = a cor da loteria. Uma tela parametrizada por essa config serve às quatro — em vez de quatro telas quase iguais.

O ambiente e a planta estão prontos. No próximo capítulo, entendemos **como o React desenha** (o JSX), antes de construir a primeira peça de verdade: a grade de dezenas.
