"use client";

import { Loading } from "@/components/loading";
import dynamic from "next/dynamic";
import { ComponentType, ReactNode, useEffect, useMemo, useState } from "react"


const tetrisView = dynamic(() => import("@/games/tetris/view"), {
    loading: () => <Loading size="4rem" />,
    ssr: true
});
const snakeView = dynamic(() => import("@/games/snake/view"), {
    loading: () => <Loading size="4rem" />,
    ssr: true
});
const mineSweeperView = dynamic(() => import("@/games/minesweepers/view"), {
    loading: () => <Loading size="4rem" />,
    ssr: true
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
    const [loading, setLoading] = useState(true);

    const isString = useMemo(() => Object.prototype.toString.call(Content).includes("String"), [Content]);

    useEffect(() => {
        const getContent = async (activeId: string) => {
            const gameView = gameViewArr.find(({ key }) => key === activeId);
            if (gameView) {
                setContent(gameView.comp);
                setLoading(false);
                return;
            }

            const res = await fetch(`/api?id=${activeId}`,
                {
                    method: "POST",
                    cache: "force-cache"
                })
            const { data, code } = await res.json();
            setContent(data.content);
            setLoading(false);
        }
        getContent(activeId);

        return () => setLoading(true);
    }, [activeId, gameViewArr, setLoading])

    return <div className="relative w-full flex justify-center">
        <div className={ (!loading && isString) ? "relative w-full markdown-body" : "absolute invisible -z-10"}
            dangerouslySetInnerHTML={{ __html: Content as string }}>
        </div>

        <div className={ (!loading && !isString) ? "relative w-fit" : "absolute invisible -z-10" }>
            {Content as ReactNode}
        </div>

        <div className={ loading ? "relative" : "absolute invisible -z-10" }>
            <Loading size="4rem" />
        </div>        
    </div>
}