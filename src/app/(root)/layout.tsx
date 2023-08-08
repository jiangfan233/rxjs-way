"use client";

import { Loading } from "@/components/loading"
import dynamic from "next/dynamic"
import "@/app/global.css";
import { useState } from "react";
import "github-markdown-css/github-markdown-light.css";
import "highlight.js/styles/github.css";

// export const metadata = {
//   title: 'Programming Journey',
//   description: 'crazy thoughts',
// }


const DynamicHeader = dynamic(() => import("@/components/header"), {
  loading: () => <Loading size={"2rem"} />
})

const DynamicSider = dynamic(() => import("@/components/sider"), {
  loading: () => <Loading size={"4rem"} />
})

const DynamicContent = dynamic(() => import("@/components/page"), {
  loading: () => <Loading size={"2rem"} />,
  ssr: false
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const [isShowMenu, toggleMenu] = useState(true);

  const [activeId, handleIdChange] = useState("mineSweepers");

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Programming Journey</title>
        <meta name="description" content="crazy thoughts" />
      </head>
      <body>
        <div
          className="flex gap-2 items-start justify-center m-2"
        >
          <DynamicSider 
            isShowMenu={isShowMenu} 
            toggleMenu={toggleMenu} 
            activeId={activeId}
            handleIdChange={handleIdChange}
          />
          <div className="grow flex flex-col gap-2 items-center max-w-[60vw]">
            <DynamicHeader 
              isShowMenu={isShowMenu} 
              toggleMenu={toggleMenu}
            />
            <DynamicContent activeId={activeId} />
          </div>
        </div>
      </body>
    </html>
  )
}

