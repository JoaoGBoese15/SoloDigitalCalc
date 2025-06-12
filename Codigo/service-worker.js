// service-worker.js - v12 com Cache-First 

// 1. IMPORTANTE: ATUALIZE A VERSÃO DO CACHE NOVAMENTE!
const CACHE_NAME = 'solodigital-v12-standalone'; 
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './logo.png',
  './app-icon.png',
  './icon-web.png'
];

// Evento de instalação (sem alterações)
self.addEventListener('install', event => {
  console.log('[SW] Instalando Service Worker (v12)...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Adicionando arquivos ao cache...');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[SW] Cache preenchido.');
        return self.skipWaiting();
      })
  );
});

// Evento de ativação (sem alterações)
self.addEventListener('activate', event => {
  console.log('[SW] Ativando Service Worker (v12)...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Evento fetch com a estratégia "Cache-First"
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Se a resposta estiver no cache, retorna ela.
        // Se não, busca na rede.
        return cachedResponse || fetch(event.request);
      })
  );
});