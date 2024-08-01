import { Stat } from "@/domain/stat";

describe("Stat", () => {
  describe("create", () => {
    it("should create a Stat instance with the given value", () => {
      expect.assertions(1);
      const stat = Stat.create("test");
      expect(stat.value).toBe("test");
    });

    it("should save undefined if undefined is passed", () => {
      expect.assertions(1);
      const stat = Stat.create(undefined);
      expect(stat.value).toBeUndefined();
    });
  });

  describe("isVisible", () => {
    it('should return true if the value is "通常"', () => {
      expect.assertions(1);
      const stat = Stat.create("通常");
      expect(stat.isVisible()).toBe(false);
    });

    it('should return false if the value is not "通常"', () => {
      expect.assertions(1);
      const stat = Stat.create("test");
      expect(stat.isVisible()).toBe(true);
    });
  });
});
