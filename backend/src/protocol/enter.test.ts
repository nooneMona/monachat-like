import { ENTERRequest, validateENTERRequest } from "./enter";

describe("validateENTERRequest (use case)", () => {
  it("should pass first enter event", () => {
    const req: ENTERRequest = {
      token: "token",
      room: "/MONA8094",
      attrib: "no",
    };
    expect(validateENTERRequest(req)).toBeTruthy();
  });

  it("should pass first enter event with only name", () => {
    const req: ENTERRequest = {
      token: "token",
      room: "/MONA8094",
      name: "名無しさん",
      trip: "himitunoword",
    };
    expect(validateENTERRequest(req)).toBeTruthy();
  });

  it("should pass enter to room", () => {
    const req: ENTERRequest = {
      token: "token",
      room: "/1",
      name: "名無しさん",
      trip: "himitunoword",
      x: 100,
      y: 100,
      scl: 100,
      stat: "通常",
      r: 100,
      g: 100,
      b: 100,
      type: "mona",
    };
    expect(validateENTERRequest(req)).toBeTruthy();
  });

  // トークンがnullのときは新しくトークンを発行させる手続きに移行させる。
  it("should pass com event if it has no token.", () => {
    const req: ENTERRequest = {
      room: "/1",
      name: "名無しさん",
      trip: "himitunoword",
      x: 100,
      y: 100,
      scl: 100,
      stat: "通常",
      r: 100,
      g: 100,
      b: 100,
      type: "mona",
    };
    expect(validateENTERRequest(req)).toBeTruthy();
  });
});

describe("validateENTERRequest (attacker)", () => {
  it("should decline if name is too long", () => {
    const req: ENTERRequest = {
      token: "token",
      room: "/1",
      name: "あ".repeat(51),
      trip: "himitunoword",
      x: 100,
      y: 100,
      scl: 100,
      stat: "通常",
      r: 100,
      g: 100,
      b: 100,
      type: "mona",
    };
    expect(validateENTERRequest(req)).toBeFalsy();
  });

  it("should decline if stat is too long", () => {
    const req: ENTERRequest = {
      token: "token",
      room: "/1",
      name: "名無しさん",
      trip: "himitunoword",
      x: 100,
      y: 100,
      scl: 100,
      stat: "あ".repeat(51),
      r: 100,
      g: 100,
      b: 100,
      type: "mona",
    };
    expect(validateENTERRequest(req)).toBeFalsy();
  });
});
