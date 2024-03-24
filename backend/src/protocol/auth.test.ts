import { AUTHRequest, validateAUTHRequest } from "./auth";

describe("validateAUTHRequest (use case)", () => {
  it("request to reauthenticate", () => {
    const req: AUTHRequest = {
      token: "token",
    };
    expect(validateAUTHRequest(req)).toBeTruthy();
  });

  it("request to publish new token", () => {
    const req: AUTHRequest = {};
    expect(validateAUTHRequest(req)).toBeTruthy();
  });
});

describe("validateAUTHRequest (attacker)", () => {});
