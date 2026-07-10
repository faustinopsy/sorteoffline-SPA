<h1 class="cap"><span class="num">Capítulo 3</span> — JSX e estado: a grade de dezenas ganha vida</h1>

## 3.1 JSX: descrevendo a interface

O React usa **JSX** — uma sintaxe parecida com HTML, dentro do JavaScript, que descreve a tela. Três regras evitam os erros mais comuns: um componente retorna **uma** raiz (use `<>...</>` para agrupar); usa-se `className` em vez de `class`; e eventos em camelCase (`onClick`). O poder está em misturar JavaScript com **chaves `{}`** — inclusive gerar listas com `.map()`:

```jsx
// gerar as bolinhas de 1 até max
{Array.from({ length: 60 }, (_, i) => i + 1).map((numero) => (
  <button key={numero} className="bola">{numero}</button>
))}
```

Esse trecho já é o esqueleto da grade da Mega-Sena: 60 botões numerados, gerados por um `.map()`. Repare na prop `key={numero}` — obrigatória em listas, ela dá a cada item um identificador estável para o React.

## 3.2 `useState`: a memória da seleção

A grade precisa lembrar **quais dezenas o usuário selecionou**. Essa memória é o **estado**, criado com `useState`. Para um conjunto de dezenas, um `Set` é perfeito (não repete, e testa "contém?" rápido):

```jsx
import { useState } from 'react';

function GradeDezenas({ max }) {
  const [selecionadas, setSelecionadas] = useState(new Set());

  function alternar(numero) {
    setSelecionadas((atual) => {
      const nova = new Set(atual);          // cria um Set NOVO (imutabilidade!)
      nova.has(numero) ? nova.delete(numero) : nova.add(numero);
      return nova;
    });
  }

  return (
    <div className="grade">
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          className={selecionadas.has(n) ? 'bola selecionada' : 'bola'}
          onClick={() => alternar(n)}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
```

Clique numa bolinha: `alternar` cria um `Set` novo, adiciona ou remove o número, e chama `setSelecionadas`. O React re-renderiza, e a bolinha ganha (ou perde) a classe `selecionada`. Você não pintou nada na mão — descreveu "selecionada fica laranja" no CSS, e mudou o dado.

<div class="callout importante" markdown="1">
<span class="rot">Importante — por que criar um `Set` novo</span>
Repare que criamos `new Set(atual)` em vez de mexer no `Set` existente. O React decide se atualiza a tela comparando **referências**: se você mudasse o mesmo `Set`, a referência seria a mesma, e o React pensaria "nada mudou". Criar uma cópia nova é o que faz a tela reagir. Vale para `Set`, arrays (`[...arr]`) e objetos (`{...obj}`): sempre uma caixa nova. Esse é o erro nº 1 de quem começa — grave-o.
</div>

## 3.3 O estado deriva a interface inteira

Com o estado `selecionadas`, tudo na tela deriva dele — sem código extra:

```jsx
const quantas = selecionadas.size;                       // "6 de 6 escolhidas"
const completo = quantas === sorteia;                    // habilita o botão salvar
const podeSalvar = quantas >= escolhe;

<p>{quantas} de {sorteia} dezenas</p>
<Botao texto="Salvar jogo" desabilitado={!podeSalvar} />
```

O contador, o aviso, o botão habilitado — tudo é calculado a partir do estado, a cada render. Você nunca sincroniza "na mão" o contador com a grade: os dois vêm da mesma fonte, então nunca divergem. É a beleza do modelo declarativo.

## 3.4 `useEffect`: o mundo de fora

O `useState` cuida do que está dentro do componente. Para o que está fora — buscar dados, ler o storage, ligar um timer — usamos o `useEffect`, com um array de dependências que controla quando ele roda (`[]` = uma vez, na montagem). Vamos usá-lo muito nos módulos de dados. Por ora, guarde a forma:

```jsx
useEffect(() => {
  // roda depois da tela aparecer
  return () => { /* limpeza, quando a tela sai */ };
}, [dependencias]);
```

<div class="callout dica" markdown="1">
<span class="rot">Dica — o `Set` para seleção é uma boa escolha</span>
Usar um `Set` (em vez de um array) para as dezenas selecionadas tem duas vantagens: testar "está selecionada?" é instantâneo (`selecionadas.has(n)`), e não há risco de duplicar uma dezena. Ao salvar o jogo, converta para array ordenado: `[...selecionadas].sort((a,b) => a-b)`. Escolher a estrutura de dados certa deixa o código mais limpo — um hábito que vamos cultivar no livro inteiro, até os algoritmos do Módulo 5.
</div>

Você já tem a grade interativa — o coração visual do LMania. No próximo módulo, organizamos isso em componentes reutilizáveis e damos ao app estilo e temas.
