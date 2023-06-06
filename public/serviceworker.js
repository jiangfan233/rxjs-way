const VERSION = "pwa" + new Date().getTime();

const installFilesEssential = [
  "./manifest.json",
  "./logo-72.webp",
  "./logo-144.webp",
];

// removeOldVersion().then((...rest) => console.log("remove", rest));

Notification.requestPermission().then((res) => console.log(res));

async function removeOldVersion() {
  return caches
    .keys()
    .then((keys) => keys.filter((key) => key !== VERSION))
    .then((keys) =>
      Promise.all(
        keys.map((k) => {
          caches.delete(k);
          return k;
        })
      )
    );
}

async function fetchWIthTimeout(url, options = {}, ms) {
  const ctrl = new AbortController();
  const id = setTimeout(() => {
    ctrl.abort();
  }, ms);
  const res = await fetch(url, { ...options, signal: ctrl.signal });
  if (res.status == 200) clearTimeout(id);
  return res;
}

self.addEventListener("install", (e) => {
  console.log("[Service Worker] Install");
  e.waitUntil(
    (async () => {
      await removeOldVersion();
      const cache = await caches.open(VERSION);
      console.log("[Service Worker] Caching all: app shell and content");
      await cache.addAll(installFilesEssential);
    })()
  );
});

self.addEventListener("activate", (e) => {
  // Be aware that this results in your service worker controlling pages
  // that loaded regularly over the network,
  // or possibly via a different service worker.
  console.log("activate");
  removeOldVersion()
    .then(() => self.clients.claim())
    .then(() => self.skipWaiting());
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;

  e.respondWith(
    (async () => {
      let activeUrl = "";
      const r = await caches.match(e.request);
      if (r) {
        activeUrl = e.request.url;
        return r;
      }
      const response = await fetchWIthTimeout(e.request, {}, 300);
      if (response.status != 200) {
        if (Notification.permission === "granted") {
          const n = new Notification("Slow network, go back");
          document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "visible") {
              // The tab has become visible so clear the now-stale Notification.
              n.close();
            }
          });
          window.location.href = activeUrl || "/";
        }
      }
      activeUrl = e.request.url;
      const cache = await caches.open(VERSION);
      if (cache) cache.put(e.request, response.clone());
      return response;
    })()
  );
});
