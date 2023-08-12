import { Food } from "./food";
import { AfterMove, Direction, Snake } from "./snake";
import { Pos } from "../components/pos";

export interface GameBoardInf {
  width: number;
  height: number;
  snake: Snake;
  food: Food;
  isFailed: boolean;
}

export class GameBoard implements GameBoardInf {
  width: number;
  height: number;
  snake: Snake;
  food: Food;
  isFailed: boolean;

  constructor(
    width: number,
    height: number,
    snake: Snake,
    food: Food,
    isFailed: boolean,
  ) {
    this.width = width;
    this.height = height;
    this.snake = snake;
    this.food = food;
    this.isFailed = isFailed;
  }

  static default(width = 30, height = 30) {
    return new GameBoard(
      width,
      height,
      Snake.new([
        Food.newFood(width / 2, height / 2, "🟥"),
        Food.newFood(width / 2 + 1, height / 2, "🟥"),
        Food.newFood(width / 2 + 2, height / 2, "🟥"),
      ]),
      Food.newFood(
        ~~(Math.random() * width),
        ~~(Math.random() * height),
        ["🟥", "🟫", "🟪", "🟦", "🟩", "🟨", "🟧"][~~(Math.random() * 7)],
      ),
      false,
    );
  }

  newSnake(): Snake {
    const { width, height } = this;
    return Snake.new([
      Pos.new(width / 2, height / 2),
      Pos.new(width / 2 + 1, height / 2),
      Pos.new(width / 2 + 2, height / 2),
    ]);
  }

  refreshFood() {
    const { width, height } = this;
    let makeFood = () =>
      Food.newFood(
        ~~(Math.random() * width),
        ~~(Math.random() * height),
        ["🟥", "🟫", "🟪", "🟦", "🟩", "🟨", "🟧"][~~(Math.random() * 7)],
      );
    let newFood = makeFood();
    while (this.isSnake(newFood)) {
      newFood = makeFood();
    }
    this.food = newFood;
  }

  isIndBounds(direction: Direction): boolean {
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

    let next = this.snake.getHead().add(rhs);
    return (
      next.x >= 0 && next.x < this.width && next.y >= 0 && next.y < this.height
    );
  }

  /**
   *
   * @param direction
   * @returns Boolean
   */
  tryMove(direction: Direction): Boolean {
    if (this.isFailed) return false;
    if (!this.isIndBounds(direction)) {
      this.isFailed = true;
      return false;
    }
    let afterMove = this.snake.move(direction, this.food);
    switch (afterMove) {
      case AfterMove.Grow: {
        this.refreshFood();
        return true;
      }
      case AfterMove.Normal: {
        return true;
      }
      case AfterMove.Dead: {
        this.isFailed = true;
        return true;
      }
      case AfterMove.Neck: {
        return false;
      }
    }
  }

  clone() {
    const { width, height, snake, food, isFailed } = this;
    return new GameBoard(width, height, snake, food, isFailed);
  }

  isSnake(pos: Pos): Boolean {
    return this.snake.iterPositions().some((p) => p.eq(pos));
  }

  getPosition(pos: Pos): string {
    const { snake, food } = this;
    if (food.eq(pos)) return food.food_color;
    if (snake.getHead().eq(pos)) return snake.headColor;
    // set.has 不能用
    // if( snake.positions.has(pos) ) return snake.color;
    if (this.isSnake(pos)) return snake.color;
    return "";
  }
}
