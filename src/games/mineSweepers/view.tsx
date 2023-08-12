import {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MineSweepers } from "./minesweepers";
import { MaybeMine } from "./mine";
import React from "react";

interface BlockViewInf {
  maybeMine: MaybeMine;
  blockRef: MutableRefObject<MaybeMine>;
}

enum GameStatus {
  Normal = "😀", // mouseup
  MouseDown = "😲",
  Failed = "😵",
  Success = "😎",
  Restart = "😀",
}

const MemoBlockView = React.memo(
  function blockView({ maybeMine, blockRef }: BlockViewInf) {
    let { isShow, isClickError } = maybeMine;
    return (
      <div
        key={maybeMine.asKey()}
        className='mine flex justify-center items-center p-[0.1rem]'
        onMouseDown={(_) => (blockRef.current = maybeMine)}
      >
        {maybeMine.toView()}

        <style jsx>{`
          .mine {
            border: 0.5px solid #40402d;
            background-color: ${isShow
              ? isClickError
                ? "red"
                : "#fffcfc"
              : "inherit"};
          }
        `}</style>
      </div>
    );
  },
  (prev, next) => {
    const {
      isShow: prevIsShow,
      value: prevValue,
      isMarked: prevIsMarked,
    } = prev.maybeMine;
    const {
      isShow: nextIsShow,
      value: nextValue,
      isMarked: currIsMarked,
    } = next.maybeMine;

    return (
      prevIsShow === nextIsShow &&
      nextValue === prevValue &&
      prevIsMarked === currIsMarked
    );
  },
);

const MineCountView = React.memo(({ mineCount }: { mineCount: number }) => (
  <span key={"minecount"} className={mineCount < 0 ? "text-red-500" : ""}>
    {mineCount.toString().padStart(3, "0")}
  </span>
));

MineCountView.displayName = "MineCountView";

const TimerView = React.memo(
  ({ gameStatus }: { gameStatus: GameStatus }) => {
    const [timeCount, setTimeCount] = useState<number>(0);
    const timerId = useRef<NodeJS.Timer | null>(null);

    useEffect(() => {
      if (
        gameStatus === GameStatus.Failed ||
        gameStatus === GameStatus.Success
      ) {
        clearInterval(timerId.current!);
        timerId.current = null;
        return;
      }
      if (timerId.current === null && gameStatus === GameStatus.Restart) {
        setTimeCount(0);
      }
      if (timerId.current != null) return;
      timerId.current = setInterval(() => {
        setTimeCount((t) => t + 1);
      }, 1000);

      return () => {};
    }, [setTimeCount, gameStatus]);

    return <span key={"timer"}>{timeCount.toString().padStart(3, "0")}</span>;
  },
  // (_, { gameStatus: nextGameStatus }) => {
  //   if (
  //     nextGameStatus === GameStatus.Failed ||
  //     nextGameStatus === GameStatus.Restart
  //   ) {
  //     return false;
  //   }
  //   return true;
  // }
);

TimerView.displayName = "TimerView";

export default function MineSweeperView() {
  const [mineSweeper, setMineSweeper] = useState(
    MineSweepers.default(10, 15, 20),
  );
  const blockRef = useRef<MaybeMine>(null) as MutableRefObject<MaybeMine>;

  const [gameStatus, setGameStatus] = useState(GameStatus.Normal);

  const handleMouseDown = useCallback(
    function (_: any) {
      if (mineSweeper.isFailed()) return;
      setGameStatus(GameStatus.MouseDown);
    },
    [mineSweeper, setGameStatus],
  );

  const handleMouseUp = useCallback(
    function (e: any) {
      if (mineSweeper.isFailed() || mineSweeper.isSuccess()) return;
      let maybeMine = blockRef.current;
      setGameStatus(GameStatus.Normal);
      switch (e.button) {
        // left button
        case 0: {
          setMineSweeper((m) => {
            m.scan(maybeMine);
            if (m.isFailed()) setGameStatus(GameStatus.Failed);
            if (m.isSuccess()) setGameStatus(GameStatus.Success);
            return m.clone();
          });
          break;
        }

        // right button
        case 2: {
          setMineSweeper((m) => {
            m.markMine(maybeMine);
            if (m.isSuccess()) setGameStatus(GameStatus.Success);
            return m.clone();
          });
          break;
        }
      }
    },
    [mineSweeper, setGameStatus, setMineSweeper],
  );

  const restart = useCallback(() => {
    setMineSweeper(MineSweepers.default(10, 15, 20));
    setGameStatus(GameStatus.Restart);
  }, [setMineSweeper]);

  const Emoji = useMemo(
    () => (
      <div className='cursor-pointer' onClick={restart}>
        {gameStatus}
      </div>
    ),
    [gameStatus, restart],
  );

  useEffect(() => {
    //去掉默认的contextmenu事件，否则会和右键事件同时出现。
    document.oncontextmenu = function (e) {
      e.preventDefault();
    };
  }, []);

  return (
    <div key='mineSweeper' className='game-container flex flex-col'>
      <div
        key='mineSweeper-header'
        className='mineSweeper-header flex justify-between'
      >
        <MineCountView mineCount={mineSweeper.markedMineCount()} />
        {Emoji}
        <TimerView gameStatus={gameStatus} />
      </div>

      <div
        key='mineSweeper-container'
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className='mineSweeper-container custom-scheme cursor-pointer'
      >
        {mineSweeper.iterPosition().map((maybeMine) => (
          <MemoBlockView
            key={`${maybeMine.x}-${maybeMine.y}`}
            maybeMine={maybeMine}
            blockRef={blockRef}
          />
        ))}
      </div>

      <style jsx>{`
        .mineSweeper-container {
          display: grid;
          grid-template-rows: repeat(${mineSweeper.height}, 1.8rem);
          grid-template-columns: repeat(${mineSweeper.width}, 1.8rem);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
