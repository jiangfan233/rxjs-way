const VERSION = "pwa";

const installFilesEssential = ["../public/manifest.json", "../public/logo.png"];

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
      // ？？？ 这里是什么意思？
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if(!e.clientId) {
    console.log("no client");
    return;
  } 
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
