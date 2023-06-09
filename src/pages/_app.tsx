// import App from 'next/app'
import Head from "next/head";
import React, { Suspense, useEffect } from "react";

import "@/app/globals.css";
import "github-markdown-css/github-markdown-light.css";
import "highlight.js/styles/github.css";
import "@public/logo-72.webp";
import "@public/logo-144.webp";
import pwaFunc from "@/serviceWorker";
import { Loading } from "@/app/components/loading";

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

const ClientOnly = React.lazy(() => import("@/app/components/clientOnly"));


function MyApp({ Component, pageProps }: { Component: any; pageProps: any }) {

  useEffect(() => {
    pwaFunc();
  }, []);

  return (
    <>
      <MemoHead />
      <Suspense fallback={<Loading />}>
        <ClientOnly>
          <Component {...pageProps} />
        </ClientOnly>
      </Suspense>
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
