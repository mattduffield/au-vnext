const RUNTIME = 'runtime';
let CURRENT_CACHES = [RUNTIME];
const RUNTIME_ORIGINS = [
  'https://maxcdn.bootstrapcdn.com'
];
const NO_CACHE_ORIGINS = [
  'https://api.mlab.com',
  'https://quoteone.blob.core.windows.net',
  'https://us-central1-quoteone-staging.cloudfunctions.net',
  'https://us-central1-quoteone-production.cloudfunctions.net',
  'https://quoteone-production.appspot.com',
  'https://quoteone-staging.appspot.com'
];

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !CURRENT_CACHES.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

// The fetch handler serves responses for all resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', event => {
  const reqUrl = new URL(event.request.url);
  // const refUrl = new URL(event.request.referrer);
  let CACHE_NAME = RUNTIME;
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return caches.open(CACHE_NAME).then(cache => {
        return fetch(event.request).then(response => {
          if (event.request.method === 'GET' &&
            !NO_CACHE_ORIGINS.includes(reqUrl.origin)) {
            // console.log('sw:caching (', CACHE_NAME, ') - ', event.request.url);
            // Put a copy of the response in the runtime cache.
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          } else {
            return response;
          }
        });
      });
    })
  );
});
