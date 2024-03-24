import { Stat } from "./stat";

describe("Stat", () => {
  describe("create", () => {
    it("should create a Stat instance with the given value", () => {
      const stat = Stat.create("test");
      expect(stat.value).toEqual("test");
    });

    it("should save undefined if undefined is passed", () => {
      const stat = Stat.create(undefined);
      expect(stat.value).toBeUndefined();
    });
  });

  describe("isVisible", () => {
    it('should return true if the value is "通常"', () => {
      const stat = Stat.create("通常");
      expect(stat.isVisible()).toBe(false);
    });

    it('should return false if the value is not "通常"', () => {
      const stat = Stat.create("test");
      expect(stat.isVisible()).toBe(true);
    });
  });
});
