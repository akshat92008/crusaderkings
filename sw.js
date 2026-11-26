const CACHE_NAME = 'sovereign-1450-v2';
const CORE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './assets/court-theme.css',
  './assets/hometown.css',
  './manifest.webmanifest',
  './assets/branding/sovereign-logo.webp',
  './assets/branding/icon-192.png',
  './assets/branding/icon-512.png',
  './assets/hometown/manifest.json',
  './data/world.json',
  './data/historical-polities-1450.json',
  './src/main.js',
  './src/simulation.js',
  './src/map.js',
  './src/kingdom-ui.js',
  './src/kingdom-depth.js',
  './src/dynastic-politics.js',
  './src/expanded-content.js',
  './src/hometown.js',
  './src/hometown-ui.js',
  './src/feudal-systems.js',
  './src/mobile-storage.js',
  './src/portable-save.js',
  './src/dispatch-ui.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS).catch(() => {})).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return;
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      if (res && res.status === 200 && res.type === 'basic') {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(req, clone)).catch(() => {});
      }
      return res;
    }).catch(() => cached))
  );
});
