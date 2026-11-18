#!/usr/bin/env python3
"""Monta la app: index.html (PWA para GitHub Pages) y dist/artifact.html (versión para Claude)."""
import os, re, hashlib, json
R = os.path.dirname(os.path.abspath(__file__))
rd = lambda p: open(os.path.join(R, p), encoding="utf-8").read()
css, body, fig, app = rd("src/app.css"), rd("src/body.html"), rd("src/fig.js"), rd("src/app.js")
version = re.search(r'VERSION = "([^"]+)"', app).group(1)
fonts_local = rd("fonts/fonts.css")
GF = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap">'

splash = [(1179,2556,393,852,3),(1290,2796,430,932,3),(1170,2532,390,844,3),(1206,2622,402,874,3),(1320,2868,440,956,3),(1125,2436,375,812,3),(828,1792,414,896,2)]
splash_links = "".join(
  f'<link rel="apple-touch-startup-image" media="(device-width: {cw}px) and (device-height: {ch}px) and (-webkit-device-pixel-ratio: {r}) and (orientation: portrait)" href="icons/splash-{w}x{h}.png">'
  for w,h,cw,ch,r in splash)

pwa = f"""<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Cambio Físico</title>
<meta name="description" content="Plan personal de 12 semanas: ejercicio, running y alimentación.">
<meta name="theme-color" content="#0E1014">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Cambio Físico">
<meta name="format-detection" content="telephone=no">
<meta name="robots" content="noindex">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icons/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="icons/icon-180.png">
{splash_links}
<link rel="preload" href="fonts/BarlowCondensed-800-latin.woff2" as="font" type="font/woff2" crossorigin>
<style>{fonts_local}
{css}</style>
</head>
<body>
{body}
<script>window.PWA=true;</script>
<script>{fig}</script>
<script>{app}</script>
</body>
</html>
"""
open(os.path.join(R, "index.html"), "w", encoding="utf-8").write(pwa)

art = f"""<title>Cambio Físico</title>
<meta name="claude:viewport-fit-sides" content="cover">
{GF}
<style>{css}</style>
{body}
<script>{fig}</script>
<script>{app}</script>
"""
os.makedirs(os.path.join(R, "dist"), exist_ok=True)
open(os.path.join(R, "dist/artifact.html"), "w", encoding="utf-8").write(art)

# Service worker: precache de todo con versión por hash
files = ["./", "index.html", "manifest.webmanifest", "icons/favicon.svg", "icons/icon-180.png", "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png"]
files += ["fonts/" + f for f in sorted(os.listdir(os.path.join(R, "fonts"))) if f.endswith(".woff2")]
h = hashlib.sha1(pwa.encode()).hexdigest()[:10]
sw = f"""const CACHE = "cf-{version}-{h}";
const FILES = {json.dumps(files)};
self.addEventListener("install", e => {{ e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); }});
self.addEventListener("activate", e => {{ e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); }});
self.addEventListener("message", e => {{ if (e.data === "skip") self.skipWaiting(); }});
self.addEventListener("fetch", e => {{
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url); if (url.origin !== location.origin) return;
  if (req.mode === "navigate") {{
    e.respondWith(fetch(req).then(r => {{ const c = r.clone(); caches.open(CACHE).then(x => x.put("index.html", c)); return r; }}).catch(() => caches.match("index.html")));
    return;
  }}
  e.respondWith(caches.match(req).then(m => m || fetch(req).then(r => {{ if (r.ok) {{ const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); }} return r; }})));
}});
"""
open(os.path.join(R, "sw.js"), "w").write(sw)

manifest = {"name": "Cambio Físico", "short_name": "Cambio Físico", "description": "Plan personal de 12 semanas: ejercicio, running y alimentación.",
  "lang": "es-ES", "start_url": "./", "scope": "./", "display": "standalone", "orientation": "portrait",
  "background_color": "#0E1014", "theme_color": "#0E1014",
  "icons": [{"src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png"}, {"src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png"},
            {"src": "icons/maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"}]}
open(os.path.join(R, "manifest.webmanifest"), "w").write(json.dumps(manifest, ensure_ascii=False, indent=1))
print("ok", version, h, len(pwa)//1024, "KB")
