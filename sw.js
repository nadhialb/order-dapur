// Service Worker — Dapur Order (Offline Mode)
const CACHE_NAME = 'dapur-order-v12';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
];

// Install: cache semua aset
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS.filter(url => !url.startsWith('http'))))
      .then(() => self.skipWaiting())
  );
});

// Activate: hapus cache lama
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch strategy:
// - Supabase API: always network
// - app.js, style.css: network-first (always get latest)
// - Other assets (XLSX, fonts): cache-first
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Supabase API: selalu network
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(fetch(event.request).catch(() => new Response('{}', {headers:{'Content-Type':'application/json'}})));
    return;
  }

  // app.js dan style.css: network-first (selalu ambil versi terbaru)
  const isAppFile = url.pathname.includes('app.js') || url.pathname.includes('style.css') || url.pathname === '/' || url.pathname.includes('index.html');
  if (isAppFile) {
    event.respondWith(
      fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        return caches.match(event.request).then(cached => {
          if (cached) return cached;
          if (event.request.mode === 'navigate') return caches.match('/index.html');
        });
      })
    );
    return;
  }

  // CDN (XLSX, fonts): cache-first
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
