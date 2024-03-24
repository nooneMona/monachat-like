export class Name {
  readonly value: string;

  constructor(name?: string) {
    this.value = this.getValidName(name);
  }

  private getValidName(rawName?: string): string {
    if (rawName == null || rawName.length === 0) {
      return this.getAnonymousName();
    }
    let name = this.replaceSpecialCharWithDummyChar(rawName);
    name = this.eliminateMaliciousControlChar(name);
    return name;
  }

  private getAnonymousName(): string {
    return "名無しさん";
  }

  private replaceSpecialCharWithDummyChar(raw: string): string {
    return raw.replace(/◆/g, "🥗").replace(/◇/g, "🚫");
  }

  private eliminateMaliciousControlChar(raw: string): string {
    return raw.replace(/[\u200F\u202B\u202E\u2066\u2067]/g, "");
  }
}
