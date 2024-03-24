type PositionOptions = {
  x: number | undefined;
  y: number | undefined;
};

export class Position {
  private static readonly MIN_VALUE = 0;

  private constructor(public readonly x: number, public readonly y: number) {}

  static instantiate(parameters: PositionOptions): Position | undefined {
    const { x, y } = parameters;
    if (x == null || y == null) {
      return undefined;
    }
    if (!Number.isInteger(x) || !Number.isInteger(y)) {
      return undefined;
    }
    if (!(x >= this.MIN_VALUE) || !(y >= this.MIN_VALUE)) {
      return undefined;
    }
    return new Position(x, y);
  }

  static zero(): Position {
    return new Position(0, 0);
  }

  copy(): Position {
    return new Position(this.x, this.y);
  }
}
