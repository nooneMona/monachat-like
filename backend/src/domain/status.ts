export class Status {
  private static default = "通常";
  readonly value: string;

  constructor(value: string | undefined) {
    if (value == null) {
      this.value = Status.default;
      return;
    }
    this.value = value;
  }

  copy(): Status {
    return new Status(this.value);
  }
}
