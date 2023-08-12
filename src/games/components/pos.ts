export interface PosType {
  x: number;
  y: number;
  add(other: Pos): Pos;
  eq(rhs: Pos): boolean;
  asKey(): string;
}

export class Pos implements PosType {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static new(x: number, y: number) {
    return new Pos(x, y);
  }

  add(other: Pos): Pos {
    return Pos.new(this.x + other.x, this.y + other.y);
  }

  eq(rhs: Pos): boolean {
    return this.x === rhs.x && this.y === rhs.y;
  }

  asKey(): string {
    return `${this.x}${this.y}`;
  }
}
