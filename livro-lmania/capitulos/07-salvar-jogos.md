<h1 class="cap"><span class="num">Capítulo 7</span> — Montando e salvando jogos</h1>

## 7.1 A tela de loteria

Juntamos as peças: a grade de dezenas (Módulo 1), a config (Módulo 2) e o estado da seleção. A `TelaLoteria` é parametrizada pela config, então serve às quatro loterias:

```jsx
// src/pages/Loteria/TelaLoteria.jsx
import { useState } from 'react';
import Bola from '../../components/atoms/Bola/Bola';
import Botao from '../../components/atoms/Botao/Botao';
import { salvarJogo } from '../../services/storage';
import { useSeo } from '../../hooks/useSeo';
import toast from 'react-hot-toast';

export default function TelaLoteria({ config }) {
  useSeo(`${config.nome} | LMania`, `Monte e salve seus jogos da ${config.nome}.`);
  const [selecionadas, setSelecionadas] = useState(new Set());

  function alternar(n) {
    setSelecionadas((atual) => {
      const nova = new Set(atual);
      if (nova.has(n)) nova.delete(n);
      else if (nova.size < config.sorteia) nova.add(n);   // trava no máximo
      else toast('Você já escolheu o máximo de dezenas.');
      return nova;
    });
  }

  function salvar() {
    const dezenas = [...selecionadas].sort((a, b) => a - b);
    salvarJogo(config.url, dezenas);       // persiste (Módulo 4)
    toast.success('Jogo salvo!');
    setSelecionadas(new Set());            // limpa para o próximo
  }

  const podeSalvar = selecionadas.size >= config.escolhe;

  return (
    <div>
      <h2 style={{ color: config.accent }}>{config.nome}</h2>
      <p>{selecionadas.size} de {config.sorteia} dezenas</p>
      <div className="grade">
        {Array.from({ length: config.max }, (_, i) => i + 1).map((n) => (
          <Bola key={n} numero={n} selecionada={selecionadas.has(n)} aoClicar={alternar} />
        ))}
      </div>
      <Botao texto="Salvar jogo" aoClicar={salvar} desabilitado={!podeSalvar} />
    </div>
  );
}
```

## 7.2 As regras de negócio no lugar certo

Repare em duas regras que aparecem naturalmente:

- **O máximo de dezenas** (`nova.size < config.sorteia`): não deixa escolher mais que o permitido, com um aviso amigável.
- **O mínimo para salvar** (`podeSalvar = size >= config.escolhe`): o botão só habilita quando há dezenas suficientes.

Ambas derivam do **estado** e da **config** — nada é sincronizado à mão. O contador, o botão, a trava: todos calculados a cada render, a partir da mesma fonte. É o modelo declarativo eliminando bugs de sincronia.

<div class="callout importante" markdown="1">
<span class="rot">Importante — a tela orquestra, o service persiste</span>
A tela chama `salvarJogo(config.url, dezenas)` — uma função do service — e não sabe **como** o jogo é salvo (localStorage? banco? nuvem?). Essa separação é deliberada: a interface cuida da experiência, o service cuida da persistência. Se um dia você trocar o localStorage por sincronização na nuvem, muda só o service; a tela nem percebe. É a arquitetura em camadas pagando dividendos.
</div>

## 7.3 Gerar um jogo aleatório

Um recurso útil: um botão "surpresinha" que preenche dezenas aleatórias. Lógica pura, num service:

```js
// src/services/loterias/gerador.js
export function jogoAleatorio(config) {
  const dezenas = new Set();
  while (dezenas.size < config.sorteia) {
    dezenas.add(1 + Math.floor(Math.random() * config.max));
  }
  return new Set(dezenas);
}
// na tela: <Botao texto="Surpresinha" aoClicar={() => setSelecionadas(jogoAleatorio(config))} />
```

<div class="callout dica" markdown="1">
<span class="rot">Dica — lógica pura fora do componente</span>
Repare que `jogoAleatorio` está num service, não dentro do componente. Poderia estar inline, mas separá-lo tem valor: fica testável (você verifica que ele sempre gera a quantidade certa de dezenas únicas), reutilizável, e mantém a tela focada em orquestrar. É a mesma disciplina que, no Módulo 5, vai deixar os algoritmos de fechamento — muito mais complexos — organizados e testáveis.
</div>

O usuário monta e salva jogos. Mas para onde eles vão, e como listá-los? É a persistência — mas antes, o capítulo que fecha o fluxo básico: listar e remover os jogos salvos.
