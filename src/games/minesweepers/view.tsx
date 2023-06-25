import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MineSweepers } from "./minesweepers";
import { MaybeMine } from "./minesweepers";
import React from "react";

interface BlockViewInf {
  maybeMine: MaybeMine;
  handleClick: Function;
}

enum GameStatus {
  Normal = "😀", // mouseup
  MouseDown = "😲",
  Failed = "😵",
  Success = "😎",
  Restart = "😀",
}

const MemoBlockView = React.memo(
  function blockView({ maybeMine, handleClick }: BlockViewInf) {
    let { isShow, isClickError } = maybeMine;
    return (
      <>
        <div
          key={maybeMine.asKey()}
          className="mine flex justify-center items-center p-[0.1rem]"
          onClick={(event: any) => handleClick(event, maybeMine)}
          onAuxClick={(event: any) => handleClick(event, maybeMine)}
        >
          {maybeMine.toView()}

          <style jsx>{`
            .mine {
              border: 1px solid #d6d6ae;
              background-color: ${isShow
                ? isClickError
                  ? "red"
                  : "#fffcfc"
                : "inherit"}
            }
          `}</style>
        </div>
      </>
    );
  },
  (prev, next) => {
    if (prev.handleClick !== next.handleClick) return false;
    const { isShow: prevIsShow, value: prevValue } = prev.maybeMine;
    const { isShow: nextIsShow, value: nextValue } = next.maybeMine;

    return prevIsShow === nextIsShow && nextValue === prevValue;
  }
);

const MineCountView = React.memo(({ mineCount }: { mineCount: number }) => (
  <span key={"minecount"}>{mineCount.toString().padStart(3, "0")}</span>
));

MineCountView.displayName = "MineCountView";

const TimerView = React.memo(
  ({ gameStatus }: { gameStatus: GameStatus }) => {
    const [timeCount, setTimeCount] = useState<number>(0);
    const timerId = useRef<NodeJS.Timer | null>(null);

    useEffect(() => {
      if (gameStatus === GameStatus.Failed) {
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

    return (
      <span key={"timer"}>{timeCount.toString().padStart(3, "0")}</span>
    );
  },
  (_, { gameStatus: nextGameStatus }) => {
    if (
      nextGameStatus === GameStatus.Failed ||
      nextGameStatus === GameStatus.Restart
    ) {
      return false;
    }
    return true;
  }
);

TimerView.displayName = "TimerView";

export default function MineSweeperView() {
  const [mineSweeper, setMineSweeper] = useState(
    MineSweepers.default(10, 15, 20)
  );

  const [gameStatus, setGameStatus] = useState(GameStatus.Normal);

  const handleClick = useCallback(
    (e: any, maybeMine: MaybeMine) => {
      e.preventDefault();
      if (mineSweeper.isFailed) return;
      switch (e.button) {
        // left button
        case 0: {
          setMineSweeper((m) => {
            m.scan(maybeMine);
            if (m.isFailed) {
              setGameStatus(GameStatus.Failed);
            }
            return m.clone();
          });
          return;
        }

        // right button
        case 2: {
          mineSweeper.markMine(maybeMine);
          setMineSweeper(mineSweeper.clone());
        }
      }
    },
    [mineSweeper, setMineSweeper]
  );

  const handleMouseDown = useCallback(
    function () {
      if (mineSweeper.isFailed) return;
      setGameStatus(GameStatus.MouseDown);
    },
    [mineSweeper, setGameStatus]
  );

  const handleMouseUp = useCallback(
    function () {
      if (mineSweeper.isFailed) {
        setGameStatus(GameStatus.Failed);
      } else {
        setGameStatus(GameStatus.Normal);
      }
    },
    [mineSweeper]
  );

  const restart = useCallback(() => {
    setMineSweeper(MineSweepers.default(10, 15, 20));
    setGameStatus(GameStatus.Restart);
  }, [setMineSweeper]);

  const Emoji = useMemo(
    () => (
      <div className="cursor-pointer" onClick={restart}>
        {gameStatus}
      </div>
    ),
    [gameStatus, restart]
  );

  useEffect(() => {
    //去掉默认的contextmenu事件，否则会和右键事件同时出现。
    document.oncontextmenu = function (e) {
      e.preventDefault();
    };
  }, []);

  return (
    <div
      key="mineSweeper"
      className="game-container custom-scheme flex flex-col"
    >
      <div
        key="mineSweeper-header"
        className="mineSweeper-header flex justify-between"
      >
        <MineCountView mineCount={mineSweeper.markedMineCount()} />
        {Emoji}
        <TimerView gameStatus={gameStatus} />

      </div>

      <div
        key="mineSweeper-container"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className="mineSweeper-container cursor-pointer"
      >
        {mineSweeper.iterPosition().map((maybeMine) => (
          <>
            <MemoBlockView
              key={`${maybeMine.x}-${maybeMine.y}`}
              maybeMine={maybeMine}
              handleClick={handleClick}
            />
          </>
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
