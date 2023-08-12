import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pos } from "../components/pos";
import Tetris from "./tetris";

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
        className='flex justify-center items-center border-[1px] p-1 border-solid border-[#40402d]'
        key={`${x}-${y}`}
      >
        {colorShape}
      </div>
    );
  },
);

MemoBlock.displayName = "MemoBlock";

export default function TetrisView() {
  const [tetris, setTetris] = useState(new Tetris());
  const [speed, setSpeed] = useState(500);
  const timerRef = useRef<NodeJS.Timer | null>(null);

  const memoHandleKeyDown = useCallback(
    function handleKeyDown(this: Document, ev: globalThis.KeyboardEvent): void {
      if (ev.code === "ArrowDown") {
        setSpeed(50);
        return;
      }

      switch (ev.code) {
        case "ArrowLeft":
          tetris.shift("Left");
          break;
        case "ArrowRight":
          tetris.shift("Right");
          break;
        case "ArrowUp":
          tetris.rotate();
          break;
      }

      setTetris(tetris.clone());
    },
    [tetris, setSpeed, setTetris],
  );

  const memoHandleKeyUp = useCallback(function (
    this: Document,
    _: globalThis.KeyboardEvent,
  ): void {
    setSpeed(500);
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", memoHandleKeyDown);
    document.addEventListener("keyup", memoHandleKeyUp);
    return () => {
      document.removeEventListener("keydown", memoHandleKeyDown);
      document.removeEventListener("keyup", memoHandleKeyDown);
    };
  }, [memoHandleKeyDown, memoHandleKeyUp]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTetris((t) => {
        t.tick();
        return t.clone();
      });
    }, speed);
    return () => clearInterval(timerRef.current!);
  }, [setTetris, speed]);

  return (
    <div className='game-container tetris-container custom-scheme'>
      {Array(tetris.height)
        .fill(null)
        .flatMap((_, y) =>
          Array(tetris.width)
            .fill(null)
            .map((_, x) => (
              <MemoBlock
                key={x + "-" + y}
                x={x}
                y={y}
                colorShape={tetris.getTyp(Pos.new(x, y))}
              />
            )),
        )}

      <style jsx>{`
        .tetris-container {
          display: grid;
          grid-template-columns: repeat(${tetris.width}, 1.5rem);
          grid-template-rows: repeat(${tetris.height}, 1.5rem);
          width: fit-content;
        }
      `}</style>
    </div>
  );
}
