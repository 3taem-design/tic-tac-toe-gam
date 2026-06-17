const CACHE_NAME = 'ax-tools-v1';
const ASSETS = [
    'index.html',
    'style.css',
    'app.js'
];

// تثبيت الكاش
self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
    self.skipWaiting(); // تجبر المتصفح على تفعيل النسخة الجديدة فوراً
});

// تفعيل النسخة الجديدة وحذف الكاش القديم
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null));
        })
    );
    self.clients.claim();
});

// تقديم الملفات من الكاش أو من الشبكة
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});
