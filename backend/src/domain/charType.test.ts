import { CharType } from "./charType";

describe("CharType", () => {
  it("should be stored value", () => {
    const undefinedCharType = new CharType(undefined);
    expect(undefinedCharType.value).toBe("mona");
    const charType = new CharType("mona");
    expect(charType.value).toBe("mona");
  });
});
