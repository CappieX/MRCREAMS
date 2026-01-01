// Service Worker for MR.CREAMS PWA
const CACHE_NAME = 'mrcreams-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/main.chunk.js',
  '/static/js/0.chunk.js',
  '/static/js/bundle.js',
  '/static/css/main.chunk.css',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png'
];

// Install a service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache and return requests
self.addEventListener('fetch', event => {
  // Skip cross-origin requests and API requests
  if (event.request.url.startsWith(self.location.origin) && !event.request.url.includes('/api/')) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Cache hit - return response
          if (response) {
            return response;
          }
          
          return fetch(event.request).then(
            response => {
              // Return the response as-is for non-GET requests or if status is not 200
              if (!response || response.status !== 200 || event.request.method !== 'GET') {
                return response;
              }

              // Clone the response
              const responseToCache = response.clone();

              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });

              return response;
            }
          );
        })
    );
  }
});

// Update a service worker
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

// Background sync for offline support
self.addEventListener('sync', event => {
  if (event.tag === 'syncData') {
    event.waitUntil(syncData());
  }
});

// Function to sync data when back online
async function syncData() {
  try {
    const dataToSync = await getDataFromIndexedDB('offlineActions');
    
    if (dataToSync && dataToSync.length) {
      for (const item of dataToSync) {
        await fetch(item.url, {
          method: item.method,
          headers: item.headers,
          body: item.body
        });
        
        // Remove from IndexedDB after successful sync
        await removeFromIndexedDB('offlineActions', item.id);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Helper functions for IndexedDB operations
function getDataFromIndexedDB(storeName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('mrcreamsOfflineDB', 1);
    
    request.onerror = event => reject(event.target.error);
    
    request.onsuccess = event => {
      const db = event.target.result;
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
  });
}

function removeFromIndexedDB(storeName, id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('mrcreamsOfflineDB', 1);
    
    request.onerror = event => reject(event.target.error);
    
    request.onsuccess = event => {
      const db = event.target.result;
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const deleteRequest = store.delete(id);
      
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
  });
}