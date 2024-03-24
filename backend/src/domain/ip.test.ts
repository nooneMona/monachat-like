import { IP } from "./ip";

describe("IP", () => {
  it("should be created", () => {
    const ip = new IP("127.0.0.1");
    expect(ip.getValue()).toBe("127.0.0.1");
  });
});
