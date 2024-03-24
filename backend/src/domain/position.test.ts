import { Position } from "./position";

describe("Position", () => {
  const maxSafeInt = Number.MAX_SAFE_INTEGER;

  test.each`
    x             | y             | defined
    ${0}          | ${0}          | ${true}
    ${100}        | ${0}          | ${true}
    ${0}          | ${100}        | ${true}
    ${100}        | ${100}        | ${true}
    ${maxSafeInt} | ${maxSafeInt} | ${true}
    ${-1}         | ${-1}         | ${false}
    ${-1}         | ${0}          | ${false}
    ${0}          | ${-1}         | ${false}
    ${undefined}  | ${undefined}  | ${false}
    ${0}          | ${undefined}  | ${false}
    ${undefined}  | ${0}          | ${false}
    ${NaN}        | ${NaN}        | ${false}
    ${Infinity}   | ${Infinity}   | ${false}
  `(
    "should create defined object (that is $true) if properties ($x, $y)",
    ({ x, y, defined }) => {
      const position = Position.instantiate({ x, y });
      expect(position !== undefined).toBe(defined);
    }
  );

  it("should copy correnctly", () => {
    // 副作用はない
    const position = Position.instantiate({ x: 1, y: 2 });
    expect(position).toEqual({ x: 1, y: 2 });
    const copiedPosition = position?.copy();
    expect(copiedPosition).toEqual({ x: 1, y: 2 });
  });

  it("should create zero", () => {
    expect(Position.zero()).toEqual({ x: 0, y: 0 });
  });
});
