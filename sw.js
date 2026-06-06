// Service Worker — Dapur Order
// Strategy: local files = NEVER cached by SW (let browser HTTP cache + Vercel headers handle it)
//           CDN files (XLSX, fonts) = cache-first for offline support
const CACHE_NAME = 'dapur-order-cdn-v1';
const CDN_ASSETS = [
  'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CDN_ASSETS).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Supabase API: always network, never cache
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(
      fetch(event.request).catch(() => new Response('{}', { headers: { 'Content-Type': 'application/json' } }))
    );
    return;
  }

  // Local files (same origin): always network — no SW caching
  // Vercel + no-cache headers ensure fresh files on every load
  if (url.hostname === self.location.hostname) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Offline fallback only
        if (event.request.mode === 'navigate') return caches.match('/index.html');
      })
    );
    return;
  }

  // CDN (XLSX, fonts): cache-first for offline
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
