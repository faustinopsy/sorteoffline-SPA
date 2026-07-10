# Especificação Técnica — App "LMania" (Loterias) em React

> **Para o agente construtor (IA):** este documento é **exclusivo do projeto LMania**
> (origem: `E:\sorteoffline-SPA`, SPA vanilla, offline-first, PWA). É autossuficiente —
> você **não** precisa de nenhum outro documento. Construa exatamente o que está aqui.
>
> **Meta:** preservar **100%** das funcionalidades, com código **SOLID**, **arquivos
> pequenos** (responsabilidade única) e **máximo reaproveitamento**. Este app é grande
> (~5000 linhas no original) — a disciplina de arquivos pequenos é o que o torna gerenciável.

---

## 1. O que o LMania faz (funcionalidades a preservar)

Ferramenta matemática de loterias, offline-first e instalável (PWA). Quatro loterias.
Por loteria: **Cadastrar** jogos (grade de dezenas), **Listar** jogos salvos,
**Conferir** contra o resultado oficial da Caixa, **Combinar**, **Fechar**
(desdobramento matemático), **Gráfico Pares/Ímpares**, **Analisar**. Além disso:
**Home** (grade de ferramentas), **Blog** (+ posts), **Configurações** (tema/fonte),
páginas estáticas (**Sobre, Políticas, Privacidade, Contato**), **PWA/instalação**,
**SEO por rota**, e um **espaço de anúncios** padronizado (novo — §8).

**Config das loterias (replicar exatamente):**

```js
// services/loterias/config.js
export const LOTERIAS = [
  { nome:'Lotofácil', url:'lotofacil', simb:'facil', max:25,  min:15, sorteia:15, fechMin:16, gMin:11, preco:3.50, accent:'#a855f7' },
  { nome:'Lotomania',url:'lotomania', simb:'mania', max:100, min:50, sorteia:20, fechMin:55, gMin:16, preco:3.00, accent:'#ef4444' },
  { nome:'Mega-Sena',url:'mega-sena', simb:'mega',  max:60,  min:6,  sorteia:6,  fechMin:7,  gMin:4,  preco:6.00, accent:'#22c55e' },
  { nome:'Quina',    url:'quina',     simb:'quina', max:80,  min:5,  sorteia:5,  fechMin:6,  gMin:2,  preco:1.50, accent:'#3b82f6' },
];
```

**Fontes externas:** resultados da Caixa em
`https://servicebus2.caixa.gov.br/portaldeloterias/api/<loteria>/<concurso>`
(cachear em localStorage); blog em `api.lmania.com.br` (configurável por env).

---

## 2. Stack

| Item | Escolha |
|---|---|
| Base | **React 19** (function components + hooks; classe só no ErrorBoundary) |
| Build | **Vite** (`npm create vite@latest lmania-react -- --template react`) |
| Rotas | **react-router-dom v6+** (`BrowserRouter` — URLs reais + SEO) |
| Estilo | **CSS Modules** + tokens em `:root` |
| Estado global | **Context API** (tema, config) |
| Gráficos | **recharts** (substitui Chart.js vanilla) |
| Notificações/modais | **react-hot-toast** + componente `Modal` próprio (substitui SweetAlert2) |
| PWA/offline | **vite-plugin-pwa** (substitui o `sw.js` manual) |
| SEO por rota | hook `useSeo` (title + meta) ou react-helmet-async |
| **Remover** | **jQuery** (100%), SweetAlert2, Chart.js vanilla |

---

## 3. Princípios SOLID (obrigatórios)

- **S — Responsabilidade Única.** Um arquivo, uma coisa. **Regra: nenhum arquivo
  passa de ~100 linhas.** Os algoritmos (fechamento, combinações) são a maior
  tentação de arquivo gigante — quebre-os em funções pequenas em módulos separados.
- **O — Aberto/Fechado.** Uma **tela de loteria parametrizada** pela config serve
  às 4 loterias; adicionar uma 5ª é uma linha na config, sem novos componentes.
- **L — Substituição de Liskov.** Componentes com o mesmo contrato são trocáveis
  (ex.: a `Bola` serve à grade de seleção e à exibição de jogos salvos).
- **I — Segregação de Interface.** Cada componente recebe só o que usa (a `Bola`
  recebe `{numero, selecionada, aoClicar}`, não a config inteira da loteria).
- **D — Inversão de Dependência.** A UI depende de services/hooks/context, nunca de
  `fetch`/`localStorage`/algoritmo direto. A tela chama `fechar(dezenas, garantia)`;
  não conhece as tabelas de cobertura.

<br>

**Reaproveitamento máximo:**

1. **Atomic Design** rigoroso (átomos reusados em toda parte: `Bola`, `Botao`, `Badge`).
2. **Toda a matemática em `services/loterias/`** — pura, testável, sem React.
3. **Uma tela de loteria parametrizada** (não 4 telas). O mesmo para Cadastrar/Listar/Conferir/etc.
4. **Tokens CSS** para tudo (cores/espaços/tema). `accent` da loteria via `style={{'--cor':accent}}`.
5. **Hooks** para lógica repetível (storage, requisição, media query, install prompt).

---

## 4. Estrutura de pastas e inventário de arquivos

```text
src/
├── styles/
│   └── tokens.css                  # :root (cores, espaços, tema) + reset
├── services/
│   ├── http.js                     # fetch com timeout + erro (Dependency Inversion)
│   ├── storage.js                  # jogos por loteria: listar/salvar/remover/excluirTodos/migrar
│   ├── resultados.js               # buscarResultado(loteria,concurso) c/ cache localStorage
│   ├── blog.js                     # listarPosts(), buscarPost(slug)
│   ├── temas.js                    # TEMAS {}, TEMA_PADRAO
│   └── loterias/
│       ├── config.js               # LOTERIAS[] (§1)
│       ├── gerador.js              # jogoAleatorio(config)
│       ├── combinacoes.js          # gerarCombinacoes(dezenas,k,limite), selecionarAleatorias(...)
│       ├── coberturas.js           # DADOS: tabelas de cobertura pré-calculadas (greedy)
│       ├── fechamento.js           # fechar(dezenas, garantia) → aplica coberturas.js
│       ├── conferencia.js          # conferir(jogo, dezenasSorteadas) → {acertos,...}
│       └── estatisticas.js         # contarParesImpares(), frequenciaDezenas()
├── hooks/
│   ├── useLocalStorage.js          # [valor,set] sincronizado
│   ├── useRequisicao.js            # {dados,carregando,erro,executar}
│   ├── useSeo.js                   # title + meta description por rota
│   ├── useJogos.js                 # jogos de uma loteria (usa storage.js) + add/remover
│   └── usePwaInstall.js            # captura beforeinstallprompt
├── context/
│   ├── TemaContext.jsx             # tema + tamanho de fonte (aplica CSS vars) + useTema
├── components/
│   ├── atoms/
│   │   ├── Bola/                    # bolinha de dezena (numero, selecionada, aoClicar)
│   │   ├── Botao/  Badge/  Chip/  Spinner/  Icone/
│   ├── molecules/
│   │   ├── CardLoteria/             # card da Home (usa config.accent)
│   │   ├── LinhaJogo/               # um jogo salvo (map de Bola) + remover
│   │   ├── EstadoLista/             # carregando/erro/vazio reutilizável
│   │   └── Modal/                   # diálogo próprio (substitui SweetAlert2)
│   └── organisms/
│       ├── Navbar/                  # bottom nav (Início/Blog/Config); esconde no scroll
│       ├── Layout/                  # header + BannerAnuncio + <Outlet/> + Navbar
│       ├── BannerAnuncio/           # anúncios (§8) — reutilizável entre apps
│       ├── GradeDezenas/            # grade interativa (usa Bola + estado Set)
│       ├── Cadastrar/               # GradeDezenas + salvar (usa useJogos)
│       ├── ListaJogos/              # lista jogos salvos (usa useJogos + LinhaJogo)
│       ├── Conferir/                # busca resultado + conferir (resultados+conferencia)
│       ├── Combinar/                # combinacoes.js + UI
│       ├── Fechar/                  # fechamento.js + UI
│       ├── GraficoParesImpares/     # recharts + estatisticas.js
│       └── Analisar/                # analise dos jogos salvos
├── pages/
│   ├── Home/                        # grade de CardLoteria
│   ├── Loteria/                     # tela parametrizada por :loteria (abas: cadastrar/listar/conferir/combinar/fechar/analisar/grafico)
│   ├── Blog/  BlogPost/             # lista + post (rota dinâmica)
│   ├── Configuracoes/               # tema + fonte
│   └── estaticas/ (Sobre, Politicas, Privacidade, Contato)
├── App.jsx                          # <BrowserRouter> + rotas
└── main.jsx                         # <TemaProvider> + render
```

<br>

**Como a parametrização elimina duplicação (Open/Closed):** a página `Loteria` lê
`:loteria` da URL, acha a config, e passa `config` aos organismos (`Cadastrar`,
`Conferir`, etc.). **Um** conjunto de organismos serve às **quatro** loterias. O
original tinha ~70 casos num switch; aqui, é uma rota dinâmica + config.

---

## 5. Os algoritmos (o núcleo — services puros, arquivos pequenos)

Estes são a razão de ser do app. Porte-os fielmente, cada um num arquivo pequeno,
**sem React**, testável em Node.

- **`combinacoes.js`** — `gerarCombinacoes(dezenas, k, limite)` recursivo; sempre
  respeitar o `limite` (a explosão combinatória trava o navegador).
- **`coberturas.js`** — **SÓ DADOS**: as tabelas de cobertura pré-calculadas
  (portar do `data/coberturas/greedy.js` original). **Não recalcular ao vivo** —
  achar a cobertura mínima é NP-difícil e travaria a tela.
- **`fechamento.js`** — `fechar(dezenasEscolhidas, garantia)`: consulta `coberturas.js`
  e aplica os padrões de índices às dezenas reais. Arquivo curto (o peso está na tabela).
- **`conferencia.js`** — `conferir(jogo, dezenasSorteadas)` → conta acertos.
- **`estatisticas.js`** — `contarParesImpares`, `frequenciaDezenas`.

<br>

**Se algum cálculo for pesado o bastante para travar a UI:** mova para um **Web
Worker** (`import Worker from './x.worker?worker'`). Como os algoritmos são services
puros, chamá-los de dentro de um worker é trivial (Dependency Inversion facilita).

---

## 6. Persistência e offline

- **`storage.js`** — jogos por loteria em array JSON (`lmania_jogos_<url>`).
  Inclua **`migrarFormatoAntigo()`** (roda 1x): lê o esquema antigo
  (contador + itens numerados) e converte — **não perca os jogos dos usuários**.
- **`resultados.js`** — cache por `resultado-<loteria>-<concurso>` (resultado
  passado é imutável → cachear para sempre).
- **`useJogos(loteriaUrl)`** — hook que casa estado + storage (a UI usa o hook, não o storage direto).
- **PWA** via `vite-plugin-pwa`: manifest (`display:'standalone'`, ícones 192/512,
  theme_color) + workbox cacheando o casco (`**/*.{js,css,html,png,json}`).
  **Não** cachear respostas de resultados novos.

---

## 7. Rotas e SEO

```text
/                 → Blog (home de conteúdo)   |  /ferramentas → Home (grade)
/:loteria         → Loteria (mega-sena, lotofacil, quina, lotomania)
/:loteria/:aba    → aba (cadastrar/listar/conferir/combinar/fechar/analisar/grafico)
/blog  /blog/:slug
/sobre /privacidade /contato /politicas /configuracoes
```

`useSeo(titulo, descricao)` por rota (preservar os textos SEO do `META_MAP` original).

---

## 8. Espaço de anúncios — `organisms/BannerAnuncio` (reutilizável)

Consome `GET https://kibusao.com/public/api/anuncios.php`. **Contrato:**

```json
{ "habilitado": true, "intervaloMs": 6000,
  "anuncios": [ { "id":"a1","tipo":"texto|imagem","titulo":"...","texto":"...","link":"...","imagemUrl":"..." } ] }
```

Regras: `habilitado===false`/lista vazia → `null`; 2+ → rotaciona a cada `intervaloMs`
(mín 2000); imagem vs texto conforme `tipo`; `link` → `<a target="_blank"
rel="noopener noreferrer nofollow">`; rótulo "Publicidade"; erro → `null`.
**Posição:** no `Layout`, topo do conteúdo (Home e telas de lista); **nunca** sobre
a `GradeDezenas` (é interativa). Organismo plug-and-play, idêntico em outros apps.

---

## 9. Ordem de construção (milestones)

1. Scaffold + `tokens.css` + estrutura de pastas + `loterias/config.js`.
2. `services/`: `http`, `storage` (+migração), `resultados`, e **todos os algoritmos**
   (`combinacoes`, `coberturas`, `fechamento`, `conferencia`, `estatisticas`) — puros, testados em Node.
3. Hooks (`useLocalStorage`, `useJogos`, `useRequisicao`, `useSeo`, `usePwaInstall`).
4. Átomos (`Bola`, `Botao`, `Badge`, `Chip`, `Spinner`, `Icone`) + moléculas
   (`CardLoteria`, `LinhaJogo`, `EstadoLista`, `Modal`).
5. `TemaContext` (tema + fonte) + `Layout` + `Navbar` + **`BannerAnuncio`**.
6. `GradeDezenas` → `Cadastrar` → `ListaJogos` (o fluxo básico primeiro).
7. `Conferir` (usa resultados + conferencia).
8. `Combinar`, **`Fechar`** (deixar por último — o mais complexo), `GraficoParesImpares`, `Analisar`.
9. Página `Loteria` parametrizada juntando as abas; `Home`; `Blog`/`BlogPost`; `Configuracoes`; estáticas.
10. PWA (vite-plugin-pwa) + SEO por rota + `ErrorBoundary`.
11. Validar §10.

---

## 10. Critérios de aceite (marcar item a item)

- [ ] As 4 loterias funcionam com a config matemática correta (uma tela parametrizada).
- [ ] Cadastrar/Listar/Remover/Excluir jogos; **jogos antigos migrados sem perda**.
- [ ] Conferir contra o resultado oficial (com cache) mostrando acertos.
- [ ] **Fechamento** gera os mesmos jogos que o original (validar 1 caso); usa tabelas, não recalcula.
- [ ] Combinações e gráfico pares/ímpares equivalentes ao original.
- [ ] Blog lista posts e abre post por slug (`/blog/:slug`, deep link).
- [ ] Tema e tamanho de fonte persistem e aplicam via CSS variables.
- [ ] PWA instalável e funcional **offline** (menos a busca de resultado novo).
- [ ] SEO por rota preservado.
- [ ] `BannerAnuncio` presente e funcional (§8).
- [ ] **Nenhum arquivo > ~100 linhas**; **zero** jQuery, SweetAlert2, Chart.js
      vanilla, `document.createElement` de UI, `innerHTML`, `location.reload()`.
- [ ] Toda matemática em `services/loterias/` (pura); UI sem `fetch`/`localStorage`
      /algoritmo direto (Dependency Inversion respeitada).
```
