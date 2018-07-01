/* jshint esversion: 6*/
var cacheName = 'vv5';
// ssdds
self.addEventListener('install',  (e) =>{
    console.log("[serviceworker]installed");
    let arrlinks = [
        '/skeleton',
        'sw.js',
        'images/12.gif',
        'index.html',
        'css/app.css',
        'https://fonts.googleapis.com/css?family=Patua+One',
        'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js',
        'https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js',
        'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
        'https://free.currencyconverterapi.com/api/v5/currencies',
        'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js',
        'https://free.currencyconverterapi.com/api/v5/convert?q=USD_PHP&compact=y',
        'images/body.png'
    ];
    console.log("[serviceworker]installed");
    e.waitUntil(
        caches.open(cacheName)
        .then(cache => {
            for (const key in arrlinks) {
                cache.add(arrlinks[key]);
            }
        }).catch(err => {
            console.log(err);
        })
    );
});
self.addEventListener('activate', (e) =>  {
    console.log("activated");
    e.waitUntil(
        caches.keys().then(cacheNames =>{
             return  Promise.all(cacheNames.map((thiscacheName) =>{
                 if (thiscacheName != cacheName) {console.log('removing cache name' ,thiscacheName);
                return caches.delete(thiscacheName);
            }}));
        }).catch(err => console.log(err))
    );
});
self.addEventListener('fetch',  (e) =>{
     console.log("fetching", e.request.url);
    e.respondWith(
        caches.match(e.request).then(res => {
            if (res) {
                console.log("[service worker found] caches", e.request.url);
                return res;
            }
            let reqClone = e.request.clone();
          return fetch(reqClone).then(rescache =>{

            if (!rescache) {
                console.log("[service worker] no response from fetch");
                return rescache;                
            }

            var resClone = rescache.clone();
            caches.open(cacheName).then(cache =>{
                console.log("[service worker] new data", e.request.url);
                cache.put(e.request, resClone);
                return cache;
                
            }).catch(err => console.log("[service worker] err", err));
          }).catch(err => console.log("[service worker] err", err));
        })
  );

});
//    e.waitUntil(
//        caches.open(cacheName)
//        .then((result) => {
//            console.log('caching');
//            return result.addAll([
//                '/',
//                'sw.js',
//                'images/12.gif',
//                'index.html',
//                'css/app.css',
//                'https://fonts.googleapis.com/css?family=Patua+One',
//                'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js',
//                'https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js',
//                'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
//                'https://free.currencyconverterapi.com/api/v5/currencies',
//                'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js',
//                'https://free.currencyconverterapi.com/api/v5/convert?q=USD_PHP&compact=y',
//                'https://i.pinimg.com/originals/83/13/7f/83137f42640d91d22d6bd26001210f67.png'
//            ]);
//        }).catch((err) => {
//            console.log(err);

//        })
//    );