<h1 class="cap"><span class="num">Capítulo 10</span> — Buscando resultados e conferindo jogos</h1>

## 10.1 A API de resultados oficiais

Para conferir jogos, precisamos do resultado oficial de um concurso. As loterias da Caixa têm uma API pública. Criamos um service que busca e — importante — **cacheia** o resultado, porque um concurso já sorteado é imutável (não muda nunca):

```js
// src/services/resultados.js
export async function buscarResultado(loteria, concurso) {
  const chave = `resultado-${loteria}-${concurso}`;
  const cache = localStorage.getItem(chave);
  if (cache) return JSON.parse(cache);        // já temos: instantâneo, sem rede

  const url = `https://servicebus2.caixa.gov.br/portaldeloterias/api/${loteria}/${concurso}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error('Concurso não encontrado.');
  const dados = await r.json();
  localStorage.setItem(chave, JSON.stringify(dados)); // guarda para sempre
  return dados;
}
```

<div class="callout dica" markdown="1">
<span class="rot">Dica — cache para dados imutáveis</span>
Um resultado de concurso passado nunca muda. Então buscá-lo **uma vez** e servir do cache depois é a estratégia perfeita: economiza rede, funciona offline (depois da primeira busca), e é instantâneo. A regra geral: dados que não mudam devem ser cacheados agressivamente; só dados que mudam (o próximo sorteio ainda não realizado) precisam ir à rede sempre.
</div>

<div class="callout cuidado" markdown="1">
<span class="rot">Cuidado — o CORS e APIs de terceiros</span>
A API da Caixa é de terceiros — o navegador pode bloquear a chamada por **CORS** (uma regra de segurança). Não é bug do seu código; quem libera é o servidor. Se acontecer em desenvolvimento, use o **proxy do Vite** (`server.proxy` no `vite.config.js`) para repassar a chamada. Em produção, pode ser necessário um pequeno proxy no seu próprio servidor. É uma dor de cabeça clássica de consumir APIs que você não controla.
</div>

## 10.2 Conferindo: comparar jogo com resultado

Conferir é lógica pura — um service que recebe um jogo e as dezenas sorteadas, e conta os acertos:

```js
// src/services/loterias/conferencia.js
export function conferir(jogo, dezenasSorteadas) {
  const sorteadas = new Set(dezenasSorteadas);
  const acertos = jogo.filter((n) => sorteadas.has(n));
  return { acertos: acertos.length, dezenasAcertadas: acertos };
}
```

Simples e testável: dado `[5, 12, 23, 34]` e sorteio `[5, 34, 40, ...]`, devolve 2 acertos. Nenhuma UI, nenhum React — só a regra.

## 10.3 A tela de conferência

A tela junta as peças: busca o resultado, confere cada jogo salvo, e mostra os acertos com destaque visual:

```jsx
// src/pages/Loteria/Conferir.jsx (essência)
const [concurso, setConcurso] = useState('');
const [resultado, setResultado] = useState(null);
const [carregando, setCarregando] = useState(false);
const [erro, setErro] = useState(null);

async function conferirTudo() {
  setCarregando(true); setErro(null);
  try {
    const r = await buscarResultado(config.url, concurso);
    setResultado(r);
  } catch (e) {
    setErro(e.message);
  } finally {
    setCarregando(false);
  }
}

// ao ter o resultado, confere cada jogo salvo:
const jogos = listarJogos(config.url);
const conferidos = resultado
  ? jogos.map((jogo) => ({ jogo, ...conferir(jogo, resultado.dezenas) }))
  : [];
```

E a renderização trata os quatro estados (o quarteto de sempre): carregando, erro, sem resultado ainda, e conferidos — mostrando cada jogo com suas dezenas acertadas em destaque.

<div class="callout importante" markdown="1">
<span class="rot">Importante — a lógica separada da tela</span>
Note a divisão: `buscarResultado` e `conferir` são services **puros** (sem React); a tela só os orquestra e desenha o resultado. Isso permite testar a conferência de forma isolada — você garante que "jogo com 4 das 6 dezenas certas = 4 acertos" sem montar tela nenhuma. Quando a lógica é pura e a tela é fina, o app fica confiável e fácil de evoluir. É a arquitetura em camadas, de novo, pagando dividendos.
</div>

O app já busca resultados e confere jogos. Falta a promessa do "offline-first": funcionar sem internet e ser instalável. É o PWA — o próximo capítulo.
