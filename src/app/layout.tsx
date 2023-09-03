import "@/app/globals.css";
import "github-markdown-css/github-markdown.css";
import "highlight.js/styles/github.css";
import { ContentWithCanvas } from "@/components/server-side/ContentWithCanvas";

export const metadata = {
  title: "Programming Journal",
  description: "crazy thoughts",
};

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html>
      <body className='relative'>
        <ContentWithCanvas>{children}</ContentWithCanvas>
      </body>
    </html>
  );
};

export default Layout;
