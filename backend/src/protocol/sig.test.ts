import { SIGRequest, validateSIGRequest } from "./sig";

describe("IGRequestValidator (use case)", () => {
  it("should pass on", () => {
    const req: SIGRequest = {
      token: "token",
      stat: "on",
      ihash: "hogehogeaaaa",
    };
    expect(validateSIGRequest(req)).toBeTruthy();
  });

  it("should pass off", () => {
    const req: SIGRequest = {
      token: "token",
      stat: "off",
      ihash: "hogehogeaaaa",
    };
    expect(validateSIGRequest(req)).toBeTruthy();
  });

  // トークンがnullのときは新しくトークンを発行させる手続きに移行させる。
  it("should pass com event if it has no token.", () => {
    const req: SIGRequest = {
      stat: "on",
      ihash: "hogehogeaaaa",
    };
    expect(validateSIGRequest(req)).toBeTruthy();
  });
});
