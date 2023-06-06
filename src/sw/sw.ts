

const pwaVersion = "pwa" + new Date().getTime();

const files = [
  "./manifest.json",
  "./logo-72.webp",
  "./logo-144.webp",
];

sw.addEventListener("install", (e) => {
  console.log("[Service Worker] Install");
  e.waitUntil(
    (async () => {
      // await removeOldVersion();
      const cache = await caches.open(pwaVersion);
      console.log("[Service Worker] Caching all: app shell and content");
      await cache.addAll(files);
    })()
  );
});

