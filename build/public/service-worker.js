"use strict";
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.0.2/workbox-sw.js');
workbox.routing.registerRoute(function (_a) {
    var request = _a.request;
    return request.mode === 'navigate';
}, new workbox.strategies.NetworkFirst({
    cacheName: 'pages',
}));
workbox.routing.registerRoute(function (_a) {
    var url = _a.url;
    return url.host === 'unpkg.com';
}, new workbox.strategies.CacheFirst({
    cacheName: 'assets',
}));
workbox.routing.registerRoute(function (_a) {
    var request = _a.request;
    return request.destination === 'style' ||
        request.destination === 'script' ||
        request.destination === 'worker';
}, new workbox.strategies.NetworkFirst({
    cacheName: 'assets',
}));
workbox.routing.registerRoute(function (_a) {
    var request = _a.request;
    return request.destination === 'image';
}, new workbox.strategies.CacheFirst({
    cacheName: 'images',
}));
//# sourceMappingURL=service-worker.js.map