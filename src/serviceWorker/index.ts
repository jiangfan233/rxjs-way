import { isDev, isProd } from "@lib/utils";
import {
  existServiceWorker,
  getRegistration,
  removeAllCaches,
  requestNotifyPermission,
} from "@lib/utils-pwa";

export default async function pwaFunc() {
  if (!existServiceWorker()) return;

  if (isDev()) removeAllCaches();
  const scope = isProd() ? "/rxjs-way/*" : "./*";

  requestNotifyPermission();

  let { registration, status } = await getRegistration(scope);

  if (!registration) return;

  const handleBlur = (_?: Event) => {
    // registration?.active?.postMessage("blur");
    if (Notification.permission === "granted") {
      registration?.showNotification("Hi there!", {
        body: "Nice to meet you and have a good day~",

        actions: [
          {
            action: "close",
            title: "close",
          },
        ],
      });
    }
  };

  switch (status) {
    case "active":
      // registration.showNotification("")
      registration.update();

    case "installing":
      registration = await navigator.serviceWorker.ready;

    default:
      handleBlur();
      navigator.serviceWorker.onmessage = function (e) {
        if (e.data === null && e.data === undefined) return;
        console.log(e.data);
        switch (e.data) {
          case "off":
            // window.removeEventListener("blur", handleBlur);
            new Notification("Ok, I shut up...");
        }
      };

      // triggered by a new service worker script installing
      registration.addEventListener("updatefound", async (e) => {
        registration!.installing &&
          registration!.installing.postMessage("UPDATE");

        if (Notification.permission === "granted") {
          new Notification("New Version!", {
            body: "Click me to get a better experience.",
          }).addEventListener("click", (e) => {
            window.location.reload();
          });
        }
      });
  }
}
