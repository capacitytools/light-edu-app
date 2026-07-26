const CACHE_NAME = 'light-edu-v1';
const urlsToCache = [
  'index.html',
  'dashboard.html',
  'learn.html',
  'cbt.html',
  'ai.html',
  'profile.html',
  'logo.jpg',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
