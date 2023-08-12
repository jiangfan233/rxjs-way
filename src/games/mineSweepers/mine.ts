import { Pos, PosType } from "../components/pos";

export interface MaybeMineInf extends PosType {
  x: number;
  y: number;
  color: string | null;
  isShow: Boolean;
  isMarked: boolean;
  value: number;
  isClickError: boolean;
}

export class MaybeMine extends Pos implements MaybeMineInf {
  color: string | null;
  isShow: Boolean;
  isMarked: boolean;
  value: number;
  isClickError: boolean;

  constructor(
    x: number,
    y: number,
    color: string | null,
    isShow: Boolean,
    isMarked: boolean,
    value: number,
    isClickError: boolean,
  ) {
    super(x, y);
    this.isShow = isShow;
    this.color = color;
    this.isMarked = isMarked;
    this.value = value;
    this.isClickError = isClickError;
  }

  static mine(
    x: number,
    y: number,
    color = "💣",
    isShow = false,
    isMarked = false,
    value = -1,
    isClickError = false,
  ): MaybeMine {
    return new MaybeMine(x, y, color, isShow, isMarked, value, isClickError);
  }

  static grass(
    x: number,
    y: number,
    color = null,
    isShow = false,
    isMarked = false,
    value = 0,
    isClickError = false,
  ): MaybeMine {
    return new MaybeMine(x, y, color, isShow, isMarked, value, isClickError);
  }

  isMine(): boolean {
    return this.value < 0;
  }

  mark() {
    if (this.isShow) return;
    this.isMarked = !this.isMarked;
  }

  toMine() {
    this.color = "💣";
    this.value = -1;
  }

  setValue(count: number) {
    this.value = count;
    return this;
  }

  setShow(v: boolean) {
    this.isShow = v;
    return this;
  }

  toView() {
    const { isShow, color, value, isMarked } = this;
    if (isMarked) return "🚩";
    if (isShow) {
      return this.isMine() ? color : value || null;
    } else {
      return null;
    }
  }

  isMarkError(): boolean {
    const { isMarked } = this;
    return isMarked && !this.isMine();
  }

  clone(): MaybeMine {
    let cloned = MaybeMine.grass(this.x, this.y);
    Object.assign(cloned, this);
    return cloned;
  }
}
