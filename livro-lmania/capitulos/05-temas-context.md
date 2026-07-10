<h1 class="cap"><span class="num">Capítulo 5</span> — Temas com Context e variáveis CSS</h1>

## 5.1 Estado que várias telas compartilham

O tema (as cores do app) é conhecido por **todas** as telas ao mesmo tempo. Passar isso de componente em componente seria um suplício. A solução do React é o **Context** — um jeito de disponibilizar um valor para toda a árvore de componentes, sem passá-lo manualmente.

## 5.2 Temas como dados

Primeiro, definimos os temas como objetos de dados (em `services/`), cada um com seu conjunto de cores:

```js
// src/services/temas.js
export const TEMAS = {
  escuro: { bg: '#080c14', card: '#131b2e', text: '#e8edf5', accent: '#f97316' },
  claro:  { bg: '#f8fafc', card: '#ffffff', text: '#0f172a', accent: '#ea580c' },
};
export const TEMA_PADRAO = 'escuro';
```

## 5.3 O TemaContext

O Context guarda o tema atual, aplica as cores como **variáveis CSS** no elemento raiz, e persiste a escolha:

```jsx
// src/context/TemaContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { TEMAS, TEMA_PADRAO } from '../services/temas';

const TemaContext = createContext(null);

export function TemaProvider({ children }) {
  const [nome, setNome] = useState(() => localStorage.getItem('lmania_tema') ?? TEMA_PADRAO);

  useEffect(() => {
    const tema = TEMAS[nome] ?? TEMAS[TEMA_PADRAO];
    const root = document.documentElement;
    root.style.setProperty('--bg', tema.bg);       // aplica cada cor como variável
    root.style.setProperty('--card', tema.card);
    root.style.setProperty('--text', tema.text);
    root.style.setProperty('--accent', tema.accent);
    localStorage.setItem('lmania_tema', nome);      // persiste
  }, [nome]);

  return (
    <TemaContext.Provider value={{ nome, trocar: setNome, temas: Object.keys(TEMAS) }}>
      {children}
    </TemaContext.Provider>
  );
}

export const useTema = () => useContext(TemaContext);
```

## 5.4 Por que isso é tão eficiente

A mágica: como **todos** os componentes usam `var(--bg)`, `var(--text)`, `var(--accent)` no CSS (graças aos tokens do Módulo 1), trocar o tema é só mudar o valor dessas variáveis no `:root`. O app inteiro muda de cor **instantaneamente, sem re-renderizar o React** — o CSS faz o trabalho. Você não injeta `style` em cada componente; muda quatro variáveis, e milhares de elementos reagem.

```jsx
// a tela de configurações troca o tema com uma linha:
const { nome, trocar, temas } = useTema();
{temas.map((t) => (
  <button key={t} onClick={() => trocar(t)}>{t}</button>
))}
```

<div class="callout importante" markdown="1">
<span class="rot">Importante — variáveis semânticas, não pigmentos</span>
Nomeamos as variáveis pela **função** (`--bg`, `--text`, `--accent`), não pelo pigmento (`--preto`, `--laranja`). Isso é vital: no tema claro, `--text` vira escuro; no escuro, vira claro. Se a variável se chamasse `--branco`, você teria o absurdo de `color: var(--branco)` pintando de preto. A variável descreve o papel da cor, e é o papel que muda entre temas. Esse cuidado é o que torna o tema claro/escuro elegante em vez de remendado.
</div>

## 5.5 Ligando o Provider

O `TemaProvider` envolve o app no `main.jsx`, para que qualquer tela alcance o tema:

```jsx
// src/main.jsx
import { TemaProvider } from './context/TemaContext';

createRoot(document.getElementById('root')).render(
  <TemaProvider>
    <App />
  </TemaProvider>
);
```

<div class="callout dica" markdown="1">
<span class="rot">Dica — o mesmo padrão serve para o tamanho de fonte</span>
O LMania original também tem controle de tamanho de fonte (acessibilidade). A técnica é idêntica à do tema: mudar uma propriedade no `:root` (`document.documentElement.style.fontSize = '110%'`) e persistir. Como todo o CSS usa unidades relativas (`rem`), a fonte escala proporcionalmente. Você pode envolver isso no mesmo Context de tema, ou num hook `useTamanhoFonte`. Acessibilidade não é opcional — inclua desde já.
</div>

## 5.6 Fecho do módulo

Você tem a arquitetura de interface: componentes reutilizáveis (Atomic Design), estilo isolado (CSS Modules), tokens centralizados e temas via Context. O LMania já tem cara, cores e a grade interativa. No **Módulo 3**, damos a ele telas de verdade — navegação, a tela de cada loteria, e o salvar/listar jogos.
