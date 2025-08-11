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
  event.waitUntil(
    // Clear old caches
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Skip development server files (Vite handles these)
  if (event.request.url.includes('/src/') || 
      event.request.url.includes('/node_modules/') ||
      event.request.url.includes('/@vite/') ||
      event.request.url.includes('/@fs/')) {
    return;
  }
  
  // Skip requests for file extensions that Vite handles
  if (event.request.url.match(/\.(ts|tsx|js|jsx|css|png|jpg|jpeg|gif|svg|ico|json|woff|woff2|ttf|eot)(\?.*)?$/)) {
    return;
  }
  
  // Only handle HTML requests in development
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        
        return fetch(event.request);
      })
      .catch(error => {
        console.error('Service Worker: Fetch failed for:', event.request.url, 'Error:', error);
        
        // For HTML requests, return a basic offline page
        if (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html')) {
          return new Response(
            '<html><body><h1>Offline</h1><p>You are currently offline. Please check your internet connection.</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        }
        
        throw error;
      })
  );
});