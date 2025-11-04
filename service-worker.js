const CACHE_NAME = 'soccer-team-hub-cache-v1';

// Core application assets - these paths are relative to the service worker's scope.
// The main JS bundle filename changes with each build (due to hashing).
// You will need to UPDATE 'assets/index-Bt1nS0fa.js' to the ACTUAL path
// and filename of your main JavaScript bundle after each 'npm run build'.
// Look in your 'dist' folder for a file like 'assets/index-XXXXXXXX.js'.
const CORE_APP_ASSETS_RELATIVE = [
  'index.html',
  'metadata.json',
  'vite.svg',
  // IMPORTANT: REPLACE THIS PLACEHOLDER with the actual hashed filename from your 'dist/assets/' folder!
  // Example: 'assets/index-XXXXXXXX.js' where XXXXXXXX is the hash.
  'assets/index-DC7kFGmM.js', 
];

// External CDN assets (absolute URLs, do not need base prefixing)
const CDN_ASSETS = [
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=Cairo:wght@400;500;600;700;900&display=swap',
  // Pre-cache fonts explicitly if known to be used (woff2 is common)
  'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp5F8_zMu3lz.woff2',
  'https://fonts.gstatic.com/s/cairo/v24/SLXGc1gY6HPzQc_8-EJuLd54rD_A.woff2',
  // Importmap CDN URLs based on actual imports
  'https://aistudiocdn.com/react@^19.2.0',
  'https://aistudiocdn.com/react-dom@^19.2.0/client.js', // Specific import `react-dom/client`
  'https://aistudiocdn.com/@google/genai@^1.25.0' // Base URL for @google/genai as per importmap
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const baseUrl = self.registration.scope; // Get the base scope (e.g., /soccer-team-hub/)
      
      // Construct full URLs for core app assets based on the service worker's scope
      const fullCoreAppAssetUrls = CORE_APP_ASSETS_RELATIVE.map(asset => new URL(asset, baseUrl).href);

      const urlsToCache = [...fullCoreAppAssetUrls, ...CDN_ASSETS, baseUrl]; // Also cache the base URL itself ('/')
      console.log('Pre-caching assets:', urlsToCache); // For debugging
      await cache.addAll(urlsToCache);
      console.log('Opened cache and added assets');
    })().catch((error) => {
      console.error('Failed to pre-cache assets during install:', error);
    })
  );
});

// Intercept fetch requests: Cache-first strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return cached response
        if (response) {
          return response;
        }
        // No cache hit - fetch from network
        return fetch(event.request)
          .then((response) => {
            // Check if we received a valid response before caching
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            // IMPORTANT: Clone the response. A response is a stream
            // and can only be consumed once. We must clone it so that
            // the browser can consume one and we can consume the other.
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return response;
          })
          .catch((error) => {
             console.error('Fetch failed for network request:', event.request.url, error);
             // Optionally, return an offline page or a specific cached response for network failures
             // For example: return caches.match(new URL('offline.html', self.registration.scope).href);
             throw error; // Re-throw to propagate the error if needed
          });
      })
      .catch((error) => {
        console.error('Cache match failed or fetch failed:', error);
        // This catch block handles errors from caches.match() and potential re-thrown errors from fetch
        throw error;
      })
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});