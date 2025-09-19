self.addEventListener('install', (e) => {
  e.waitUntil(caches.open('skin-compass-v1').then(c => c.addAll([self.registration.scope])));
});
self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
