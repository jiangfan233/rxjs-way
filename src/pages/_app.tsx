// import App from 'next/app'
import { ClientOnly } from "@/app/components/clientOnly";
import Head from "next/head";
import React, { useEffect } from "react";
import { isDev, isProd } from "@lib/utils";

import "@/app/globals.css";
import "github-markdown-css/github-markdown-light.css";
import "highlight.js/styles/github.css";
import "@public/logo-72.webp";
import "@public/logo-144.webp";
import {
  existServiceWorker,
  getRegistration,
  getRegistrations,
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

    (async () => {

      await removeAllCaches();
      const scope = isProd() ? "/rxjs-way/*" : "./*";
      const regs = await getRegistrations();
      regs?.filter(reg => reg.scope !== scope).forEach(async(reg) => await reg.unregister());

      requestNotifyPermission();

      let { registration, status } = await getRegistration(scope);

      if (!registration) return;

      const handleBlur = (_?: Event) => {
        // registration?.active?.postMessage("blur");
        if(Notification.permission === "granted") {
          registration?.showNotification("Hi there!", {
            body: "Nice to meet you and have a good day~",
            
            actions: [
              {
                action: "close",
                title: "close"
              }
            ]
          })
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
            switch(e.data) {
              case "off":
                // window.removeEventListener("blur", handleBlur);
                new Notification("Ok, I shut up...")
            }
          };

          // triggered by a new service worker script installing
          registration.addEventListener("updatefound", async (e) => {
            console.log("update found");

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

      return () => window.removeEventListener("blur", handleBlur);
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
