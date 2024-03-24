import { ERRORRequest, validateERRORRequest } from "./error";

describe("validateERRORRequest (use case)", () => {
  it("should pass with only text", () => {
    const req: ERRORRequest = {
      text: "error occurs",
    };
    expect(validateERRORRequest(req)).toBeTruthy();
  });
});
