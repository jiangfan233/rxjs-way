import { isProd } from "./utils";

export const existServiceWorker = () =>
  navigator && "serviceWorker" in navigator;

export const requestNotifyPermission = async () => {
  if (Notification) {
    await Notification.requestPermission();
  }
  return Notification.permission;
};

export const registerNewSw = async (
  scriptURL: string | URL,
  options?: RegistrationOptions | undefined,
) => {
  if (!existServiceWorker()) return;
  try {
    const registration = await navigator.serviceWorker.register(
      scriptURL,
      options,
    );
    return registration;
  } catch (err) {
    console.warn(err);
  }
};

export const keepServiceWorker = (serviceWorker: ServiceWorker) => {
  const handler = (e: Event) => {
    if (e.target) {
      (e.currentTarget as ServiceWorker).onstatechange = null;
      serviceWorker = e.target as ServiceWorker;
      serviceWorker.addEventListener("statechange", handler);
    }
  };

  serviceWorker && serviceWorker.addEventListener("statechange", handler);
  return serviceWorker;
};

export const getRegistration = async (scope: string) => {
  let registration: ServiceWorkerRegistration | undefined;
  try {
    registration = await navigator.serviceWorker.getRegistration(scope);
    if (registration) return { registration, status: "active" };
    registration = await registerNewSw(isProd() ? "./sw.js" : "/sw.js");
    return { registration, status: "installing" };
  } catch (err) {
    console.error("get service worker registration error:", err);
  }

  return {};
};

export const getRegistrations = async () => {
  try {
    return await navigator.serviceWorker.getRegistrations();
  } catch (err) {
    console.error("get service worker registrations error: ", err);
  }
};

export async function removeAllCaches() {
  caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)));
}
