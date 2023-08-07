"use client";

import { Loading } from "@/components/loading"
import dynamic from "next/dynamic"
import "@/app/global.css";
import { ComponentType, useMemo, useState } from "react";
import { ViewObj } from "./types";

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

const DynamicContent = dynamic(() => import("@/app/(root)/page"), {
  loading: () => <Loading size={"2rem"} />
})

const tetrisView = dynamic(() => import("@/games/tetris/view"), {
  loading: () => <Loading size="4rem" />
});
const snakeView = dynamic(() => import("@/games/snake/view"), {
  loading: () => <Loading size="4rem" />
});
const mineSweeperView = dynamic(() => import("@/games/minesweepers/view"), {
  loading: () => <Loading size="4rem" />
});



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const [isShowMenu, toggleMenu] = useState(true);

  const gameViewArr = useMemo(
    () => [
      { key: "mineSweeper", comp: mineSweeperView },
      { key: "tetris", comp: tetrisView },
      { key: "snake", comp: snakeView },
    ],
    [tetrisView, snakeView, mineSweeperView]
  );

  const [gameView, setGameView] = useState<ViewObj>(gameViewArr[0]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Programming Journey</title>
        <meta name="description" content="crazy thoughts" />
      </head>
      <body>
        <div
          className="flex gap-2 items-start justify-start m-2"
        >
          <DynamicSider 
            isShowMenu={isShowMenu} 
            toggleMenu={toggleMenu} 
            gameViewArr={gameViewArr}
            setView={setGameView}
            gameView={gameView}
          />
          <div className="grow flex flex-col gap-2 items-center">
            <DynamicHeader 
              isShowMenu={isShowMenu} 
              toggleMenu={toggleMenu}
            />
            <DynamicContent content={gameView} />
          </div>
        </div>
      </body>
    </html>
  )
}

