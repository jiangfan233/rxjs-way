import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pos } from "../components/pos";
import { GameBoard } from "./gameboard";
import { Direction } from "./snake";

const MemoBlock = React.memo(
  ({
    x,
    y,
    colorShape,
  }: {
    x: number;
    y: number;
    colorShape: string | null;
  }) => {
    return (
      <div
        className="flex justify-center items-center"
        key={`${x}-${y}`}
      >
        {colorShape}
      </div>
    );
  }
);

export default function SnakeView() {
  const [gameboard, setGameBoard] = useState(GameBoard.default(20, 20));
  const [direction, setDirection] = useState(Direction.Left);
  const timerRef = useRef<null | NodeJS.Timer>(null);

  const memoHandleKeyDown = useCallback(
    function handleKeyDown(this: Document, ev: globalThis.KeyboardEvent): void {
      let res: Boolean = false;
      switch (ev.code) {
        case "ArrowLeft":
          res = gameboard.tryMove(Direction.Left);
          res && setDirection(Direction.Left);
          break;
        case "ArrowRight":
          res = gameboard.tryMove(Direction.Right);
          res && setDirection(Direction.Right);
          break;
        case "ArrowUp":
          res = gameboard.tryMove(Direction.Up);
          res && setDirection(Direction.Up);
          break;
        case "ArrowDown":
          res = gameboard.tryMove(Direction.Down);
          res && setDirection(Direction.Down);
          break;
      }

      res && setGameBoard(gameboard.clone());
    },
    [gameboard, setGameBoard, direction, setDirection]
  );

  useEffect(() => {
    document.addEventListener("keydown", memoHandleKeyDown);
    return () => {
      document.removeEventListener("keydown", memoHandleKeyDown);
    };
  }, [memoHandleKeyDown]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      gameboard.tryMove(direction);
      setGameBoard(gameboard.clone());
    }, 500);
    return () => clearInterval(timerRef.current!);
  }, [direction, gameboard, setGameBoard]);

  return (
    <div
      className="game-container snake-container custom-scheme"
    >
      {Array(gameboard.height)
        .fill(null)
        .flatMap((_, y) =>
          Array(gameboard.width)
            .fill(null)
            .map((_, x) => (
              <MemoBlock
                key={x + "-" + y}
                x={x}
                y={y}
                colorShape={gameboard.getPosition(Pos.new(x, y))}
              />
            ))
        )}

      <style jsx>{`
        .snake-container {
          display: grid;
          grid-template-columns: repeat(${gameboard.width}, 1.5rem);
          grid-template-rows: repeat(${gameboard.height}, 1.5rem);
          width: fit-content;
        }
      `}</style>
    </div>
  );
}
