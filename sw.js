const CACHE_NAME = 'quicktools-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/qr_code.html',
  '/cal_days.html',
  '/pwd.html',
  '/kitchen.html',
  '/styles.css',
  '/script.js',
  '/js/qr-generator.js',
  '/js/date-calculator.js',
  '/js/password-generator.js',
  '/js/kitchen.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js',
  'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css',
  'https://cdn.jsdelivr.net/npm/flatpickr',
  'https://cdn.jsdelivr.net/npm/flatpickr/dist/l10n/fr.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

