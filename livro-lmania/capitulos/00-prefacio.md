<h1 class="cap">Prefácio — React do zero, construindo uma ferramenta de verdade</h1>

Aprende-se a programar construindo. Neste livro, você vai construir do zero uma aplicação real e sofisticada — uma **ferramenta de loterias** — e, no caminho, aprender React dos fundamentos aos temas avançados. Ao fim, você terá um app que funciona **offline**, gera jogos, calcula **fechamentos matemáticos**, confere resultados e mostra estatísticas — e, mais importante, o entendimento para construir qualquer aplicação web moderna.

## Por que uma ferramenta de loterias

Porque ela é rica o suficiente para ensinar React inteiro. Um app de loterias precisa de: interface interativa (a grade de dezenas), estado complexo (jogos selecionados), persistência que funciona sem internet (offline-first), consumo de API (resultados oficiais), gráficos (estatísticas), navegação com URLs amigáveis, temas, e — o mais interessante — **algoritmos de verdade** (combinações e fechamento). É um curso de React completo disfarçado de app útil.

## O que vamos construir

Um app chamado **LMania**, com quatro loterias (Lotofácil, Lotomania, Mega-Sena, Quina). As funcionalidades, todas passo a passo:

- **Gerar e salvar jogos**, escolhendo dezenas numa grade interativa.
- **Fechamentos matemáticos** (desdobramentos que reduzem o custo com garantia de prêmio).
- **Conferir** jogos contra o resultado oficial da Caixa.
- **Estatísticas** com gráficos (pares/ímpares, frequência de dezenas).
- **Funcionar offline** e ser instalável como app (PWA).
- **Blog** de conteúdo, temas claro/escuro, e um espaço para anúncios.

## Como o livro é organizado

O livro sobe uma escada, do básico ao avançado:

1. **Fundação** — SPA, Vite, e os pilares do React (componentes e estado).
2. **Arquitetura e estilo** — componentes reutilizáveis, CSS isolado, temas.
3. **As telas de loteria** — navegação, a grade de dezenas, salvar e listar jogos.
4. **Dados e persistência** — offline-first, buscar resultados, conferir, PWA.
5. **Os algoritmos** — combinações e o fechamento de loteria, explicados com diagramas.
6. **Conteúdo e publicação** — blog, anúncios, SEO e deploy.

<div class="callout nota" markdown="1">
<span class="rot">Como ler os boxes</span>
**Dica** (um atalho), **Cuidado** (uma armadilha comum), **Importante** (um princípio para decorar), **Nota** (aprofundamento) e **Na prática** (como aplicamos ao LMania).
</div>

## Pré-requisitos

Você precisa saber o básico de JavaScript (variáveis, funções, arrays, loops). Não precisa saber React — ensinamos do zero. Não precisa saber teoria de algoritmos — no Módulo 5, desenhamos o fechamento no papel antes de codificar. Quem começa do início e lê até o fim, reproduz tudo.

Vamos construir — e entender cada peça.
