<h1 class="cap"><span class="num">Capítulo 8</span> — Listando e removendo jogos</h1>

## 8.1 A tela de jogos salvos

Salvar sem conseguir ver não serve. A tela de lista mostra os jogos guardados de uma loteria, com a opção de remover. Ela lê os jogos no estado (via o service de storage, que aprofundamos no próximo módulo) e os desenha:

```jsx
// src/pages/Loteria/ListaJogos.jsx
import { useState } from 'react';
import { listarJogos, removerJogo } from '../../services/storage';
import Bola from '../../components/atoms/Bola/Bola';

export default function ListaJogos({ config }) {
  const [jogos, setJogos] = useState(() => listarJogos(config.url)); // lê 1x na inicialização

  function remover(indice) {
    removerJogo(config.url, indice);           // persiste a remoção
    setJogos(listarJogos(config.url));         // atualiza o estado → a tela reage
  }

  if (jogos.length === 0) return <p>Nenhum jogo salvo ainda.</p>;

  return (
    <ul className="lista-jogos">
      {jogos.map((jogo, i) => (
        <li key={i} className="jogo">
          <div className="dezenas">
            {jogo.map((n) => <Bola key={n} numero={n} selecionada />)}
          </div>
          <button onClick={() => remover(i)} aria-label="Remover jogo">🗑</button>
        </li>
      ))}
    </ul>
  );
}
```

## 8.2 Reaproveitando a `Bola`

Note que reusamos o átomo `Bola` (do Módulo 2) para mostrar as dezenas de cada jogo salvo — a mesma peça da grade de seleção, agora só para exibir. É a vantagem do Atomic Design: uma peça bem feita serve a vários contextos. A `Bola` não sabe se está numa grade de seleção ou numa lista de jogos; ela só desenha um número.

## 8.3 O padrão "mudar o dado, a tela reage"

Ao remover um jogo, fazemos duas coisas: persistir a remoção (`removerJogo`) e **atualizar o estado** (`setJogos(...)`). É a atualização do estado que faz a lista redesenhar sem o item. Compare com o app vanilla original, que removia o `<li>` do DOM na mão e ainda tinha que "reindexar" os itens guardados — uma lógica frágil e cheia de bugs. Em React, você muda o dado, e o React cuida da tela.

<div class="callout importante" markdown="1">
<span class="rot">Importante — a `key` numa lista que muda</span>
Aqui usamos `key={i}` (o índice) por simplicidade, mas com uma ressalva: como esta lista **pode ser reordenada** ao remover um item, o ideal seria dar a cada jogo um id único ao salvá-lo (ex.: um timestamp) e usar esse id como key. Índice como key é aceitável em listas que só crescem no fim, mas em listas que removem do meio, ele pode causar bugs visuais (o React reaproveita o componente errado). Ao evoluir o app, dê ids aos jogos — é o jeito certo.
</div>

## 8.4 Excluir todos

Um botão para limpar tudo, com confirmação (para não apagar por engano):

```jsx
import { excluirTodos } from '../../services/storage';

function limparTudo() {
  if (!confirm('Remover TODOS os jogos desta loteria?')) return;
  excluirTodos(config.url);
  setJogos([]);
}
```

<div class="callout cuidado" markdown="1">
<span class="rot">Cuidado — ações destrutivas pedem confirmação</span>
"Excluir todos" apaga dados do usuário para sempre. Sempre confirme antes de ações irreversíveis — um simples `confirm()` do navegador já evita a tragédia de um clique acidental limpar horas de jogos montados. Para um app mais polido, um modal customizado é melhor que o `confirm()` nativo, mas o princípio é o mesmo: dê ao usuário uma chance de recuar antes do irreversível.
</div>

## 8.5 Fecho do módulo

O fluxo central está completo: o usuário navega até uma loteria, monta jogos numa grade interativa, salva, lista e remove. O LMania já é útil. Mas os jogos ainda precisam **sobreviver** ao fechar o navegador, e o app precisa funcionar **sem internet** — é a persistência offline, o coração do próximo módulo. E é lá que os jogos que "salvamos" ganham um lar de verdade.
