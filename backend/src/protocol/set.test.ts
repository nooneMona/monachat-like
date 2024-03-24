import { SETRequest, validateSETRequest } from "./set";

describe("validateSETRequest (use case)", () => {
  it("should pass", () => {
    const req: SETRequest = {
      token: "token",
      x: 100,
      y: 100,
      scl: 100,
      stat: "通常",
    };
    expect(validateSETRequest(req)).toBeTruthy();
  });

  it("should decline xy rack", () => {
    const req = {
      token: "token",
      scl: 100,
      stat: "通常",
    };
    expect(validateSETRequest(req)).toBeFalsy();
  });

  it("should decline scl rack", () => {
    const req = {
      token: "token",
      x: 100,
      y: 100,
      stat: "通常",
    };
    expect(validateSETRequest(req)).toBeFalsy();
  });

  it("should decline stat rack", () => {
    const req = {
      token: "token",
      x: 100,
      y: 100,
      scl: 100,
    };
    expect(validateSETRequest(req)).toBeFalsy();
  });

  // トークンがnullのときは新しくトークンを発行させる手続きに移行させる。
  it("should pass com event if it has no token.", () => {
    const req: SETRequest = {
      x: 100,
      y: 100,
      scl: 100,
      stat: "通常",
    };
    expect(validateSETRequest(req)).toBeTruthy();
  });
});
