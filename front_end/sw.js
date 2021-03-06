const staticCacheName = 'site-static-v2';

const assets = [
    '/vendor/css/login.css',
    '/vendor/css/main.css',
    '/vendor/css/materialize.min.css',
    '/vendor/css/style2.css',
    '/vendor/css/styles.css',
    '/vendor/css/util.css',
    '/vendor/img/icons/icon-72x72.png',
    '/vendor/img/icons/icon-96x96.png',
    '/vendor/img/icons/icon-128x128.png',
    '/vendor/img/icons/icon-144x144.png',
    '/vendor/img/icons/icon-152x152.png',
    '/vendor/img/icons/icon-192x192.png',
    '/vendor/img/icons/icon-384x384.png',
    '/vendor/img/icons/icon-512x512.png',
    '/vendor/img/blueticket.png',
    '/vendor/img/facebook-logo-vermelho.svg',
    '/vendor/img/google-logo-vermelho.svg',
    '/vendor/img/greenticket.png',
    '/vendor/img/isi-ticket-logo.png',
    '/vendor/img/isi-ticket-logo.svg',
    '/vendor/img/orangeticket.png',
    '/vendor/img/purpleticket.png',
    '/vendor/img/qrcode.png',
    '/vendor/img/yellowticket.png',
    '/vendor/js/app.js',
    '/vendor/js/instascan.min.js',
    '/vendor/js/main.js',
    '/vendor/js/materialize.min.js',
    '/vendor/js/qrcode.js',
    '/vendor/js/ui.js',
    '/vendor/pages/fallback.html',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://code.iconify.design/1/1.0.4/iconify.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',    
];

// install event
self.addEventListener('install', evt => {
    //console.log('service worker installed');
    evt.waitUntil(
        caches.open(staticCacheName).then((cache) => {
            console.log('caching shell assets');
            cache.addAll(assets);
        })
    );
});

// activate event
self.addEventListener('activate', evt => {
    //console.log('service worker activated');
    evt.waitUntil(
        caches.keys().then(keys => {
            //console.log(keys);
            return Promise.all(keys
                .filter(key => key !== staticCacheName)
                .map(key => caches.delete(key))
            );
        })
    );
});

// fetch event
self.addEventListener('fetch', evt => {
    //console.log('fetch event', evt);
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request)
            /*.then(fetchRes => {
                return caches.open(dynamicCacheName).then(cache => {
                    cache.put(evt.request.url, fetchRes.clone());
                    // check cached items size
                    limitCacheSize(dynamicCacheName, 15);
                    return fetchRes;
                })
            });*/
        }).catch(() => {
            if (evt.request.url.indexOf('.html') > -1) {
                return caches.match('/vendor/pages/fallback.html');
            }
        })
    );
});