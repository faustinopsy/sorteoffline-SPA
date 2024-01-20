 const CACHE_NAME = 'v3';
  const STATIC_CACHE_URLS = [
   'index.html', 
   'game.html', 
   'receber.html', 
   'saldo.html', 
   'transferir.html', 
   'roleta.html', 
   'sobre.html', 
   'manifest.json', 
   'js/nfcReceber.js',
   'js/nfcRoleta.js',
   'js/nfcSaldoCartao.js',
   'js/nfcSaldoConta.js',
   'js/nfcTransferir.js',
   'js/nfcTesouro.js',
   'js/nfcRoleta.js',
   'js/scripts.js',
   'js/lang/eng.json',
   'js/lang/pt.json',
   'css/styles.css',
   'css/menu.css',
   'include/menu.html',
   'include/modal.html',
   'img/logo.png',
   'img/off.png',
   'img/receber.png',
   'img/roleta.png',
   'img/saldo.png',
   'img/tesour.png',
   'img/transferir.png',
   'img/sobre.png'
   
   ];
  
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retorna a resposta do cache se disponível
        if (response) {
          return response;
        }
        // Senão, busca da rede
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



