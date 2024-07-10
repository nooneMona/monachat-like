export class CharType {
  private constructor(private readonly _value: string) {}
  private static DEFAULT_VALUE = "charhan";

  get value(): string {
    return this._value;
  }

  static create(value?: string): CharType {
    if (value == null || value === "") {
      return new CharType(this.DEFAULT_VALUE);
    }
    return new CharType(value);
  }
}
