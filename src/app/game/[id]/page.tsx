"use client";

import { Loading } from "@/components/loading";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
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

let viewObj = {
  mineSweepers: mineSweepers,
  snake: snake,
  tetris: tetris,
};

const GameView = React.memo(
  function Page({ params }: { params: { id: string } }) {
    const router = useRouter();
    // @ts-ignore
    let Content = viewObj[params.id];

    useEffect(() => {
      const isGame = ["mineSweepers", "snake", "tetris"].includes(params.id);
      if (!isGame) router.push("/404");
    }, [params.id]);

    return (
      <div key={params.id} className='flex items-center justify-center'>
        <Content />
      </div>
    );
  },
  ({ params: prevParams }, { params: nextParams }) => {
    return prevParams.id === nextParams.id;
  },
);

export default GameView;
