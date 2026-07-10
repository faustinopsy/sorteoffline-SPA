<h1 class="cap"><span class="num">Capítulo 14</span> — Estatísticas e gráficos</h1>

## 14.1 Transformando dados em insight

Números crus dizem pouco; um gráfico diz muito. A ferramenta mostra estatísticas dos jogos e dos resultados — quantas dezenas pares vs. ímpares, quais dezenas saem mais. Primeiro, o cálculo (service puro); depois, a visualização (componente).

## 14.2 O cálculo: pares e ímpares

Uma estatística simples e popular: a distribuição de dezenas pares e ímpares num jogo ou num conjunto de resultados. Lógica pura:

```js
// src/services/loterias/estatisticas.js
export function contarParesImpares(dezenas) {
  let pares = 0, impares = 0;
  for (const n of dezenas) (n % 2 === 0 ? pares++ : impares++);
  return { pares, impares };
}

// frequência de cada dezena num histórico de resultados
export function frequenciaDezenas(historicoDeSorteios) {
  const freq = {};
  for (const sorteio of historicoDeSorteios) {
    for (const n of sorteio) freq[n] = (freq[n] ?? 0) + 1;
  }
  return freq; // { 5: 12, 23: 9, ... }
}
```

## 14.3 A biblioteca de gráficos

Em vez de desenhar gráficos na mão, usamos uma biblioteca pronta e amigável ao React. Uma boa escolha é o **recharts** (`npm install recharts`), que oferece componentes de gráfico declarativos:

```jsx
// src/components/organisms/GraficoParesImpares/GraficoParesImpares.jsx
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { contarParesImpares } from '../../../services/loterias/estatisticas';

export default function GraficoParesImpares({ dezenas }) {
  const { pares, impares } = contarParesImpares(dezenas);
  const dados = [
    { nome: 'Pares', valor: pares },
    { nome: 'Ímpares', valor: impares },
  ];
  const cores = ['#3b82f6', '#f97316'];

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={dados} dataKey="valor" nameKey="nome" outerRadius={90} label>
          {dados.map((_, i) => <Cell key={i} fill={cores[i]} />)}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
```

Repare no padrão familiar: o **service puro** calcula (`contarParesImpares`), e o **componente** apenas visualiza. O gráfico é declarativo — você descreve os dados e as cores, e a biblioteca desenha. É o modelo React aplicado a gráficos.

<div class="callout dica" markdown="1">
<span class="rot">Dica — biblioteca declarativa combina com React</span>
Bibliotecas como o recharts são "declarativas": você passa os dados como props e ela desenha, reagindo a mudanças. Isso combina com o React — quando os dados mudam, o gráfico se atualiza sozinho, como qualquer componente. Compare com bibliotecas imperativas (como o Chart.js puro, do app original), onde você cria o gráfico e o atualiza na mão, com cuidado para não vazar memória. Ao usar React, prefira bibliotecas que abraçam o modelo declarativo.
</div>

## 14.4 O `ResponsiveContainer`

Note o `<ResponsiveContainer>` envolvendo o gráfico. Ele faz o gráfico se adaptar ao tamanho da tela — essencial num app que roda no celular e no desktop. É o mesmo espírito de responsividade que aplicamos ao layout: um código, várias telas.

<div class="callout importante" markdown="1">
<span class="rot">Importante — o padrão que se repetiu o livro inteiro</span>
Pela última vez, note a divisão: o cálculo (`estatisticas.js`) é puro e testável; o componente (`GraficoParesImpares`) só visualiza. Esse padrão — **lógica no service, apresentação no componente** — apareceu em cada módulo: nos jogos, na conferência, no fechamento, e agora nos gráficos. Não é coincidência: é a arquitetura que torna o app inteiro compreensível, testável e evoluível. Se você levar uma lição deste livro, que seja esta.
</div>

## 14.5 Fecho do módulo

Você deu inteligência à ferramenta: combinações, fechamento matemático e estatísticas visuais — tudo com lógica pura nos services e apresentação nos componentes. O LMania agora é uma ferramenta completa e poderosa. Falta o acabamento de um produto público: conteúdo (blog), monetização (anúncios), SEO e publicação. É o **Módulo 6**, o final.
