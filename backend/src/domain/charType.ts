export class CharType {
  private static default = "mona";
  readonly value: string;

  constructor(value: string | undefined) {
    if (value == null) {
      this.value = CharType.default;
      return;
    }
    this.value = value;
  }
}
