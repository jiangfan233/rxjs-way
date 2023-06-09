/// <reference no-default-lib="true"/>
/// <reference lib="es2015" />
/// <reference lib="webworker" />

// 使用了上的reference之后，此脚本和其他模块作用域隔离，无法引入其他模块

/**
 * @type {ServiceWorkerGlobalScope}
 */
// @ts-nocheck
const sw = self;

const VERSION = "pwa1.2";

// let timerId;

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
 * @param {string} cacheName
 */
async function putInCache(request, response, cacheName) {
  const cache = await caches.open(cacheName);
  if (cache) await cache.put(request, response);
}

/**
 * fetch simple implement.
 * @param {FetchEvent.request} request
 * @param {FetchEvent.preloadResponse} preloadResponsePromise
 * @returns {Promise<Response>}
 */
async function fetchAndCache(request, preloadResponsePromise) {
  if (preloadResponsePromise) {
    // why preloadResponse always be undefined????
    try {
      let preloadResponse = await preloadResponsePromise;
      if (preloadResponse) {
        putInCache(request, preloadResponse.clone(), VERSION);
        return preloadResponse;
      }
    } catch (err) {
      console.log(err);
    }
  }
  try {
    const response = await fetchWIthTimeout(request, {}, 1000);
    putInCache(request, response.clone(), VERSION);
    return response;
  } catch (err) {
    console.warn(err);
  }
  return new Response("Sorry, the page is gone...");
}

/**
 * cache then fetch, simple implement.
 * @param {FetchEvent.request} request
 * @param {FetchEvent.preloadResponse} preloadResponsePromise
 * @returns {Promise<Response>}
 */
async function getResponse(request, preloadResponsePromise) {
  const r = await caches.match(request);
  if (r) {
    setTimeout(() => {
      fetchAndCache(request, preloadResponsePromise);
    }, 0);
    return r;
  }
  return await fetchAndCache(request, preloadResponsePromise);
}

async function fetchWIthTimeout(url, options = {}, ms) {
  const ctrl = new AbortController();
  const id = setTimeout(() => {
    try{
      ctrl.abort();
    } catch(err) {
      console.log("abort fetch", err);
    }
  }, ms);
  const res = await fetch(url, { ...options, signal: ctrl.signal });
  if (res.status == 200) clearTimeout(id);
  return res;
}

async function getWindowClients() {
  try {
    return sw.clients.matchAll({
      type: "window",
    });
  } catch (err) {
    console.log("getWindowClients error", err);
  }
}

/**
 *
 * @param {"schedule" | "blur"} type
 */
function checkFocused(type = "schedule") {
  getWindowClients().then((clientList) => {
    if(clientList.length > 0) clientList[0].postMessage("unfocus-" + type);
    // clientList.forEach((client) => {
    //   if ("focus" in client && client.visibilityState === "hidden") {
    //     client.postMessage("unfocus-" + type);
    //     if (type === "schedule") clearInterval(timerId);
    //   }
    // });
  });
}

// seems only opening window or being focused by system-level notifications
// function befocusd() {
//   getWindowClients().then((clientList) => {
//     clients.openWindow("/");
//     if (clientList.length === 0) {
//       return;
//     }
//     let url = "/";
//     for (const client of clientList) {
//       if ("focus" in client) {
//         url = client.url;
//         client.focus()
//           .catch(err => console.warn(err))
//       }
//     }
//   });
// }

/**
 *
 * @param {Function} callback
 * @param {number} ms
 * @param  {...any} args
 * @returns NodeJS.Timer
 */
function runTimer(callback = checkFocused, ms = 300, ...args) {
  return setInterval(() => {
    callback.apply(null, args);
    // clearInterval(id);
  }, ms);
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

sw.addEventListener("activate", async (e) => {
  // Be aware that this results in your service worker controlling pages
  // that loaded regularly over the network,
  // or possibly via a different service worker.
  console.log("activate");
  if (sw.registration) {
    e.waitUntil(sw.registration?.navigationPreload.enable());
  }
  await removeOldVersion(VERSION);
  await sw.clients.claim();
  await sw.skipWaiting();
});

sw.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  try {
    e.respondWith(getResponse(e.request, e.preloadResponse));
  } catch (error) {
    console.error("fetchEvent:", err);
  }
});

sw.addEventListener("message", (e) => {
  // event is an ExtendableMessageEvent object
  // The simplest model of communcation between the main thread and the serviceWorker thread.
  console.log(`The client sent me a message: ${e.data}`);
  // e.source.postMessage("Hi client");

  switch (e.data) {
    case "UPDATE":
      removeOldVersion();
      return;
    case "blur":
      checkFocused("blur");
      return;
    case "focus":
      sw.clients.claim();
      return;
    case "focus-back":
      // e.waitUntil(
      //   // clearInterval(timerId);
      //   // befocusd()
      //   // timerId = runTimer();
      // );
      return;
    default:
    // checkFocused();
  }
});

sw.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(
    getWindowClients().then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          if (event.action === "close") {
            client.postMessage("off");
            return;
          }
          return client.focus();
        }
      }
      if (event.action !== "close" && clients.openWindow) return clients.openWindow("/");
    })
  );
});
