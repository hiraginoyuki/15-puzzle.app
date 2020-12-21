importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.0.2/workbox-sw.js');

 workbox.routing.registerRoute(
   ({ request }) => request.mode === 'navigate',
   new workbox.strategies.NetworkFirst({
     cacheName: 'pages',
   }),
 );

 workbox.routing.registerRoute(
   ({ request }) =>
     request.destination === 'style' ||
     request.destination === 'script' ||
     request.destination === 'worker',
   new workbox.strategies.NetworkFirst({
     cacheName: 'assets',
   }),
 );

 workbox.routing.registerRoute(
   ({ request }) => request.destination === 'image',
   new workbox.strategies.CacheFirst({
     cacheName: 'images',
   }),
 ); 