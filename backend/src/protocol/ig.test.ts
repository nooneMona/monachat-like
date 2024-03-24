import { IGRequest, validateIGRequest } from "./ig";

describe("IGRequestValidator (use case)", () => {
  it("should pass on", () => {
    const req: IGRequest = {
      token: "token",
      stat: "on",
      ihash: "hogehogeaaaa",
    };
    expect(validateIGRequest(req)).toBeTruthy();
  });

  it("should pass off", () => {
    const req: IGRequest = {
      token: "token",
      stat: "off",
      ihash: "hogehogeaaaa",
    };
    expect(validateIGRequest(req)).toBeTruthy();
  });

  // トークンがnullのときは新しくトークンを発行させる手続きに移行させる。
  it("should pass com event if it has no token.", () => {
    const req: IGRequest = {
      stat: "on",
      ihash: "hogehogeaaaa",
    };
    expect(validateIGRequest(req)).toBeTruthy();
  });
});
