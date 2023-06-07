// import App from 'next/app'
import { ClientOnly } from "@/app/components/clientOnly";
import Head from "next/head";
import React, { useEffect } from "react";
import { isProd } from "@lib/utils";

import "@/app/globals.css";
import "github-markdown-css/github-markdown-light.css";
import "highlight.js/styles/github.css";
import "@public/logo-72.webp";
import "@public/logo-144.webp";

const MemoHead = React.memo(() => {
  return (
    <Head>
      <title>The Rxjs Way</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
  );
});

MemoHead.displayName = "MemoHead";

function MyApp({ Component, pageProps }: { Component: any; pageProps: any }) {
  useEffect(() => {
    // Registering Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register(
          // isProd() ? "./serviceworker.js" : "/serviceworker.js",
          isProd() ? "./sw.js" : "/sw.js"
        )
        .then((registration) => {
          Notification.requestPermission().then((res) => {
            if (Notification.permission === "granted") {
              new Notification("Hi there!", { body: "Good to see you!" });
            }
          });

          registration.addEventListener("updatefound", (e) => {
            // console.log("eee", e);
          });

          

          let serviceWorker;
          if (registration.installing) {
            serviceWorker = registration.installing;
          } else if(registration.active) {
            serviceWorker = registration.active;
          }
          if(!serviceWorker) return;
          
          serviceWorker.addEventListener("message", (event) => {
            // event is a MessageEvent object
            console.log(`The service worker sent me a message: ${event.data}`, JSON.stringify(event));
          });

          // navigator.serviceWorker.ready.then((regis) => {
          //   registration.active.postMessage("Hi service worker");
          // });
          serviceWorker.postMessage("Hi service worker!");
        });
    }
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
