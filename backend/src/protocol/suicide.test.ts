import { SUICIDERequest, validateSUICIDERequest } from "./suicide";

describe("validateSUICIDEResponse (use cae)", () => {
  it("should pass", () => {
    const req: SUICIDERequest = {
      token: "token",
    };
    expect(validateSUICIDERequest(req)).toBeTruthy();
  });

  // トークンがnullのときは新しくトークンを発行させる手続きに移行させる。
  it("should pass com event if it has no token.", () => {
    const req: SUICIDERequest = {};
    expect(validateSUICIDERequest(req)).toBeTruthy();
  });
});
