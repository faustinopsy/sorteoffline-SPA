<h1 class="mod">Módulo 1 — A Fundação</h1>

Todo prédio precisa de alicerce. Aqui você entende o que é uma aplicação moderna (uma SPA, e um PWA), monta o ambiente com o Vite, e aprende os dois pilares do React: **componentes** (as peças da tela) e **estado** (a memória que a faz viver). Ao fim, você terá o esqueleto do LMania rodando no navegador.

<h1 class="cap"><span class="num">Capítulo 1</span> — SPA, PWA e o modelo do React</h1>

## 1.1 De páginas a aplicativos

No passado, um site era um monte de páginas HTML: clicou num link, a tela ficou branca, o navegador baixou outra página. Para uma ferramenta interativa — onde você seleciona dezenas, gera jogos, confere resultados sem esperar a tela recarregar — isso não serve.

Hoje construímos **SPAs** (aplicações de página única): o navegador carrega o app uma vez e, a partir daí, a tela muda sozinha em resposta às ações, sem recarregar. E vamos além: o LMania será um **PWA** (*Progressive Web App*) — instalável na tela inicial do celular, com ícone próprio, e funcionando **offline**. O usuário nem vai perceber que é um site.

## 1.2 O modelo mental do React

O **React** constrói interfaces com uma ideia central que guia o livro inteiro:

> **Você não manda a tela mudar. Você muda os dados, e a tela se atualiza sozinha.**

É a programação **declarativa**. No JavaScript tradicional, você daria ordens passo a passo: "pegue esta bolinha, pinte de laranja, adicione à grade". No React, você **descreve** como a tela deve ser para um estado (ex.: "as dezenas selecionadas ficam laranja") e o React aplica as diferenças quando o estado muda. Numa grade de 60 dezenas que o usuário clica sem parar, essa inversão é o que evita o caos.

<div class="fig">
<svg viewBox="0 0 540 110" xmlns="http://www.w3.org/2000/svg" font-family="Arial">
  <rect x="20" y="30" width="140" height="50" rx="8" fill="#eaf1fb" stroke="#2563eb"/><text x="90" y="52" text-anchor="middle" font-size="10" font-weight="bold">DADOS</text><text x="90" y="68" text-anchor="middle" font-size="8" fill="#55617a">dezenas selecionadas</text>
  <path d="M162 55 L240 55" stroke="#9aa6bd" stroke-width="2" marker-end="url(#a)"/><text x="201" y="46" text-anchor="middle" font-size="8.5" fill="#0b7a43">React</text>
  <rect x="245" y="30" width="140" height="50" rx="8" fill="#eafaf1" stroke="#0f9d58"/><text x="315" y="52" text-anchor="middle" font-size="10" font-weight="bold">GRADE NA TELA</text><text x="315" y="68" text-anchor="middle" font-size="8" fill="#55617a">bolinhas laranja</text>
  <text x="450" y="60" font-size="9" fill="#55617a">clicou numa<tspan x="450" dy="12">dezena? a tela</tspan><tspan x="450" dy="12">reage.</tspan></text>
  <defs><marker id="a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa6bd"/></marker></defs>
</svg>
<div class="leg">Figura 1.1 — No React, a grade de dezenas é um reflexo do estado "dezenas selecionadas". Você muda o estado; a grade reage.</div>
</div>

## 1.3 Componentes: a tela em peças

O React organiza a interface em **componentes** reutilizáveis. No LMania teremos: uma `Bola` (a bolinha de uma dezena), uma `GradeDezenas`, um `CardLoteria`, uma barra de navegação, um painel de resultados. Em vez de uma página gigante de HTML, montamos a tela encaixando componentes — como peças de Lego. Precisou da mesma bolinha em três telas? É o mesmo componente. Mudou o visual dela? Muda num lugar só.

## 1.4 O que você vai precisar

- **Node.js** (versão LTS) — roda as ferramentas.
- **VS Code** — o editor (gratuito).
- **Um navegador** — para ver e depurar.
- **Vontade de digitar o código** — digitar fixa o aprendizado; não copie tudo.

<div class="callout importante" markdown="1">
<span class="rot">Importante — grave o modelo mental antes da sintaxe</span>
Antes de qualquer comando, grave: no React, a **fonte da verdade** são os dados (o estado), não a tela. A tela reflete os dados. Se algo precisa mudar na tela, você muda o dado — nunca "manda a tela mudar" como no JavaScript antigo. Quase todo erro de iniciante vem de esquecer isso. No LMania, "quais dezenas estão selecionadas" será um estado, e a grade colorida será apenas o reflexo dele.
</div>

No próximo capítulo, montamos o ambiente com o Vite e vemos o esqueleto do LMania nascer.
