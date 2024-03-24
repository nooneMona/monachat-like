import { Direction, DirectionValue } from "./direction";

describe("direction", () => {
  test.each`
    scl          | value                   | actualVal
    ${100}       | ${DirectionValue.Right} | ${100}
    ${-100}      | ${DirectionValue.Left}  | ${-100}
    ${0}         | ${DirectionValue.Right} | ${100}
    ${undefined} | ${DirectionValue.Right} | ${100}
  `(
    "should instantiate by scl(=$scl) if properties are correct.",
    ({ scl, value, actualVal }) => {
      const direction = Direction.instantiateByScl(scl);
      expect(direction).toBeDefined();
      expect(direction.value).toBe(value);
      expect(direction.getScl()).toBe(actualVal);
    }
  );

  test.each`
    input                   | output
    ${DirectionValue.Right} | ${DirectionValue.Right}
    ${DirectionValue.Left}  | ${DirectionValue.Left}
  `(
    "should instantiate by value(=$input) and copy if properties are correct.",
    ({ input, output }) => {
      const direction = Direction.instantiate(input);
      expect(direction).toBeDefined();
      expect(direction.value).toBe(output);
      const copiedDirection = direction.copy();
      expect(copiedDirection.value).toBe(output);
    }
  );
});
