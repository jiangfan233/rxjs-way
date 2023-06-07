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
  registerNewSw,
  requestNotifyPermission,
} from "@lib/utils-pwa";

const MemoHead = React.memo(() => {
  return (
    <Head>
      <title>The Rxjs Way</title>
      <meta name="theme-color"/>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
  );
});

MemoHead.displayName = "MemoHead";

function MyApp({ Component, pageProps }: { Component: any; pageProps: any }) {
  useEffect(() => {
    if (!existServiceWorker()) return;

    (async () => {
      const scope = isProd() ? "/rxjs-way" : "./";
      
      let registration = await getRegistration(scope);
      
      if (!registration) return;
      requestNotifyPermission();

      navigator.serviceWorker.ready.then((regis) => {

        let serviceWorker = regis.active;
        serviceWorker?.postMessage(isDev() ? "DEV" : "PROD");

        navigator.serviceWorker.onmessage = function (e) {
          console.log("sw sent me: ", e.data);
        };
      });

      registration.addEventListener("updatefound", (e) => {
        // console.log("eee", e);
        registration!.installing &&
          registration!.installing.postMessage("UPDATE");
      });

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
