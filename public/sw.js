/// <reference no-default-lib="true"/>
/// <reference lib="es2015" />
/// <reference lib="webworker" />


// import { fetchWIthTimeout, removeOldVersion } from "@lib/utils";


/**
 * @type {ServiceWorkerGlobalScope}
 */
const sw = self;


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

const VERSION = "pwa" + new Date().getTime();

const installFilesEssential = [
  "./manifest.json",
  "./logo-72.webp",
  "./logo-144.webp",
];

sw.addEventListener("install", (e) => {
  console.log("[Service Worker] Install");
  e.waitUntil(
    (async () => {
      await removeOldVersion(VERSION);
      const cache = await caches.open(VERSION);
      console.log("[Service Worker] Caching all: app shell and content");
      await cache.addAll(installFilesEssential);
    })()
  );
});

sw.addEventListener("activate", (e) => {
  // Be aware that this results in your service worker controlling pages
  // that loaded regularly over the network,
  // or possibly via a different service worker.
  console.log("activate");
  removeOldVersion(VERSION)
    .then(() => sw.clients.claim())
    .then(() => sw.skipWaiting());
});

sw.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    (async () => {
      const r = await caches.match(e.request);
      if (r) {
        return r;
      }
      const response = await fetchWIthTimeout(e.request, {}, 300);
      const cache = await caches.open(VERSION);
      if (cache) await cache.put(e.request, response.clone());
      return response;
    })()
  );
});