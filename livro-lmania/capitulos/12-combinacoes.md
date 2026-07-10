<h1 class="mod">Módulo 5 — Os algoritmos da loteria</h1>

Aqui o livro fica sério — e mais interessante. A ferramenta de loterias esconde matemática de verdade: combinações e fechamentos. Vamos entendê-las **no papel, com diagramas**, antes de escrever o código, e vê-las virarem services puros. Este é o módulo que transforma "mais um app de CRUD" numa ferramenta com inteligência.

<h1 class="cap"><span class="num">Capítulo 12</span> — Combinações: a base da matemática lotérica</h1>

## 12.1 A pergunta fundamental

Toda estratégia de loteria começa com uma pergunta: de quantas formas dá para escolher `k` dezenas dentre `n`? Isso são as **combinações**. Se você escolheu **8** dezenas favoritas e quer jogar todos os grupos de 6 (Mega-Sena), quantos jogos são? A resposta é a combinação de 8 tomados 6 a 6 — C(8,6) — que dá **28**.

<div class="fig">
<svg viewBox="0 0 540 130" xmlns="http://www.w3.org/2000/svg" font-family="Arial">
  <text x="20" y="22" font-size="10" font-weight="bold" fill="#22344d">8 dezenas escolhidas → todos os jogos de 6:</text>
  <g font-size="8.5" fill="#fff" text-anchor="middle">
    <rect x="20" y="34" width="150" height="24" rx="12" fill="#22c55e"/><text x="95" y="50">1·2·3·4·5·6</text>
    <rect x="185" y="34" width="150" height="24" rx="12" fill="#22c55e"/><text x="260" y="50">1·2·3·4·5·7</text>
    <rect x="350" y="34" width="150" height="24" rx="12" fill="#22c55e"/><text x="425" y="50">1·2·3·4·5·8</text>
    <rect x="185" y="64" width="150" height="24" rx="12" fill="#16a34a"/><text x="260" y="80">... 24 outros ...</text>
    <rect x="350" y="64" width="150" height="24" rx="12" fill="#22c55e"/><text x="425" y="80">3·4·5·6·7·8</text>
  </g>
  <text x="270" y="112" text-anchor="middle" font-size="11" fill="#b35c00" font-weight="bold">C(8,6) = 28 jogos</text>
</svg>
<div class="leg">Figura 12.1 — Escolher 8 dezenas e jogar todos os grupos de 6 gera 28 jogos.</div>
</div>

## 12.2 Gerando as combinações no código

O gerador é uma função recursiva clássica. A ideia: "para formar um jogo de `k` dezenas, escolho uma e formo um jogo de `k-1` com as que sobraram **à direita** dela" (olhar só à direita evita repetir o mesmo jogo em ordem diferente).

```js
// src/services/loterias/combinacoes.js — puro, testável
export function gerarCombinacoes(dezenas, tamanho, limite = Infinity) {
  const resultados = [];
  function aux(atual, restante, faltam) {
    if (resultados.length >= limite) return;
    if (faltam === 0) { resultados.push(atual); return; }   // jogo completo
    for (let i = 0; i <= restante.length - faltam; i++) {
      aux(atual.concat(restante[i]), restante.slice(i + 1), faltam - 1);
    }
  }
  aux([], dezenas, tamanho);
  return resultados;
}
// gerarCombinacoes([1,2,3,4,5,6,7,8], 6) → 28 jogos
```

<div class="callout nota" markdown="1">
<span class="rot">Nota — como a recursão "quebra" o problema</span>
A função resolve um problema grande dividindo em menores: escolher 6 de 8 vira "escolho a primeira, e escolho 5 das 7 restantes à direita", e assim por diante, até `faltam === 0` (um jogo completo). O `restante.slice(i + 1)` — só olhar à direita — garante que `[1,2]` e `[2,1]` (o mesmo jogo) não sejam contados duas vezes. Esse padrão "dividir para conquistar" aparece em muitos algoritmos; reconhecê-lo é uma habilidade transferível.
</div>

## 12.3 O `limite`: cuidado com a explosão combinatória

Repare no parâmetro `limite`. Ele existe por um motivo sério: as combinações **explodem**. C(8,6) são 28, mas C(20,6) são 38.760, e C(25,15) (Lotofácil) são **3.268.760**. Gerar todas travaria o navegador. O `limite` corta a geração num teto seguro.

<div class="callout cuidado" markdown="1">
<span class="rot">Cuidado — a explosão combinatória trava a tela</span>
Combinações crescem absurdamente rápido. Gerar "todas as combinações" de muitas dezenas pode gerar milhões de jogos e congelar o navegador (lembra que o JavaScript roda numa thread só, que também desenha a tela). Duas defesas: o `limite` (nunca gere mais que um teto), e — para cálculos genuinamente pesados — mover o trabalho para um **Web Worker** (uma thread paralela que não trava a interface). No Vite: `import Worker from './calc.worker?worker'`. Veremos a ideia no fechamento.
</div>

## 12.4 Selecionando um subconjunto

Como jogar todas as combinações é caro, um recurso comum é gerar todas (até o limite) e **sortear** um subconjunto — por exemplo, "me dê 10 jogos aleatórios entre todas as combinações das minhas dezenas":

```js
export function selecionarAleatorias(combinacoes, quantidade) {
  const indices = new Set();
  while (indices.size < Math.min(quantidade, combinacoes.length)) {
    indices.add(Math.floor(Math.random() * combinacoes.length));
  }
  return [...indices].map((i) => combinacoes[i]);
}
```

Isso já é útil, mas é "burro" — os jogos sorteados podem se sobrepor mal, desperdiçando cobertura. A forma **inteligente** de reduzir jogos mantendo garantia de prêmio é o **fechamento** — e é um problema muito mais interessante, o assunto do próximo capítulo.

<div class="callout importante" markdown="1">
<span class="rot">Importante — a lógica pura mora no service</span>
Todo este capítulo é `services/loterias/combinacoes.js` — JavaScript puro, sem React. A tela apenas chama `gerarCombinacoes(...)` e mostra o resultado. Isso torna a matemática testável (você verifica que C(8,6) dá exatamente 28) e reutilizável (a mesma função serve à tela de combinações e ao fechamento). Separar o cálculo da apresentação é o que mantém algoritmos complexos sob controle — e é a lição que se aplica a qualquer app com lógica pesada.
</div>

Você domina as combinações. Agora o algoritmo estrela: o fechamento, que joga poucos jogos com garantia matemática.
