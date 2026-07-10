<h1 class="mod">Módulo 4 — Dados, persistência e offline</h1>

O LMania é "offline-first": os jogos vivem no dispositivo do usuário e o app funciona sem internet. Neste módulo você aprende a persistir dados localmente de forma limpa, a buscar resultados oficiais com cache, a conferir jogos, e a transformar o site num app instalável (PWA) que abre sem rede.

<h1 class="cap"><span class="num">Capítulo 9</span> — Persistência local com localStorage</h1>

## 9.1 O localStorage como "disco"

O `localStorage` do navegador guarda dados que sobrevivem ao fechamento — é o "disco" do app. Mas acessá-lo direto, espalhado pela interface, vira bagunça. Encapsulamos tudo num **service** com uma API limpa; os componentes chamam funções nomeadas e não sabem os detalhes.

```js
// src/services/storage.js — puro, sem React
const chave = (loteria) => `lmania_jogos_${loteria}`;

export function listarJogos(loteria) {
  try { return JSON.parse(localStorage.getItem(chave(loteria))) ?? []; }
  catch { return []; }
}
export function salvarJogo(loteria, dezenas) {
  const jogos = listarJogos(loteria);
  salvar(loteria, [...jogos, dezenas]);       // array novo — imutável
}
export function removerJogo(loteria, indice) {
  salvar(loteria, listarJogos(loteria).filter((_, i) => i !== indice));
}
export function excluirTodos(loteria) { localStorage.removeItem(chave(loteria)); }

function salvar(loteria, jogos) {
  localStorage.setItem(chave(loteria), JSON.stringify(jogos));
}
```

Um array por loteria (JSON) é simples: adicionar é `[...jogos, novo]`, remover é `filter`. Sem "contadores" nem "reindexação" como no código antigo — a complexidade some.

## 9.2 Um hook para casar estado e disco

O padrão "estado em memória + cópia no disco" (que vimos ao salvar jogos) merece um hook reutilizável — para tema, preferências, qualquer coisa que persista:

```js
// src/hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

export function useLocalStorage(chave, inicial) {
  const [valor, setValor] = useState(() => {
    try { const s = localStorage.getItem(chave); return s ? JSON.parse(s) : inicial; }
    catch { return inicial; }
  });
  useEffect(() => { localStorage.setItem(chave, JSON.stringify(valor)); }, [chave, valor]);
  return [valor, setValor];
}
```

Agora `const [tema, setTema] = useLocalStorage('lmania_tema', 'escuro')` — o `tema` reage como estado e persiste sozinho.

<div class="callout importante" markdown="1">
<span class="rot">Importante — estado em memória, disco em paralelo</span>
O princípio: mantenha o dado no **estado** (para a tela reagir na hora) e escreva no `localStorage` **em paralelo** (para sobreviver ao fechamento). Nunca faça a tela ler do disco a cada render — leia uma vez na inicialização, e depois o estado é a verdade. O `useLocalStorage` encapsula exatamente esse padrão, e você o reusa o app inteiro.
</div>

## 9.3 Migração de dados: não perca os jogos dos usuários

Se você está reconstruindo um app que já tem usuários (como o LMania original, com jogos salvos num formato antigo), é **responsabilidade sua** não fazê-los perder os dados. Escreva uma migração que roda uma vez: lê o formato antigo, converte, e salva no novo.

```js
// src/services/storage.js — roda uma vez na inicialização do app
export function migrarFormatoAntigo() {
  if (localStorage.getItem('migrado_v2')) return;   // já migrou
  // ...lê as chaves antigas (contador + itens numerados), converte para arrays...
  localStorage.setItem('migrado_v2', 'true');
}
```

<div class="callout cuidado" markdown="1">
<span class="rot">Cuidado — migração de dados é coisa séria</span>
Mudar o formato de armazenamento sem migrar faz os usuários abrirem a versão nova e "perderem" tudo que salvaram. Isso destrói a confiança. Sempre que mudar o esquema de dados, escreva a migração, teste-a com dados reais do formato antigo, e só então publique. Nunca quebre o que já está no dispositivo das pessoas — é um princípio ético de quem mantém software de verdade.
</div>

Com a persistência resolvida, o próximo passo é trazer dados de fora — os resultados oficiais das loterias — para conferir os jogos.
