const CACHE_NAME = 'ax-tools-v2'; // قمت بتغيير الإصدار لـ v2 ليتم تحديث الكاش
const ASSETS = [
    '/',
    'index.html',
    'style.css',
    'app.js',
    'icons/icon-archive-folder.png',
    'icons/icon-downloading.png',
    'icons/icon-email.png',
    'icons/icon-home.png',
    'icons/icon-more.png',
    'icons/icon-numbers.png',
    'icons/icon-play.png',
    'icons/icon-settings.png',
    'icons/icon-tools.png',
    'icons/icon-trading.png',
    'icons/icon-user.png'
];

// تثبيت الكاش
self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
    self.skipWaiting();
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
