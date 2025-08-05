const CACHE_NAME = 'restaurant-app-v1';

// Only cache critical resources during install
const urlsToCache = [
  '/',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  console.log('Service Worker: Fetch event for:', event.request.url);
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    console.log('Service Worker: Skipping non-GET request:', event.request.method);
    return;
  }
  
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    console.log('Service Worker: Skipping cross-origin request:', event.request.url);
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          console.log('Service Worker: Serving from cache:', event.request.url);
          return response;
        }
        
        console.log('Service Worker: Fetching from network:', event.request.url);
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              console.log('Service Worker: Not caching non-successful response:', response.status);
              return response;
            }
            
            // Clone the response since it's a stream
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                console.log('Service Worker: Caching new resource:', event.request.url);
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(error => {
            console.error('Service Worker: Fetch failed for:', event.request.url, 'Error:', error);
            
            // For HTML requests, return a basic offline page
            if (event.request.headers.get('accept').includes('text/html')) {
              console.log('Service Worker: Returning offline page for HTML request');
              return new Response(
                '<html><body><h1>Offline</h1><p>You are currently offline. Please check your internet connection.</p></body></html>',
                { headers: { 'Content-Type': 'text/html' } }
              );
            }
            
            // For other requests, just throw the error
            throw error;
          });
      })
  );
});