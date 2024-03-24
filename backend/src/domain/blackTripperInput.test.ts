import { BlackTripperInput } from "./blackTripperInput";

describe("BlackTripperInput", () => {
  it("should be created", () => {
    const ip = new BlackTripperInput("input");
    expect(ip.getValue()).toBe("input");
  });
});
