import { Pos, PosType } from "../components/pos";

export interface FoodInf extends PosType {
    food_color: string;
  }
  
  export class Food extends Pos implements FoodInf {
    food_color!: string;
  
    constructor(x:number, y: number, food_color: string) {
      super(x, y);
      this.food_color = food_color;
    }
  
    static newFood(x:number, y: number, food_color: string) {
      return new Food(x, y, food_color);
    }
  
  }