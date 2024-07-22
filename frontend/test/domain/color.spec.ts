import { MonaColor } from "@/domain/color";

describe("MonaColor", () => {
  describe("constructedByHex", () => {
    it("should be constructed", () => {
      const color = MonaColor.createByHex("#FFFFFF");
      expect(color).toBeDefined();
      expect(color.value).toEqual({ r: 100, g: 100, b: 100 });
    });

    it("should be constructed by red", () => {
      const color = MonaColor.createByHex("#FF0000");
      expect(color).toBeDefined();
      expect(color.value).toEqual({ r: 100, g: 0, b: 0 });
    });
  });

  describe("constructedByDefault", () => {
    it("should be constructed", () => {
      const color = MonaColor.createDefault();
      expect(color).toBeDefined();
      expect(color.value).toEqual({ r: 100, g: 100, b: 100 });
    });

    it("should equal to white", () => {
      const color = MonaColor.createDefault();
      const white = MonaColor.createByHex("#FFFFFF");
      expect(color).toBeDefined();
      expect(color.value).toEqual(white.value);
    });
  });
});
