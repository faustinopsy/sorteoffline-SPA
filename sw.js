const CACHE_NAME = 'v011';

const STATIC_CACHE_URLS = [
  'index.html',
  'manifest.json',
  'assets/css/styles.css',
  'assets/js/App.js',
  'assets/js/script.js',
  'assets/js/sweetalert2.11.js',
  'assets/js/Chart.min.js',
  'assets/js/lang/pt.json',
  'assets/js/lang/en.json',
  // Componentes core
  'assets/js/components/Navbar.js',
  'assets/js/components/Home.js',
  'assets/js/components/screen/About.js',
  'assets/js/components/screen/Mega.js',
  'assets/js/components/screen/Quina.js',
  'assets/js/components/screen/Lotomania.js',
  'assets/js/components/screen/Lotofacil.js',
  'assets/js/components/cad/Cadastrar.js',
  'assets/js/components/list/Listar.js',
  'assets/js/components/list/Conferir.js',
  'assets/js/components/combinacoes/Combinar.js',
  'assets/js/components/graficos/GraficoParesImpares.js',
  'assets/js/components/analise/AnalisarJogos.js',
  // Libs
  'assets/js/components/lib/LocalStorage.js',
  'assets/js/components/lib/BuscaApi.js',
  'assets/js/components/lib/Modal.js',
  'assets/js/components/lib/BlogApi.js',
  // Blog
  'assets/js/components/blog/Blog.js',
  'assets/js/components/blog/BlogPost.js',
  // Settings
  'assets/js/components/settings/Settings.js',
  'assets/js/components/settings/themes.js',
  // Imagens de loteria
  'assets/img/lotofacil.png',
  'assets/img/megasena.png',
  'assets/img/lotomania.png',
  'assets/img/quina.png',
  // Imagens de menu/navbar
  'assets/img/home.png',
  'assets/img/about.png',
  'assets/img/cad.png',
  'assets/img/conf.png',
  'assets/img/list.png',
  'assets/img/combina.png',
  'assets/img/atual.png',
  'assets/img/analise.png',
  'assets/img/nfacil.png',
  'assets/img/nmania.png',
  'assets/img/nquina.png',
  'assets/img/nmega.png',
  // Ícones novos (blog e settings — criar as imagens ou usar fallback emoji)
  // 'assets/img/blog.png',
  // 'assets/img/settings.png',
  // Logo
  'assets/img/logo.png',
];

// ── Install: pré-cachear arquivos estáticos ──────────────────
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cachear individualmente para não quebrar tudo se um arquivo faltar
      return Promise.allSettled(
        STATIC_CACHE_URLS.map(url =>
          cache.add(url).catch(() => { /* arquivo não encontrado — ignorar */ })
        )
      );
    })
  );
});

// ── Activate: limpar caches antigos ─────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: cache-first para estáticos, network-only para /api/ ──
self.addEventListener('fetch', event => {
  const url = event.request.url;

  // Nunca cachear chamadas ao backend PHP ou chamadas externas de API
  if (
    url.includes('/api/') ||
    url.includes('/sitemap.xml') ||
    url.includes('/sitemap.php') ||
    url.includes('servicebus2.caixa.gov.br') ||
    url.includes('generativelanguage.googleapis.com') ||
    url.includes('api.openai.com')
  ) {
    return; // deixar ir direto para a rede (sem respondWith)
  }

  // Ignorar requisições não-GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.ok) {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        }
        return networkResponse;
      }).catch(() => {
        // Offline fallback: SPA shell
        return caches.match('index.html');
      });
    }).catch(() => caches.match('index.html'))
  );
});
