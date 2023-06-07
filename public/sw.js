/// <reference no-default-lib="true"/>
/// <reference lib="es2015" />
/// <reference lib="webworker" />

// 使用了上的reference之后，此脚本和其他模块作用域隔离，无法引入其他模块

/**
 * @type {ServiceWorkerGlobalScope}
 */
// @ts-nocheck
const sw = self;

const VERSION = "pwa";

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

/**
 * 
 * @param {FetchEvent.request} request 
 * @param {Response} response 
 */
async function putInCache(request, response) {
  const cache = await caches.open(VERSION);
  if (cache) await cache.put(request, response);
}

/**
 * 
 * @param {FetchEvent.request} request 
 * @param {FetchEvent.preloadResponse} preloadResponsePromise 
 * @returns {Promise<Response>}
 */
async function cacheFirst(request, preloadResponsePromise) {
  const r = await caches.match(request);
  if (r) {
    return r;
  }
  let preloadResponse;
  if (preloadResponsePromise) {
    // why preloadResponse always be undefined????
    preloadResponse = await preloadResponsePromise;
    if (preloadResponse) {
      putInCache(request, preloadResponse.clone());
      return preloadResponse;
    }
  }

  const response = await fetchWIthTimeout(request, {}, 300);
  putInCache(request, response.clone());
  return response;
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

const installFilesEssential = [
  "./manifest.json",
  "./logo-72.webp",
  "./logo-144.webp",
];

sw.addEventListener("install", (e) => {
  console.log("[Service Worker] Install");
  e.waitUntil(
    (async () => {
      // await removeOldVersion(VERSION);
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

  if(sw.registration) {
    e.waitUntil(sw.registration?.navigationPreload.enable());
  }

  removeOldVersion(VERSION)
    .then(() => sw.clients.claim())
    .then(() => sw.skipWaiting());
});


sw.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  console.log("fetch event");
  e.respondWith(cacheFirst(e.request, e.preloadResponse));
});


sw.addEventListener("message", e => {
  // event is an ExtendableMessageEvent object
  console.log(`The client sent me a message: ${e.data}`);

  e.source.postMessage("Hi client");
})