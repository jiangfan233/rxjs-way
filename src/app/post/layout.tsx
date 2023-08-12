import { Layout } from "@/components/server-side/layout";
import "@/app/global.css";
import "github-markdown-css/github-markdown.css";
import "highlight.js/styles/github.css";

export const metadata = {
  title: "Programming Journal",
  description: "crazy thoughts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout childNodes={children} />;
}
