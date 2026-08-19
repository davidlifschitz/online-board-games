const CACHE='tilebound-v1';
const ASSETS=['./','./index.html','./THIRD_PARTY_NOTICES.md'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{if(event.request.method==='GET')event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request)))});
