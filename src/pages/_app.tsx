// import App from 'next/app'

import { ClientOnly } from "@/app/components/clientOnly";
import Head from "next/head";
import React from "react";
import "@/app/globals.css";
import "github-markdown-css/github-markdown-light.css";
import "highlight.js/styles/github.css";

const MemoHead = React.memo(() => {
  return (
    <Head>
      <title>The Rxjs Way</title>
    </Head>
  );
});

MemoHead.displayName = "MemoHead";

function MyApp({ Component, pageProps }: { Component: any; pageProps: any }) {
  return (
    <>
      <MemoHead />
      <ClientOnly>
        <Component {...pageProps} />
        {/* <Layout>
          </Layout> */}
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
