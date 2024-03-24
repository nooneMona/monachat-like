export class Speech {
  readonly value: string;

  constructor(value: string) {
    // ログの表示の反転を回避
    const filteredValue = value.replace(
      /[\u200F\u202B\u202E\u2066\u2067]/g,
      ""
    );
    this.value = filteredValue;
  }
}
