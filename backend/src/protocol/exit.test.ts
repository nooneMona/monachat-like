import { EXITRequest, validateEXITRequest } from "./exit";

describe("validateEXITResponse (use cae)", () => {
  it("should pass", () => {
    const req: EXITRequest = {
      token: "token",
    };
    expect(validateEXITRequest(req)).toBeTruthy();
  });

  // トークンがnullのときは新しくトークンを発行させる手続きに移行させる。
  it("should pass com event if it has no token.", () => {
    const req: EXITRequest = {};
    expect(validateEXITRequest(req)).toBeTruthy();
  });
});
