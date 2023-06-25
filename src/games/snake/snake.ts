import { Pos } from "../components/pos";

export interface SnakeInf {
  positions: Set<Pos>;
  headColor: string;
  color: string;
}

export enum Direction {
  Left,
  Right,
  Up,
  Down,
}

export enum AfterMove {
  Normal,
  Dead,
  Grow,
  Neck,
}

export class Snake implements SnakeInf {
  positions: Set<Pos>;
  headColor: string;
  color: string;

  constructor(positions: Set<Pos>, headColor: string, color: string="🟥") {
    this.positions = positions;
    this.headColor = headColor;
    this.color = color;
  }

  static new(positions: Array<Pos>, headColor = "🔴") {
    return new Snake(new Set(positions), headColor);
  }

  getHead() {
    return this.iterPositions()[0];
  }

  move(direction: Direction, food: Pos): AfterMove {
    let rhs;
    switch (direction) {
      case Direction.Down: {
        rhs = Pos.new(0, 1);
        break;
      }
      case Direction.Up: {
        rhs = Pos.new(0, -1);
        break;
      }
      case Direction.Left: {
        rhs = Pos.new(-1, 0);
        break;
      }
      case Direction.Right: {
        rhs = Pos.new(1, 0);
        break;
      }
    }

    let next = this.getHead().add(rhs);

    if(this.isNeck(next)) {
      return AfterMove.Neck;
    }

    if (this.eatSelf(next)) {
      return AfterMove.Dead;
    }

    let positions = this.iterPositions();
    if (next.eq(food)) {
      this.positions = new Set([next].concat(positions));
      return AfterMove.Grow;
    } else {
      positions.pop();
      this.positions = new Set([next].concat(positions));
      return AfterMove.Normal;
    }
  }

  iterPositions() {
    return Array.from(this.positions);
  }

  eatSelf(next: Pos): boolean {
    return !!this.iterPositions().find((pos) => pos.eq(next));
  }
  
  isNeck(next: Pos) :boolean {
    // the neck can not be eaten by itself.
    return this.iterPositions()[1].eq(next);
  }
}
