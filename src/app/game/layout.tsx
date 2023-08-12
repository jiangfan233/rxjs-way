import "@/app/global.css";
import "github-markdown-css/github-markdown.css";
import "highlight.js/styles/github.css";
import { Layout } from "@/components/server-side/layout";

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { params: { id: string } };
}) {
  return <Layout childNodes={children} />;
}
