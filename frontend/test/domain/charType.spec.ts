import { CharType } from "@/domain/charType";

describe("CharType", () => {
  it("constructor", () => {
    expect.assertions(2);
    const charType = CharType.create("charhan");
    expect(charType).toBeDefined();
    expect(charType.value).toBe("charhan");
  });

  it("constructor with empty string", () => {
    expect.assertions(2);
    const charType = CharType.create("");
    expect(charType).toBeDefined();
    expect(charType.value).toBe("charhan");
  });

  it("constructor with undefined", () => {
    expect.assertions(2);
    const charType = CharType.create(undefined);
    expect(charType).toBeDefined();
    expect(charType.value).toBe("charhan");
  });
});
