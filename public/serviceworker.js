const VERSION = "pwa";

const installFilesEssential = ["./manifest.json", "./logo.png"];

self.addEventListener("install", (e) => {
  console.log('[Service Worker] Install');
  e.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    console.log('[Service Worker] Caching all: app shell and content');
    await cache.addAll(installFilesEssential);
    
  })());
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      // 删除旧版本
      .then((keys) =>
        keys
          .filter((key) => key !== VERSION)
          .forEach((key) => caches.delete(key))
      )
      // Be aware that this results in your service worker controlling pages 
      //that loaded regularly over the network, 
      // or possibly via a different service worker.
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  
  if (e.request.method !== "GET") return;

  e.respondWith(
    (async () => {
      const r = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (r) return r;
      const response = await fetch(e.request);
      const cache = await caches.open(VERSION);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })()
  );
});
