const CACHE_NAME = 'dulces-momentos-v1';
const OFFLINE_CACHE = 'dulces-offline-v1';

// Critical resources to cache during install
const urlsToCache = [
  '/',
  '/manifest.json',
  '/offline.html',
  '/icon-192.png',
  '/icon-512.png'
];

// Additional resources to cache on first visit
const urlsToCacheOnFirstVisit = [
  '/favicon.ico'
];

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    Promise.all([
      // Cache critical resources
      caches.open(CACHE_NAME)
        .then((cache) => {
          console.log('Service Worker: Caching app shell');
          return cache.addAll(urlsToCache.filter(url => url !== '/offline.html'));
        }),
      // Cache offline page separately
      caches.open(OFFLINE_CACHE)
        .then((cache) => {
          return cache.add('/offline.html');
        })
    ]).then(() => {
      console.log('Service Worker: Installation complete');
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    // Clear old caches
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== OFFLINE_CACHE) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activation complete');
      return self.clients.claim();
    })
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
      event.request.url.includes('/@fs/') ||
      event.request.url.includes('/__vite')) {
    return;
  }

  const url = new URL(event.request.url);
  
  // Handle navigation requests (HTML pages)
  if (event.request.mode === 'navigate' || 
      (event.request.headers.get('accept') && 
       event.request.headers.get('accept').includes('text/html'))) {
    
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // If successful, clone and cache the response
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() => {
          // If network fails, try cache first, then offline page
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Return offline page
              return caches.open(OFFLINE_CACHE)
                .then(cache => cache.match('/offline.html'));
            });
        })
    );
    return;
  }

  // Handle static assets (images, icons, manifest, etc.)
  if (url.pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|json|css|js)$/)) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(event.request)
            .then(response => {
              // If successful, cache the response
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                  .then(cache => {
                    cache.put(event.request, responseClone);
                  });
              }
              return response;
            })
            .catch(error => {
              console.log('Service Worker: Failed to fetch:', event.request.url);
              throw error;
            });
        })
    );
    return;
  }

  // For all other requests, try network first, then cache
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache successful responses
        if (response.status === 200 && 
            !event.request.url.includes('chrome-extension') &&
            !event.request.url.includes('extension')) {
          
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, responseClone));
        }
        return response;
      })
      .catch(() => {
        // Try to get from cache
        return caches.match(event.request);
      })
  );
});

// Handle background sync (for future offline capabilities)
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered');
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle any background sync tasks here
      Promise.resolve()
    );
  }
});

// Handle push notifications (for future features)
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push message received');
  // Handle push notifications here in the future
});

// Clean up old caches periodically
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});