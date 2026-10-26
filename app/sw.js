// KABEL · service worker
// Hace la app instalable. No guarda copias de la app: siempre se carga la última versión.
// Más adelante aquí llegarán los avisos de "tu artista está en directo".
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  if (e.request.mode !== 'navigate') return;
  e.respondWith(fetch(e.request).catch(() => new Response(
    '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>KABEL</title><body style="background:#000;color:#EDEEE6;font-family:system-ui;padding:32px"><h1 style="font-weight:900">KABEL</h1><p>Sin conexión a internet. Kabel necesita internet para escuchar en directo.</p></body>',
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } })));
});
