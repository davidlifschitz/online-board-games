const CACHE_NAME='traingames-shell-v3';
const BASE_URL=new URL('./',self.location.href);
const SHELL_FILES=[
  '',
  'index.html',
  'play.html',
  'build.html',
  'leaderboard.html',
  'open-source.html',
  'styles.css',
  'navigation.css',
  'leaderboard.css',
  'games.json',
  'upstreams.json',
  'site.js',
  'play.js',
  'auth-landing.js',
  'build.js',
  'leaderboard.js',
  'train-games-icon.svg',
  'train-games-icon-192.png',
  'train-games-icon-512.png',
  'train-games-icon-maskable-512.png',
  'apple-touch-icon.png',
  'manifest.webmanifest'
];
const SHELL_URLS=SHELL_FILES.map(path=>new URL(path,BASE_URL).href);
const SHELL_PATHS=new Set(SHELL_URLS.map(url=>new URL(url).pathname));
const ROOT_PATH=BASE_URL.pathname;
const INDEX_URL=new URL('index.html',BASE_URL).href;
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(SHELL_URLS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME&&key.startsWith('traingames-shell-')).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;
  if(!SHELL_PATHS.has(url.pathname))return;
  event.respondWith(fetch(event.request).then(response=>{
    if(response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));}
    return response;
  }).catch(()=>caches.match(event.request).then(hit=>{
    if(hit)return hit;
    const fallback=url.pathname===ROOT_PATH?INDEX_URL:new URL(url.pathname,url.origin).href;
    return caches.match(fallback);
  })));
});