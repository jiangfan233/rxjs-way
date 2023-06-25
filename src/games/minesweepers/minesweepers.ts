import { Pos } from "../components/pos";
import { MaybeMine } from "./mine";

export enum Direction {
  Up = 0,
  UpRight,
  Right,
  RightDown,
  Down,
  LeftDown,
  Left,
  LeftUp,
}

export interface MineSpeeperTYpe {
  width: number;
  height: number;
  isFailed: boolean;
  positions: MaybeMine[][];
}

export class MineSweepers implements MineSpeeperTYpe {
  width: number;
  height: number;
  isFailed: boolean;
  mineCount: number;
  positions: MaybeMine[][];

  constructor(
    width: number,
    height: number,
    isFailed: boolean,
    mineCount: number,
    positions: MaybeMine[][]
  ) {
    this.width = width;
    this.height = height;
    this.isFailed = isFailed;
    this.mineCount = mineCount;
    this.positions = positions;
  }

  static default(width = 16, height = 30, mineCount = 20) {
    let positions: Array<Array<MaybeMine>> = Array(height)
      .fill(0)
      .map((_, y) =>
        Array(width)
          .fill(0)
          .map((_, x) => MaybeMine.grass(x, y))
      );
    let count = 0;
    while (count < mineCount) {
      // anti-pattern
      let maybeMine =
        positions[~~(Math.random() * height)][~~(Math.random() * width)];

      if (!maybeMine.isMine()) {
        maybeMine.toMine();
        count += 1;
      }
    }

    return new MineSweepers(width, height, false, mineCount, positions);
  }

  isMine(pos: Pos): Boolean {
    const maybeMine = this.getPosition(pos);
    return maybeMine.isMine();
  }

  isInBounds(pos: Pos): boolean {
    return (
      pos.x >= 0 && pos.x < this.width && pos.y >= 0 && pos.y < this.height
    );
  }

  getPosition(pos: Pos) {
    return this.positions[pos.y][pos.x];
  }

  iterDirection(): number[] {
    return [
      Direction.Up,
      Direction.Right,
      Direction.Down,
      Direction.Left,
      Direction.UpRight,
      Direction.LeftDown,
      Direction.RightDown,
      Direction.LeftUp,
    ];
  }

  next(pos: Pos, direction: Direction): Pos {
    switch (direction) {
      case Direction.Up || 0:
        return pos.add(Pos.new(0, -1));
      case Direction.UpRight || 1:
        return pos.add(Pos.new(1, -1));
      case Direction.Right || 2:
        return pos.add(Pos.new(1, 0));
      case Direction.RightDown || 3:
        return pos.add(Pos.new(1, 1));
      case Direction.Down || 4:
        return pos.add(Pos.new(0, 1));
      case Direction.LeftDown || 5:
        return pos.add(Pos.new(-1, 1));
      case Direction.Left || 6:
        return pos.add(Pos.new(-1, 0));
      case Direction.LeftUp || 7:
        return pos.add(Pos.new(-1, -1));
      default: {
        console.warn("where do you want to go ???", direction);
        return pos;
      }
    }
  }

  scan(startPos: MaybeMine) {
    if(startPos.isMarked) return;
    if (this.isMine(startPos)) {
      this.isFailed = true;
      startPos.isClickError = true;
      this.positions.forEach((row) => {
        row.forEach((maybeMine) => (maybeMine.isShow = true));
      });
      return;
    }
    this.search(startPos, []);
  }

  search(pos: Pos, scanned: Pos[] = []) {
    let queue = [pos];
    const dirs = this.iterDirection();

    while (queue.length) {
      let current = queue.shift()!;
      let count = 0;
      let tmp = [];
      for (let i = 0; i < dirs.length; i++) {
        let dir = dirs[i];
        let nextPos = this.next(current, dir);
        if (!this.isInBounds(nextPos)) continue;
        if (this.getPosition(nextPos).isMarked) continue;

        if (this.isMine(nextPos)) {
          count += 1;
        } else {
          tmp.push(nextPos);
        }
      }

      scanned.push(current);
      // if there is a mine near current,
      // just update the counts of mine, don't need to
      // dig deeper.
      this.getPosition(current).setValue(count);
      if (count <= 0) {
        tmp.forEach((pos) => {
          if (
            queue.every((posInQueue) => !posInQueue.eq(pos)) &&
            scanned.every((posScanned) => !posScanned.eq(pos))
          ) {
            queue.push(pos);
          }
        });
      }
    }
  }

  clone() {
    const { width, height, isFailed, mineCount, positions } = this;
    return new MineSweepers(width, height, isFailed, mineCount, positions);
  }

  iterPosition() {
    return this.positions.flatMap((arr) => arr.map((p) => p));
  }

  markedMineCount() {
    return this.mineCount - this.iterPosition().filter(
      (maybeMine) => maybeMine.isMarked
    ).length;
  }

  markMine(maybeMine: MaybeMine) {
    maybeMine.mark();
  }
}
export { MaybeMine };
