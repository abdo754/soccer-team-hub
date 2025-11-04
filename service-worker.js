
const CACHE_NAME = 'soccer-team-hub-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // Local application files - assuming the environment handles transpilation of .tsx/.ts to JS modules
  '/index.tsx', // The entry point script
  '/App.tsx',
  '/types.ts',
  '/constants.ts',
  '/services/geminiService.ts',
  '/components/AuthScreen.tsx',
  '/components/Header.tsx',
  '/components/Dashboard.tsx',
  '/components/Profile.tsx',
  '/components/Chat.tsx',
  '/components/EventModal.tsx',
  '/components/Calendar.tsx',
  '/components/icons/CalendarIcon.tsx',
  '/components/icons/ChatIcon.tsx',
  '/components/icons/LogoutIcon.tsx',
  '/components/icons/ProfileIcon.tsx',
  '/components/icons/TeamIcon.tsx',
  '/components/icons/LanguageIcon.tsx',
  '/components/icons/CameraIcon.tsx',
  '/components/icons/EditIcon.tsx',
  '/translations.ts',
  '/contexts/LanguageContext.tsx',
  '/vite.svg', // App icon
  '/metadata.json', // The PWA manifest itself
  // External CDN assets
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

// Open a cache and populate it with pre-defined assets during installation
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Failed to pre-cache assets:', error);
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
             // For example: return caches.match('/offline.html');
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
