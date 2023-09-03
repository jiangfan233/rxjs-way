"use client";

import { Loading } from "@/components/loading";
import React from "react";
import dynamic from "next/dynamic";

let mineSweepers = dynamic(() => import(`@/games/mineSweepers/view`), {
  loading: () => <Loading size='4rem' />,
  ssr: false,
});
let snake = dynamic(() => import(`@/games/snake/view`), {
  loading: () => <Loading size='4rem' />,
  ssr: false,
});
let tetris = dynamic(() => import(`@/games/tetris/view`), {
  loading: () => <Loading size='4rem' />,
  ssr: false,
});

export type GameViewId = "mineSweepers" | "snake" | "tetris";
type GameViewType = {
  [key in GameViewId]: React.ComponentType<{}>;
};

let viewObj: GameViewType = {
  mineSweepers,
  snake,
  tetris,
};

function GameView({ id }: { id: GameViewId }) {
  let Content = viewObj[id];

  return (
    <div key={id} className='flex items-center justify-center rounded-md'>
      <Content />
    </div>
  );
}

export default GameView;
