// service-worker.js (VERSÃO FINAL E DEFINITIVA)

const CACHE_NAME = 'solodigital-v7-final-fix';
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

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
});

// Evento de Fetch com a correção ignoreVary
self.addEventListener('fetch', event => {
  event.respondWith(
    // AQUI ESTÁ A CORREÇÃO: Adicionamos { ignoreVary: true }
    caches.match(event.request, { ignoreVary: true })
      .then(response => {
        // Se encontrar no cache (ignorando o Vary), retorna.
        // Se não, busca na rede.
        return response || fetch(event.request);
      })
  );
});