import { Color } from "./color";

describe("color", () => {
  it("color class should instantiate if properties are correct.", () => {
    const cases = [
      { r: 100, g: 100, b: 100 },
      { r: 50, g: 0, b: 50 },
      { r: 0, g: 0, b: 0 },
    ];
    for (const c of cases) {
      const { r, g, b } = c;
      const color = Color.instantiateByMona({ r, g, b });
      expect(color).toBeDefined();
    }
  });

  it("color class should instantiate if properties are incorrect.", () => {
    const cases = [
      // 100を超える
      { r: 101, g: 101, b: 101 },
      { r: 101, g: 50, b: 50 },
      { r: 50, g: 101, b: 50 },
      { r: 50, g: 50, b: 101 },
      // 0に満たない
      { r: -1, g: -1, b: -1 },
      { r: -1, g: 50, b: 50 },
      { r: 50, g: -1, b: 50 },
      { r: 50, g: 50, b: -1 },
      // 整数でない
      { r: 50.1, g: 50.1, b: 50.1 },
      { r: 50.1, g: 50, b: 50 },
      { r: 50, g: 50.1, b: 50 },
      { r: 50, g: 50, b: 50.1 },
    ];
    for (const c of cases) {
      const { r, g, b } = c;
      const color = Color.instantiateByMona({ r, g, b });
      expect(color).toBeUndefined();
    }
  });

  it("color class should be copied", () => {
    const color = Color.instantiateByMona({ r: 100, g: 100, b: 100 });
    expect(color).toBeDefined();
  });
});
