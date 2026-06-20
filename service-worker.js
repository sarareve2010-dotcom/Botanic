const CACHE_NAME='botadex-v5-clean-focused';
const ASSETS=['./','./index.html','./style.css','./manifest.json','./data.js','./expert.js','./pro-data.js','./app.js','./audit-ui.js','./pro-ui.js','./learn-plus.js','./plant-pro.js','./plant-bugfix.js','./common-plants.js','./dedupe-plants.js','./home-fix.js','./crosslinks.js','./install-app.js','./icon.svg'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;event.respondWith(caches.match(event.request).then(cached=>fetch(event.request).catch(()=>cached||caches.match('./index.html'))))});
