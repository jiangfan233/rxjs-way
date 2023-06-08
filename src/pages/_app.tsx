// import App from 'next/app'
import { ClientOnly } from "@/app/components/clientOnly";
import Head from "next/head";
import React, { useEffect } from "react";
import { debounce, isDev, isProd } from "@lib/utils";

import "@/app/globals.css";
import "github-markdown-css/github-markdown-light.css";
import "highlight.js/styles/github.css";
import "@public/logo-72.webp";
import "@public/logo-144.webp";
import {
  existServiceWorker,
  getRegistration,
  removeAllCaches,
  requestNotifyPermission,
} from "@lib/utils-pwa";

const MemoHead = React.memo(() => {
  return (
    <Head>
      <title>The Rxjs Way</title>
      <meta name="theme-color" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
  );
});

MemoHead.displayName = "MemoHead";

function MyApp({ Component, pageProps }: { Component: any; pageProps: any }) {
  useEffect(() => {
    if (!existServiceWorker()) return;

    if (isDev()) {
      removeAllCaches();
    }

    (async () => {
      requestNotifyPermission();
      const scope = isProd() ? "/rxjs-way/*" : "./*";

      let { registration, status } = await getRegistration(scope);

      if (!registration) return;

      switch (status) {
        case "active":
        // registration.showNotification("")

        case "installing":
          registration = await navigator.serviceWorker.ready;

        default:
          navigator.serviceWorker.onmessage = function (e) {
            if (e.data === null && e.data === undefined) return;
            switch (e.data) {
              // system-level notification
              case "unfocus-blur":
                return registration?.showNotification("I miss you.", {
                  body: "You need to come back.",
                  dir: "ltr",
                  actions: [
                    {
                      action: "focus",
                      title: "Go back",
                    },
                    {
                      action: "close",
                      title: "Close",
                    },
                  ],
                });
              case "unfocus-schedule":
                return new Notification("So the love lost...").addEventListener("click", () => {
                  registration?.active?.postMessage("focus-back");
                })
              default:
                console.log("sw sent me:", e.data);
            }
          };

          // triggered by a new service worker script installing
          registration.addEventListener("updatefound", async (e) => {
            if (registration === e.target) return;

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

          window.addEventListener("blur", (_: Event) => {
            document.title = "><";
            registration?.active?.postMessage("blur");
          });

          window.addEventListener("focus", (e) => {
            registration?.active?.postMessage("focus");
            document.title = "The Rxjs Way";
            // window.addEventListener("blur", handleBlur);
          });
      }
    })();
  }, []);

  return (
    <>
      <MemoHead />
      <ClientOnly>
        <Component {...pageProps} />
      </ClientOnly>
    </>
  );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp;
