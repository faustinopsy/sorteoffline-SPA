<h1 class="cap"><span class="num">Capítulo 13</span> — Fechamento: jogar poucos com garantia</h1>

## 13.1 O dilema do custo

Jogar todas as combinações das suas dezenas garante o prêmio se elas saírem — mas é caro. Com 8 dezenas na Mega, são 28 jogos (R$ 168). Com 15, são 5005 jogos (R$ 30.030). Impraticável.

O **fechamento** (ou desdobramento) resolve o dilema: em vez de jogar *todas* as combinações, jogar um **subconjunto inteligente** que ainda **garante** certo prêmio se um número de dezenas for acertado. Por exemplo: "com minhas 15 dezenas, quero jogar só 30 jogos, mas de forma que, se 4 das minhas 15 saírem, eu tenha garantidamente pelo menos uma quadra".

<div class="fig">
<svg viewBox="0 0 540 120" xmlns="http://www.w3.org/2000/svg" font-family="Arial">
  <rect x="20" y="35" width="150" height="55" rx="10" fill="#fdecec" stroke="#e53935"/>
  <text x="95" y="60" text-anchor="middle" font-size="10" fill="#c62828" font-weight="bold">TODAS</text>
  <text x="95" y="78" text-anchor="middle" font-size="9" fill="#c62828">5005 jogos</text>
  <text x="235" y="68" font-size="22" fill="#9aa6bd">→</text>
  <rect x="285" y="35" width="160" height="55" rx="10" fill="#eafaf1" stroke="#0f9d58"/>
  <text x="365" y="60" text-anchor="middle" font-size="10" fill="#0b7a43" font-weight="bold">FECHAMENTO</text>
  <text x="365" y="78" text-anchor="middle" font-size="9" fill="#0b7a43">30 jogos, com garantia</text>
  <text x="475" y="65" font-size="8.5" fill="#55617a">mesma garantia,<tspan x="475" dy="12">fração do custo</tspan></text>
</svg>
<div class="leg">Figura 13.1 — O fechamento troca "jogar tudo" por "jogar poucos, com garantia matemática". É o coração da ferramenta.</div>
</div>

## 13.2 O que é a "garantia" — problemas de cobertura

Matematicamente, um fechamento é um **problema de cobertura**. Pense assim: cada jogo de 6 dezenas "cobre" todas as quadras (grupos de 4) que estão dentro dele. Queremos escolher **poucos** jogos que, juntos, **cubram todas** as quadras possíveis das nossas dezenas. Porque se qualquer quadra sair, algum dos nossos jogos a contém — e o prêmio da quadra está garantido.

<div class="fig">
<svg viewBox="0 0 540 140" xmlns="http://www.w3.org/2000/svg" font-family="Arial">
  <text x="270" y="20" text-anchor="middle" font-size="10" fill="#22344d" font-weight="bold">Cada jogo cobre várias quadras; queremos cobrir TODAS com poucos jogos</text>
  <g font-size="8" fill="#fff" text-anchor="middle">
    <rect x="40" y="40" width="130" height="26" rx="6" fill="#3b82f6"/><text x="105" y="57">jogo A cobre: 4 quadras</text>
    <rect x="40" y="74" width="130" height="26" rx="6" fill="#3b82f6"/><text x="105" y="91">jogo B cobre: 4 quadras</text>
  </g>
  <g font-size="7.5" fill="#22344d">
    <circle cx="240" cy="45" r="9" fill="#dbeafe" stroke="#3b82f6"/><circle cx="265" cy="45" r="9" fill="#dbeafe" stroke="#3b82f6"/>
    <circle cx="290" cy="45" r="9" fill="#dbeafe" stroke="#3b82f6"/><circle cx="315" cy="45" r="9" fill="#dbeafe" stroke="#3b82f6"/>
    <circle cx="240" cy="80" r="9" fill="#dcfce7" stroke="#22c55e"/><circle cx="265" cy="80" r="9" fill="#dcfce7" stroke="#22c55e"/>
    <circle cx="290" cy="80" r="9" fill="#dcfce7" stroke="#22c55e"/><circle cx="315" cy="80" r="9" fill="#fef9c3" stroke="#eab308"/>
  </g>
  <text x="360" y="65" font-size="8.5" fill="#55617a">todas as quadras<tspan x="360" dy="12">possíveis precisam</tspan><tspan x="360" dy="12">estar em algum jogo</tspan></text>
</svg>
<div class="leg">Figura 13.2 — Fechamento é cobrir todas as quadras possíveis com o menor número de jogos. Achar o mínimo é um problema difícil.</div>
</div>

## 13.3 Por que não calcular na hora — a decisão de engenharia

Achar o **menor** conjunto que cobre tudo é um problema **NP-difícil**: não existe fórmula rápida para o ótimo, e calcular na hora, para muitas dezenas, travaria o navegador. Por isso a ferramenta **não calcula o fechamento em tempo real**. Ela usa **coberturas pré-calculadas** — tabelas geradas antes (por um algoritmo guloso, *greedy*, que monta uma solução boa, próxima do mínimo) e guardadas como dado.

```js
// src/services/loterias/coberturas.js  → SÓ DADOS (a tabela pré-calculada)
// mapa: "quantasDezenas_garantia" → lista de "padrões" (índices de dezenas por jogo)
export const COBERTURAS = {
  '8_4': [[0,1,2,3,4,5], [0,1,2,3,6,7], /* ...os padrões... */],
  // ...uma entrada por combinação (nº de dezenas, garantia)
};
```

<div class="callout importante" markdown="1">
<span class="rot">Importante — a decisão a preservar</span>
Este é o ponto mais importante do capítulo. O fechamento **não é calculado ao vivo** — ele consulta tabelas prontas. É uma decisão consciente de engenharia: o cálculo ótimo é NP-difícil e travaria a tela. A arquitetura correta é: as **coberturas** viram um asset de dados (`coberturas.js`), e a **lógica de fechar** vira um service puro que aplica a tabela às dezenas do usuário. Nunca tente "melhorar" recalculando na hora — você quebraria a performance. Às vezes, a decisão mais inteligente é **não calcular**.
</div>

## 13.4 Aplicando a tabela: o service de fechamento

A lógica de fechar é simples, porque o trabalho pesado já foi feito na tabela. O service pega os "padrões" (que são índices) e os aplica às dezenas reais que o usuário escolheu:

```js
// src/services/loterias/fechamento.js — puro
import { COBERTURAS } from './coberturas';

export function fechar(dezenasEscolhidas, garantia) {
  const chave = `${dezenasEscolhidas.length}_${garantia}`;
  const padroes = COBERTURAS[chave];
  if (!padroes) return null;   // não há cobertura para essa combinação
  // cada padrão é uma lista de índices; troca índice pela dezena real
  return padroes.map((indices) => indices.map((i) => dezenasEscolhidas[i]));
}
// fechar([5,12,23,34,41,52,7,18], 4) → poucos jogos que garantem a quadra
```

## 13.5 A tela de fechamento

O organismo React só cuida da interface — a grade de seleção, a escolha da garantia, e a exibição dos jogos gerados — chamando o service:

```jsx
// components/organisms/Fechar/Fechar.jsx (essência)
const [dezenas, setDezenas] = useState(new Set());
const [garantia, setGarantia] = useState(4);
const [jogos, setJogos] = useState([]);

function gerar() {
  const resultado = fechar([...dezenas].sort((a,b)=>a-b), garantia);
  if (resultado) setJogos(resultado);
  else toast.error('Sem cobertura para essa combinação de dezenas e garantia.');
}
```

<div class="callout dica" markdown="1">
<span class="rot">Dica — se um dia precisar calcular ao vivo, use um Worker</span>
Para os casos das tabelas, o cálculo é instantâneo (só aplicar índices). Mas se você quisesse gerar coberturas na hora (para combinações não tabeladas), aí sim o trabalho seria pesado — e você o moveria para um **Web Worker**: uma thread paralela que calcula sem congelar a tela. Como o `fechar` é um service puro, chamá-lo de dentro de um worker é trivial, sem tocar na UI. É a recompensa, mais uma vez, de manter a lógica separada da interface.
</div>

## 13.6 Fecho do módulo... quase

Você entendeu e implementou os dois algoritmos que dão inteligência à ferramenta: combinações (a base) e fechamento (a otimização com garantia). Falta um toque que transforma dados em insight visual: as **estatísticas com gráficos** — o próximo e último capítulo do módulo.
