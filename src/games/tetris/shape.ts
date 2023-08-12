import { Pos } from "../components/pos";

export interface ShapeType {
  typ: string;
  positions: Set<Pos>;
  anchor: Pos;
  get(pos: Pos): Pos | undefined;
  isColliding(posArray: Pos[]): boolean;
  add(otherPos: Pos): Shape;
  remove(y: number): void;
  rotate(): Shape;
}

export class Shape implements ShapeType {
  typ: string;
  positions: Set<Pos>;
  anchor: Pos;

  constructor(typ: string, positions: Set<Pos>, anchor: Pos) {
    this.typ = typ;
    this.positions = positions;
    this.anchor = anchor;
  }

  static shapeFactory(idx: number) {
    const pos = Pos.new;
    switch (idx) {
      case 0:
        // i
        return new Shape(
          "🟥",
          new Set([pos(0, 0), pos(1, 0), pos(2, 0), pos(3, 0)]),
          pos(1, 0),
        );
      case 1:
        // o
        return new Shape(
          "🟧",
          new Set([pos(0, 0), pos(1, 0), pos(0, 1), pos(1, 1)]),
          pos(1, 0),
        );
      case 2:
        // j
        return new Shape(
          "🎃",
          new Set([pos(1, 0), pos(1, 1), pos(1, 2), pos(0, 2)]),
          pos(1, 1),
        );
      case 3:
        // l
        return new Shape(
          "🟩",
          new Set([pos(0, 0), pos(0, 1), pos(0, 2), pos(1, 2)]),
          pos(0, 1),
        );
      case 4:
        // s
        return new Shape(
          "🟦",
          new Set([pos(1, 0), pos(2, 0), pos(1, 1), pos(0, 1)]),
          pos(1, 0),
        );
      case 5:
        // z
        return new Shape(
          "🟪",
          new Set([pos(0, 0), pos(1, 0), pos(1, 1), pos(2, 1)]),
          pos(1, 0),
        );
      case 6:
        // t
        return new Shape(
          "🟫",
          new Set([pos(0, 0), pos(1, 0), pos(2, 0), pos(1, 1)]),
          pos(1, 0),
        );
      default:
        console.warn("shape number out of range: ", idx);
    }
  }

  get(pos: Pos): Pos | undefined {
    return Array.from(this.positions).find(
      (p) => p.x === pos.x && p.y === pos.y,
    );
  }

  isColliding(posArray: Pos[]): boolean {
    return posArray.some((otherPos) =>
      Array.from(this.positions).some(
        (p) => otherPos.x === p.x && otherPos.y === p.y,
      ),
    );
  }

  add(otherPos: Pos): Shape {
    const { typ, anchor } = this;
    return new Shape(
      typ,
      new Set(
        Array.from(this.positions).map((pos) =>
          Pos.new(pos.x + otherPos.x, pos.y + otherPos.y),
        ),
      ),
      Pos.new(anchor.x + otherPos.x, anchor.y + otherPos.y),
    );
  }

  remove(y: number): void {
    this.positions = new Set(
      Array.from(this.positions)
        .filter((pos) => pos.y !== y)
        .map((pos) => {
          if (pos.y >= y) {
            return pos;
          } else {
            // consider the gravity
            return pos.add(Pos.new(0, 1));
          }
        }),
    );
  }

  rotate(): Shape {
    const { typ, anchor } = this;
    const { x: a, y: b } = this.anchor;
    return new Shape(
      typ,
      new Set(
        Array.from(this.positions).map((pos) =>
          Pos.new(-pos.y + b + a, pos.x - a + b),
        ),
      ),
      anchor,
    );
  }
}
