const CACHE_NAME = 'pomodoro-pwa-cache-v17'; // Increment!
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/manifest.json',
  '/notification.mp3',
    // Android Icons
  '/images/android/android-launchericon-48-48.png',
  '/images/android/android-launchericon-72-72.png',
  '/images/android/android-launchericon-96-96.png',
  '/images/android/android-launchericon-144-144.png',
  '/images/android/android-launchericon-192-192.png',
  '/images/android/android-launchericon-512-512.png',
 // iOS Icons
    '/images/ios/16.png',
    '/images/ios/20.png',
    '/images/ios/29.png',
    '/images/ios/32.png',
    '/images/ios/40.png',
    '/images/ios/50.png',
    '/images/ios/57.png',
    '/images/ios/58.png',
    '/images/ios/60.png',
    '/images/ios/64.png',
    '/images/ios/72.png',
    '/images/ios/76.png',
    '/images/ios/80.png',
    '/images/ios/87.png',
    '/images/ios/100.png',
    '/images/ios/114.png',
    '/images/ios/120.png',
    '/images/ios/128.png',
    '/images/ios/144.png',
    '/images/ios/152.png',
    '/images/ios/167.png',
    '/images/ios/180.png',
    '/images/ios/192.png',
    '/images/ios/256.png',
    '/images/ios/512.png',
    '/images/ios/1024.png',
  //Music
  '/music/lofi.mp3',
  '/music/ambient.mp3',
  '/music/classical.mp3',
  // External Resources
  'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/progressbar.js@1.1.0/dist/progressbar.min.js', // ADD THIS!
];

// Dynamically add background images
const backgroundImages = [
    '/css/images/background/nature.jpg',
    '/css/images/background/space.jpg',
    '/css/images/background/abstract.jpg',
];
urlsToCache.push(...backgroundImages);


// Install event: Cache the app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('Failed to open cache:', err);
      })
  );
});

// Fetch event: Serve from cache, fallback to network
self.addEventListener('fetch', event => {
 event.respondWith(
     caches.match(event.request)
         .then(response => {
             if (response) {
                 return response; // Return from cache if found
             }

             const fetchRequest = event.request.clone();

             // IMPORTANT: Handle music files with 'no-cors'
             if (event.request.url.endsWith('.mp3')) {
                 return fetch(event.request, { mode: 'no-cors' }) // Fetch with no-cors
                     .then(response => {
                         // Check for opaque response
                         if (!response || response.status !== 0 || response.type !== 'opaque') {
                             return response; // Return network response if not opaque
                         }

                         const responseToCache = response.clone();
                         caches.open(CACHE_NAME)
                             .then(cache => {
                                 cache.put(event.request, responseToCache); // Cache the opaque response
                             });
                         return response;
                     })
                     .catch(error => {
                         console.error("Fetch error for MP3:", error);
                         // Handle fetch errors, perhaps return a fallback response
                     });
             }

             // For non-MP3 files, use the standard fetch
             return fetch(fetchRequest).then(
                 function(response) {
                     if (!response || response.status !== 200 || response.type !== 'basic') {
                         return response;
                     }

                     const responseToCache = response.clone();
                     caches.open(CACHE_NAME)
                         .then(cache => {
                             cache.put(event.request, responseToCache);
                         });
                     return response;
                 }
             );
         })
         .catch(error => {
             console.error("Fetch error:", error); // General fetch error
         })
 );
});


// Activate event: Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME]; // Keep only the current cache

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // Delete old caches
          }
        })
      );
    })
  );
});