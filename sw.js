const CACHE_NAME = 'reign-1450-v4';
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
  './assets/battle/sprites/manifest.json',
  './data/world.json',
  './data/historical-polities-1450.json',
  './src/main.js',
  './src/ui/chronicle-shell.css',
  './src/ui/minimap.js',
  './src/ui/chronicle.css',
  './src/ui/chronicle.js',
  './src/ui/royal-economy.css',
  './src/ui/royal-economy.js',
  './src/ui/politics.css',
  './src/ui/lineage.js',
  './src/ui/asset-registry.js',
  './src/ui/chronicle-art-data.js',
  './src/ui/field-command.css',
  './src/simulation.js',
  './src/map.js',
  './src/banner-renderer.js',
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
  const url = new URL(req.url);
  const freshFirst = req.mode === 'navigate' || /\.(html|css|js|json|webmanifest)$/i.test(url.pathname) || url.pathname === '/';
  if (freshFirst) {
    event.respondWith(
      fetch(req).then(res => {
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, clone)).catch(() => {});
        }
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }
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
