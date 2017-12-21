var cacheName = 'mytest v1.2';
var dataCacheName = 'dramaData-v1';

var filesToCache = [
  '/',
  '/index.html',
  '/img/icons/arrow.svg',
  '/img/icons/search.svg',
  '/css/angular-material.min.css',
  '/js/angular-animate.min.js',
  '/js/angular-aria.min.js',
  '/js/angular-material.min.js',
  '/js/angular.min.js',
  '/js/js.js'
];

self.addEventListener('install', function (e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', function (e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  var dataUrl = "http://api.tvmaze.com/shows/";
  if (e.request.url.indexOf(dataUrl) > -1) {
    e.respondWith(
      caches.open(dataCacheName).then(function (cache) {
        return fetch(e.request).then(function (response) {
          cache.put(e.request.url, response.clone());
          return response;
        });
      })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(function (response) {
        return response || fetch(e.request);
      }))
  }
});


self.addEventListener('activate', function (e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});