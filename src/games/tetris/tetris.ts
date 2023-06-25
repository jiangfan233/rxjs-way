import { Pos, PosType } from "../components/pos";
import { Shape, ShapeType } from "./shape";

export type Direction = "Left" | "Right";

export default class Tetris {
  width: number;
  height: number;
  current_shape: ShapeType;
  fixed_shapes: ShapeType[];
  failed: boolean;

  constructor(width: number = 10, height: number = 25) {
    this.width = width;
    this.height = height;
    this.fixed_shapes = [];
    this.failed = false;

    this.current_shape = Shape.shapeFactory(Math.floor(Math.random() * 7))!.add(
      Pos.new(this.width / 2 - 1, 0)
    );
  }

  clone() {
    let newTetris = new Tetris();
    newTetris.current_shape = this.current_shape;
    newTetris.fixed_shapes = this.fixed_shapes;
    newTetris.failed = this.failed;
    return newTetris;
  }

  // 坐标系转换
  changeCoordinates(shape: Shape) {
    const { typ, anchor, positions } = shape;
    const newAnchor = Pos.new(anchor.x + this.width / 2 - 1, anchor.y);

    const newBlocks = new Set(
      Array.from(positions).map((p) => Pos.new(p.x + this.width / 2 - 1, p.y))
    );
    return new Shape(typ, newBlocks, newAnchor);
  }

  getTyp(pos: PosType): string | null {
    let target = this.current_shape.get(pos);
    if (target) {
      return this.current_shape.typ;
    }

    let shape = this.fixed_shapes.find((shape) => !!shape.get(pos));
    if (shape) return shape.typ;
    return null;
  }

  isOutOfBounds(shape: Shape): boolean {
    const posArray = Array.from(shape.positions);
    return !posArray.every(
      (pos) =>
        pos.x >= 0 && pos.x < this.width && pos.y >= 0 && pos.y < this.height
    );
  }

  isColliding(shape: Shape): boolean {
    const posArray = Array.from(shape.positions);
    return this.fixed_shapes.some((fixed_shape) =>
      fixed_shape.isColliding(posArray)
    );
  }

  // move the current shape down by one row.
  tick() {
    if (this.failed) return;
    const newShape = this.current_shape.add(Pos.new(0, 1));
    if (this.isColliding(newShape) || this.isOutOfBounds(newShape)) {
      this.fixed_shapes.push(this.current_shape);

      this.removeFullLines();

      this.current_shape = Shape.shapeFactory(
        Math.floor(Math.random() * 7)
      )!.add(Pos.new(this.width / 2 - 1, 0));


      // can not move
      if (this.isColliding(this.current_shape)) {
        this.failed = true;
      }
    } else {
      this.current_shape = newShape;
    }
    return this.failed;
  }

  // move left and move right
  shift(direction: Direction): void {
    let newShape: Shape;
    switch (direction) {
      case "Left":
        newShape = this.current_shape.add(Pos.new(-1, 0));
        break;
      case "Right":
        newShape = this.current_shape.add(Pos.new(1, 0));
        break;
      default:
        return;
    }

    if (!this.isOutOfBounds(newShape) && !this.isColliding(newShape)) {
      this.current_shape = newShape;
    }
  }

  rotate() {
    const newShape = this.current_shape.rotate();
    if (!this.isOutOfBounds(newShape) && !this.isColliding(newShape)) {
      this.current_shape = newShape;
    }
  }

  removeFullLines(): void {
    Array(this.height).fill(null)
      .forEach((_, y) => {
      if (this.isLineFull(y)) {
        this.fixed_shapes.forEach((shape) => {
          shape.remove(y);
        });
      }
    }); 

  }

  isLineFull(y: number) {
    return this.fixed_shapes
      .flatMap(shape => Array.from(shape.positions))
      .filter(pos => pos.y === y)
      .length === this.width
  }
}
