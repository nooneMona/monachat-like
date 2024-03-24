export enum DirectionValue {
  Right = "Right_DirectionValue", // 実際の値を使わないようにするため
  Left = "Left_DirectionValue",
}

export class Direction {
  // マスター画像が右を向いているという前提
  private static defaultValue = DirectionValue.Right;
  private static sclRightNumber = 100;
  private static sclLeftNumber = -100;

  private constructor(readonly value: DirectionValue) {}

  // FIXME: Webインターフェイスの知識は切り離す。
  static instantiateByScl(scl: number | undefined): Direction {
    if (scl == null) {
      return this.default();
    }
    if (scl === this.sclRightNumber) {
      return new Direction(DirectionValue.Right);
    }
    if (scl === this.sclLeftNumber) {
      return new Direction(DirectionValue.Left);
    }
    return this.default();
  }

  private static default(): Direction {
    return new Direction(this.defaultValue);
  }

  static instantiate(value: DirectionValue): Direction {
    return new Direction(value);
  }

  // FIXME: Webインターフェイスの知識は切り離す。
  getScl(): number {
    switch (this.value) {
      case DirectionValue.Right:
        return Direction.sclRightNumber;
      case DirectionValue.Left:
        return Direction.sclLeftNumber;
    }
  }

  copy(): Direction {
    return new Direction(this.value);
  }
}
