const CACHE_NAME = 'v001';
const STATIC_CACHE_URLS = [
 'index.html', 
 'manifest.json', 
 'assets/js/App.js',
 'assets/js/sweetalert2.11.js',
 'assets/js/lang/eng.json',
 'assets/js/lang/pt.json',
 'assets/js//components/Navbar.js',
 'assets/js//components/screen/About.js',
 'assets/js//components/Home.js',
 'assets/js//components/screen/Lotomania.js',
 'assets/js//components/screen/Lotofacil.js',
 'assets/js//components/cad/CadFacil.js',
 'assets/js//components/list/ListaFacil.js',
 'assets/js/./components/list/ConfereFacil.js',
 'assets/js//components/screen/Mega.js',
 'assets/js//components/screen/Quina.js',
 'assets/js//components/lib/GerarCombinacoes.js',
 'assets/css/styles.css',
 'assets/css/menu.css',
 'assets/img/cad.png',
 'assets/img/conf.png',
 'assets/img/home.png',
 'assets/img/list.png',
 'assets/img/logo.png',
 'assets/img/lotofacil.png',
 'assets/img/megasena.png',
 'assets/img/lotomania.png',
 'assets/img/quina.png',
 'assets/img/nfacil.png',
 'assets/img/nmania.png',
 'assets/img/nquina.png',
 'assets/img/nmega.png',
 ];

self.addEventListener('fetch', event => {
event.respondWith(
  caches.match(event.request)
    .then(response => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
);
});

self.addEventListener('install', event => {
event.waitUntil(
  caches.open(CACHE_NAME)
    .then(cache => {
      console.log('Cache aberto');
      return cache.addAll(STATIC_CACHE_URLS);
    })
);
});

self.addEventListener('activate', event => {
const cacheWhitelist = [CACHE_NAME]; 
event.waitUntil(
  caches.keys().then(cacheNames => {
    return Promise.all(
      cacheNames.map(cacheName => {
        if (cacheWhitelist.indexOf(cacheName) === -1) {
          return caches.delete(cacheName); 
        }
      })
    );
  })
);
});



