const CACHE = "cf-2.1.0-c8052a4504";
const FILES = ["./", "index.html", "manifest.webmanifest", "icons/favicon.svg", "icons/icon-180.png", "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png", "fonts/BarlowCondensed-600-latin-ext.woff2", "fonts/BarlowCondensed-600-latin.woff2", "fonts/BarlowCondensed-700-latin-ext.woff2", "fonts/BarlowCondensed-700-latin.woff2", "fonts/BarlowCondensed-800-latin-ext.woff2", "fonts/BarlowCondensed-800-latin.woff2", "fonts/Inter-400-latin-ext.woff2", "fonts/Inter-400-latin.woff2", "fonts/Inter-500-latin-ext.woff2", "fonts/Inter-500-latin.woff2", "fonts/Inter-600-latin-ext.woff2", "fonts/Inter-600-latin.woff2", "fonts/Inter-700-latin-ext.woff2", "fonts/Inter-700-latin.woff2"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("message", e => { if (e.data === "skip") self.skipWaiting(); });
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url); if (url.origin !== location.origin) return;
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put("index.html", c)); return r; }).catch(() => caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(req).then(m => m || fetch(req).then(r => { if (r.ok) { const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); } return r; })));
});
