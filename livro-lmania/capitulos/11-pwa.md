<h1 class="cap"><span class="num">Capítulo 11</span> — PWA: instalável e offline</h1>

## 11.1 O que é um PWA

Um **PWA** (*Progressive Web App*) é um site que se comporta como um app nativo: pode ser **instalado** na tela inicial do celular (com ícone próprio, sem a barra do navegador), abre em tela cheia e funciona **offline**. Para o LMania — uma ferramenta que o usuário abre toda hora e que faz quase tudo localmente — isso é ideal.

Dois ingredientes transformam o site em PWA: um **manifesto** (a identidade do app) e um **service worker** (o cache inteligente).

## 11.2 O jeito fácil: vite-plugin-pwa

Escrever um service worker à mão é trabalhoso e cheio de armadilhas de versão. O plugin `vite-plugin-pwa` gera tudo:

```bash
npm install -D vite-plugin-pwa
```

```js
// vite.config.js
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',   // atualiza o app sozinho quando você publica
      manifest: {
        name: 'LMania — Loterias',
        short_name: 'LMania',
        display: 'standalone',       // sem a barra do navegador
        background_color: '#080c14',
        theme_color: '#f97316',
        icons: [
          { src: '/icons/192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,json}'], // cacheia o "casco" do app
      },
    }),
  ],
});
```

O `display: 'standalone'` remove a barra de endereço; os ícones aparecem na tela inicial. E o `workbox` cacheia os arquivos do app, fazendo-o abrir instantâneo e funcionar sem rede.

## 11.3 O que cachear (e o que não)

<div class="callout importante" markdown="1">
<span class="rot">Importante — cacheie o casco, não os dados voláteis</span>
Cacheie o **casco** do app (código, estilos, ícones) — muda pouco e faz o app abrir offline. **Não** cacheie dados que precisam ser frescos. No LMania há uma distinção elegante: resultados de concursos **passados** são imutáveis (já ficam no localStorage, cacheados para sempre); o app é cacheado pelo PWA; e os cálculos (fechamento, combinações) rodam localmente, sem rede. Por isso o LMania faz quase tudo offline — só buscar um resultado **novo** precisa de internet.
</div>

## 11.4 O que funciona offline no LMania

Pense no que o usuário consegue fazer sem internet, graças à arquitetura que construímos:

- **Montar e salvar jogos** — tudo no localStorage.
- **Listar e remover jogos** — dados locais.
- **Fazer fechamentos e combinações** — os algoritmos rodam no dispositivo (Módulo 5).
- **Conferir concursos já buscados** — resultados no cache.
- **Ver estatísticas** dos jogos salvos.

O que **não** funciona offline: buscar um resultado **novo** (concurso recém-sorteado que ainda não foi cacheado). É uma degradação graciosa — o app não "quebra" sem rede, só faz um pouco menos.

<div class="callout dica" markdown="1">
<span class="rot">Dica — a recompensa da arquitetura em camadas</span>
Repare por que o fechamento funciona offline: porque a lógica está em `services/` puros, alimentada por dados locais, sem depender da rede. A separação em camadas (Módulo 2) e a decisão de manter os dados localmente se pagam aqui — de graça. Boas decisões de arquitetura rendem juros em lugares que você não previu, como o offline.
</div>

## 11.5 Instalação e o botão "Instalar"

O navegador oferece a instalação automaticamente (um ícone na barra), mas você pode oferecer um botão próprio, capturando o evento `beforeinstallprompt`:

```jsx
// hook simplificado
const [promptInstall, setPromptInstall] = useState(null);
useEffect(() => {
  const handler = (e) => { e.preventDefault(); setPromptInstall(e); };
  window.addEventListener('beforeinstallprompt', handler);
  return () => window.removeEventListener('beforeinstallprompt', handler);
}, []);
// botão: {promptInstall && <Botao texto="⬇ Instalar" aoClicar={() => promptInstall.prompt()} />}
```

## 11.6 Fecho do módulo

O LMania agora é offline-first e instalável: persiste jogos, busca e cacheia resultados, confere, e funciona sem rede. É um app de verdade no dispositivo do usuário. Falta a parte que dá profundidade técnica ao livro — os **algoritmos** que fazem a ferramenta valer a pena: combinações e o fechamento matemático. É o próximo módulo, o mais interessante.
