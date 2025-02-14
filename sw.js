const CACHE_NAME = 'pomodoro-pwa-cache-v3'; // IMPORTANT: Update version number when you change files!
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/manifest.json',
  '/notification.mp3', // Assuming you put it in root folder
  // Android Icons (include all sizes you're using in manifest.json)
  '/images/android/android-launchericon-48-48.png',
  '/images/android/android-launchericon-72-72.png',
  '/images/android/android-launchericon-96-96.png',
  '/images/android/android-launchericon-144-144.png',
  '/images/android/android-launchericon-192-192.png',
  '/images/android/android-launchericon-512-512.png',
  // iOS Icons (include all sizes you're using in manifest.json)
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
  // External Resources (Google Fonts, Font Awesome) - THESE ARE IMPORTANT!
  'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  // Add any other files your app needs (images, data files, etc.)
];

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
        // Cache hit - return response
        if (response) {
          return response;
        }

        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once.
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response.
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
          console.error("Fetch error:", error);
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