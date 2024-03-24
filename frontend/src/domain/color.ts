import Color from "color";

type RGB = { readonly r: number; readonly g: number; readonly b: number };

export class MonaColor {
  private readonly r: number;
  private readonly g: number;
  private readonly b: number;
  get value(): RGB {
    return { r: this.r, g: this.g, b: this.b };
  }

  private static MIN_VALUE = 0;
  private static MAX_VALUE = 100;
  private static DEFAULT_HEX: string = "#FFFFFF";
  private static DEFAULT_RGB: RGB = { r: 100, g: 100, b: 100 };

  /**
   * 有効な値を渡すこと
   * @param r 0~100
   * @param g 0~100
   * @param b 0~100
   */
  private constructor(r: number, g: number, b: number) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  static createByHex(hex: string): MonaColor {
    let color;
    try {
      color = Color(hex);
    } catch (error) {
      color = Color(this.DEFAULT_HEX);
    }
    const monaRGB = this.convertToMonaRGB(color);
    return new MonaColor(monaRGB.r, monaRGB.g, monaRGB.b);
  }

  static createDefault(): MonaColor {
    return new MonaColor(100, 100, 100);
  }

  // 0~100に変換
  private static convertToMonaRGB(color: Color): RGB {
    const rgb = color.rgb().unitObject();
    const r = Math.floor(rgb.r * 100);
    const g = Math.floor(rgb.g * 100);
    const b = Math.floor(rgb.b * 100);
    if (!this.isValid(r, g, b)) {
      return this.DEFAULT_RGB;
    }
    return { r, g, b };
  }

  private static isValid(r: number, g: number, b: number) {
    if (r < this.MIN_VALUE || r > this.MAX_VALUE) return false;
    if (g < this.MIN_VALUE || g > this.MAX_VALUE) return false;
    if (b < this.MIN_VALUE || b > this.MAX_VALUE) return false;
    return true;
  }
}
