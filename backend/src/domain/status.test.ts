import { Status } from "./status";

describe("status", () => {
  it("should be stored value", () => {
    const statUndefined = new Status(undefined);
    expect(statUndefined.value).toBe("通常");
    const stat = new Status("通常");
    expect(stat.value).toBe("通常");
  });

  it("should copy correctly", () => {
    const stat = new Status("ﾏﾀｰﾘ");
    const copiedStat = stat.copy();
    expect(copiedStat.value).toBe("ﾏﾀｰﾘ");
    expect(copiedStat.value).not.toBe("通常");
  });
});
