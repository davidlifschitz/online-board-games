const CACHE_NAME='traingames-shell-v2';
const SHELL=[
  '/',
  '/index.html',
  '/play.html',
  '/build.html',
  '/leaderboard.html',
  '/open-source.html',
  '/styles.css',
  '/navigation.css',
  '/leaderboard.css',
  '/games.json',
  '/upstreams.json',
  '/site.js',
  '/play.js',
  '/auth-landing.js',
  '/build.js',
  '/leaderboard.js',
  '/train-games-icon.svg',
  '/train-games-icon-192.png',
  '/train-games-icon-512.png',
  '/train-games-icon-maskable-512.png',
  '/apple-touch-icon.png',
  '/manifest.webmanifest'
];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME&&key.startsWith('traingames-shell-')).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;
  const path=url.pathname;
  if(!SHELL.includes(path)&&path!=='/')return;
  event.respondWith(fetch(event.request).then(response=>{
    if(response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));}
    return response;
  }).catch(()=>caches.match(event.request).then(hit=>hit||caches.match(path==='/'?'/index.html':path))));
});
