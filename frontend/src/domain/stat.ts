export class Stat {
  private constructor(private readonly _value?: string) {}
  private static DEFAULT_VALUE = "通常";

  get value(): string | undefined {
    return this._value;
  }

  isVisible(): boolean {
    if (this._value === undefined) return false;
    if (this._value === Stat.DEFAULT_VALUE) return false;
    return true;
  }

  static create(value?: string): Stat {
    if (!this.isValid(value)) {
      return new Stat(undefined);
    }
    return new Stat(value);
  }

  static defaultOptions(): string[] {
    return [
      "通常",
      "退席中",
      "取り込み中",
      "ﾏﾀｰﾘ",
      "殺伐",
      "祭り",
      "ﾜｼｮｰｲ",
      "ﾏﾝｾｰ",
      "ﾊｧﾊｧ",
      "ﾊﾗﾍﾀｰ",
      "ﾊﾗｲﾊﾟｰｲ",
      "ｳﾏｰ",
      "ﾏｽﾞｰ",
      "ｱﾂｰ",
      "ｻﾑｰ",
      "ﾈﾑｰ",
      "ﾓｳﾀﾞﾒﾎﾟ",
    ];
  }

  private static isValid(value?: string) {
    if (value === undefined) return false;
    if (value === null) return false;
    return true;
  }
}
