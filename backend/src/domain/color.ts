type ColorOptionsMona = {
  r: number | undefined;
  g: number | undefined;
  b: number | undefined;
};

export class Color {
  private static readonly MIN_VALUE = 0;
  private static readonly MAX_VALUE = 100;

  private constructor(
    public r: number, // 赤成分
    public g: number, // 緑成分
    public b: number // 青成分
  ) {}

  static instantiateByMona(parameters: ColorOptionsMona): Color | undefined {
    const { r, g, b } = parameters;
    if (r == null || g == null || b == null) {
      return undefined;
    }
    if (!Number.isInteger(r) || !Number.isInteger(g) || !Number.isInteger(b)) {
      return undefined;
    }
    if (
      !(r >= this.MIN_VALUE && r <= this.MAX_VALUE) ||
      !(g >= this.MIN_VALUE && g <= this.MAX_VALUE) ||
      !(b >= this.MIN_VALUE && b <= this.MAX_VALUE)
    ) {
      return undefined;
    }
    return new Color(r, g, b);
  }

  static white(): Color {
    return new Color(this.MAX_VALUE, this.MAX_VALUE, this.MAX_VALUE);
  }
}
