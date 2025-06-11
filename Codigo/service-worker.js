// service-worker.js - Versão PWA Standalone (Offline Completo)

const CACHE_NAME = 'solodigital-v9-standalone';
const urlsToCache = [
  // URLs relativas para garantir funcionamento offline
  '/',
  '/index.html',
  './index.html',
  '/style.css',
  './style.css',
  '/script.js', 
  './script.js',
  '/manifest.json',
  './manifest.json',
  '/logo.png',
  './logo.png',
  '/app-icon.png',
  './app-icon.png',
  '/icon-web.png',
  './icon-web.png'
];

// Evento de instalação - força cache completo
self.addEventListener('install', event => {
  console.log('[SW] Instalando Service Worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Iniciando cache dos recursos...');
        
        // Faz cache de cada recurso individualmente para melhor controle
        const cachePromises = urlsToCache.map(url => {
          return fetch(url, {
            method: 'GET',
            cache: 'no-cache',
            headers: {
              'Cache-Control': 'no-cache'
            }
          })
          .then(response => {
            if (response.ok) {
              console.log(`[SW] Cached: ${url}`);
              return cache.put(url, response.clone());
            } else {
              console.warn(`[SW] Falha ao cachear: ${url} - Status: ${response.status}`);
            }
          })
          .catch(error => {
            console.error(`[SW] Erro ao cachear ${url}:`, error);
          });
        });
        
        return Promise.all(cachePromises);
      })
      .then(() => {
        console.log('[SW] Cache concluído com sucesso');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[SW] Erro durante instalação:', error);
      })
  );
});

// Evento de ativação
self.addEventListener('activate', event => {
  console.log('[SW] Ativando Service Worker...');
  
  event.waitUntil(
    Promise.all([
      // Limpa caches antigos
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => {
              console.log(`[SW] Removendo cache antigo: ${cacheName}`);
              return caches.delete(cacheName);
            })
        );
      }),
      // Assume controle imediato
      self.clients.claim()
    ])
    .then(() => {
      console.log('[SW] Service Worker ativado e assumiu controle');
    })
  );
});

// Evento de fetch - estratégia offline-first robusta
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Ignora requisições não-HTTP
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // Ignora requisições para outros domínios (APIs externas)
  if (url.origin !== location.origin && !url.hostname.includes('localhost')) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Tenta várias combinações de URL para encontrar no cache
        const urlsToTry = [
          request.url,
          request.url.replace(url.origin, ''),
          request.url.replace(url.origin + '/', './'),
          url.pathname,
          url.pathname === '/' ? '/index.html' : url.pathname,
          url.pathname === '/' ? './index.html' : url.pathname
        ];
        
        // Função para tentar encontrar no cache
        const tryCache = async (urls) => {
          for (const tryUrl of urls) {
            const cachedResponse = await cache.match(tryUrl);
            if (cachedResponse) {
              console.log(`[SW] Cache HIT: ${tryUrl} para ${request.url}`);
              return cachedResponse;
            }
          }
          return null;
        };
        
        return tryCache(urlsToTry)
          .then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Se não encontrou no cache, tenta a rede
            console.log(`[SW] Cache MISS, tentando rede: ${request.url}`);
            
            return fetch(request)
              .then(response => {
                // Se a resposta da rede é boa, adiciona ao cache
                if (response && response.status === 200) {
                  cache.put(request, response.clone());
                }
                return response;
              })
              .catch(networkError => {
                console.log(`[SW] Rede falhou para: ${request.url}`, networkError);
                
                // Se é uma requisição para documento HTML, retorna o index.html do cache
                if (request.destination === 'document' || request.headers.get('accept')?.includes('text/html')) {
                  return cache.match('./index.html') || cache.match('/index.html')
                    .then(indexResponse => {
                      if (indexResponse) {
                        console.log('[SW] Retornando index.html do cache para documento');
                        return indexResponse;
                      }
                      
                      // Última tentativa: página offline básica
                      return new Response(`
                        <!DOCTYPE html>
                        <html lang="pt-BR">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>SoloDigital - Offline</title>
                            <style>
                                body { 
                                    font-family: Arial, sans-serif; 
                                    text-align: center; 
                                    padding: 50px; 
                                    background: #f5f5f5;
                                }
                                .offline-message {
                                    background: white;
                                    padding: 30px;
                                    border-radius: 10px;
                                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                                    max-width: 400px;
                                    margin: 0 auto;
                                }
                                .retry-btn {
                                    background: #3ca95e;
                                    color: white;
                                    border: none;
                                    padding: 12px 24px;
                                    border-radius: 5px;
                                    cursor: pointer;
                                    margin-top: 20px;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="offline-message">
                                <h1>🌐 SoloDigital</h1>
                                <h2>Modo Offline</h2>
                                <p>O aplicativo não pôde carregar completamente.</p>
                                <p>Verifique sua conexão e tente novamente.</p>
                                <button class="retry-btn" onclick="window.location.reload()">
                                    Tentar Novamente
                                </button>
                            </div>
                        </body>
                        </html>
                      `, {
                        headers: { 
                          'Content-Type': 'text/html; charset=utf-8',
                          'Cache-Control': 'no-cache'
                        }
                      });
                    });
                }
                
                // Para outros tipos de requisição, rejeita
                throw networkError;
              });
          });
      })
  );
});

// Evento de mensagem para comunicação com a aplicação
self.addEventListener('message', event => {
  console.log('[SW] Mensagem recebida:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_CACHE_STATUS') {
    caches.open(CACHE_NAME).then(cache => {
      cache.keys().then(keys => {
        event.ports[0].postMessage({
          type: 'CACHE_STATUS',
          cachedUrls: keys.map(req => req.url),
          cacheSize: keys.length
        });
      });
    });
  }
});