const CACHE_NAME = 'light-edu-v3';
const urlsToCache = [
  '/',
  '/dashboard.html',
  '/learn.html',
  '/subjects.html',
  '/topics.html',
  '/lessons.html',
  '/note.html',
  '/cbt.html',
  '/ai.html',
  '/snap.html',
  '/profile.html',
  '/auth.html',
  '/manifest.json',
  '/logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});