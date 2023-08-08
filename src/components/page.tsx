"use client";

import { Loading } from "@/components/loading";
import dynamic from "next/dynamic";
import { ComponentType, useEffect, useMemo, useState } from "react"


const tetrisView = dynamic(() => import("@/games/tetris/view"), {
    loading: () => <Loading size="4rem" />
});
const snakeView = dynamic(() => import("@/games/snake/view"), {
    loading: () => <Loading size="4rem" />
});
const mineSweeperView = dynamic(() => import("@/games/minesweepers/view"), {
    loading: () => <Loading size="4rem" />
});

export default function PageContent({ activeId }: { activeId: string }) {

    const gameViewArr = useMemo(
        () => [
            { key: "mineSweepers", comp: mineSweeperView },
            { key: "tetris", comp: tetrisView },
            { key: "snake", comp: snakeView },
        ],
        []
    );

    const [Content, setContent] = useState<string | ComponentType>("");

    useEffect(() => {
        console.log(activeId)
        const getContent = async (activeId: string) => {
            const gameView = gameViewArr.find(({ key }) => key === activeId);
            if (gameView) {
                setContent(gameView.comp);
                return;
            }

            const res = await fetch(`/api?id=${activeId}`,
                {
                    method: "POST",
                })
            const { data, code } = await res.json();
            setContent(data.content);
        }
        getContent(activeId);
    }, [activeId, gameViewArr])

    return <>
        {Object.prototype.toString.call(Content).includes("String")
            ? <div className="w-full markdown-body global-header"
                dangerouslySetInnerHTML={{ __html: Content as string }}>
            </div>
            : Content}
    </>
}