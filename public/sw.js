const CACHE_NAME = 'palabras-vivas-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/logo.png',
  '/favicon.ico',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/favicon-192x192.png',
  '/favicon-512x512.png',
  '/site.webmanifest'
];

// Install: cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch: network-first for HTML/API, cache-first for static assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip cross-origin requests (fonts, CDN)
  if (url.origin !== location.origin) return;

  // HTML pages: network first, fallback to cache
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Static assets (JS, CSS, images, audio): cache first, fallback to network
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;

      return fetch(request).then(response => {
        // Only cache successful responses
        if (!response || response.status !== 200) return response;

        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        return response;
      });
    })
  );
});
