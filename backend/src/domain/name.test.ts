import { Name } from "./name";

describe("name", () => {
  it("valid name should be consistent.", () => {
    const name = new Name("田中さん");
    expect(name.value).toBe("田中さん");
  });

  it("undefined name should be changed to '名無しさん'.", () => {
    const name = new Name(undefined);
    expect(name.value).toBe("名無しさん");
    const emptyName = new Name("");
    expect(emptyName.value).toBe("名無しさん");
  });

  it("special character should be replaced with dummy character.", () => {
    const name1 = new Name("田中◇fmVp8+");
    expect(name1.value).toBe("田中🚫fmVp8+");
    const name2 = new Name("田中◆jyr8ODEGzY");
    expect(name2.value).toBe("田中🥗jyr8ODEGzY");
    const characters = new Name("◆◇◇◆◆◇◆◇");
    expect(characters.value).toBe("🥗🚫🚫🥗🥗🚫🥗🚫");
  });

  it("control characters should be eliminated", () => {
    const name = new Name("‏田中");
    expect(name.value).toBe("田中");
    expect(name.value).not.toBe("中田");
  });
});
