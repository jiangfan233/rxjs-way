import Document, {
  Html,
  Head,
  Main,
  DocumentContext,
  NextScript
} from "next/document";
import React from "react";
import { isProd } from "@lib/utils";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const originalRenderPage = ctx.renderPage;

    // Run the React rendering logic synchronously
    ctx.renderPage = () =>
      originalRenderPage({
        // Useful for wrapping the whole react tree
        enhanceApp: (App: any) => App,
        // Useful for wrapping in a per-page basis
        enhanceComponent: (Component: any) => Component,
      });

    // Run the parent `getInitialProps`, it now includes the custom `renderPage`
    const initialProps = await Document.getInitialProps(ctx);

    return initialProps;
  }

  render() {
    return (
      <Html lang="cn">
        <Head>
          <link
            rel="manifest"
            href={isProd() ? "./manifest.json" : "/manifest.json"}
          />
        </Head>
        <body>
          <Main />
        </body>
        {/* 用来加载nextjs页面脚本，否则运行不正常 */}
        <NextScript />
      </Html>
    );
  }
}

export default MyDocument;
