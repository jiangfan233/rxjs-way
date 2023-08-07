import Sider from "@/components/sider";
import { Loading } from "@/components/loading";
import { FileStructure, getDirStructure, getFileContent } from "@lib/post";
import {
  ReactNode,
  SetStateAction,
  Suspense,
  useCallback,
  useMemo,
  useState,
} from "react";
import React from "react";
import { JSX } from "react/jsx-runtime";
import "@/app/globals.css";

const SnakeView = React.lazy(() => import("@/games/snake/view"));
const TetrisView = React.lazy(() => import("@/games/tetris/view"));
const MineSweeperView = React.lazy(() => import("@/games/minesweepers/view"));

interface ViewObj {
  key: string;
  comp: SetStateAction<JSX.Element>;
}

export const getStaticProps = () => {
  return {
    props: {
      menuArray: getDirStructure(),
    },
  };
};

export default function Game({ menuArray }: { menuArray: FileStructure[] }) {
  const tetrisView = useMemo(() => <TetrisView />, []);
  const snakeView = useMemo(() => <SnakeView />, []);
  const mineSweeperView = useMemo(() => <MineSweeperView />, []);

  const ViewArr = useMemo(
    () => [
      { key: "mineSweeper", comp: mineSweeperView },
      { key: "tetris", comp: tetrisView },
      { key: "snake", comp: snakeView },
    ],
    [tetrisView, snakeView, mineSweeperView]
  );

  const [view, setView] = useState<ViewObj>(ViewArr[0]);

  const handleClick = useCallback(
    (e: MouseEvent, viewObj: ViewObj) => {
      e.preventDefault();
      setView(viewObj);
      document.documentElement.focus();
    },
    [setView]
  );

  const radios = (
    <ul className="radios custom-scheme pr-2 list-disc p-1">
      {ViewArr.map((viewObj) => (
        <li key={viewObj.key}>
          <label className="cursor-pointer">
            <button
              className={
                "px-1 rounded-lg " +
                (viewObj.key === view.key
                  ? "border-indigo-300 border-2 border-solid bg-indigo-400 text-white"
                  : "")
              }
              name="selector"
              onClick={(e: any) => handleClick(e, viewObj)}
            >
              {viewObj.key}
            </button>
          </label>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <div className="flex">
        <Suspense fallback={<Loading />}>
          <Sider menuArray={menuArray} />
        </Suspense>
        <div className="bg-yellow-100 w-full flex flex-col gap-4 items-center p-4">
          {radios}
          {/* should be a Loading component */}
          <Suspense fallback={<Loading />}>{view.comp as ReactNode}</Suspense>
        </div>
      </div>
    </>
  );
}
