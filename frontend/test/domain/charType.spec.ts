import { CharType } from "@/domain/charType";

describe("CharType", () => {
  it("constructor", () => {
    const charType = CharType.create("charhan");
    expect(charType).toBeDefined();
    expect(charType.value).toEqual("charhan");
  });

  it("constructor with empty string", () => {
    const charType = CharType.create("");
    expect(charType).toBeDefined();
    expect(charType.value).toEqual("charhan");
  });

  it("constructor with undefined", () => {
    const charType = CharType.create(undefined);
    expect(charType).toBeDefined();
    expect(charType.value).toEqual("charhan");
  });
});
