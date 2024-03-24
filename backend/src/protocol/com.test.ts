import { COMRequest, validateCOMRequest } from "./com";

describe("validateCOMRequest (use case)", () => {
  it("should pass normal com event", () => {
    const req: COMRequest = {
      token: "token",
      cmt: "こん",
    };
    expect(validateCOMRequest(req)).toBe(true);
  });

  it("should pass normal com event", () => {
    const req: COMRequest = {
      token: "token",
      cmt: "そうかも",
      style: 2,
    };
    expect(validateCOMRequest(req)).toBe(true);
  });

  // トークンがnullのときは新しくトークンを発行させる手続きに移行させる。
  it("should pass com event if it has no token.", () => {
    const req: COMRequest = {
      cmt: "こん",
    };
    expect(validateCOMRequest(req)).toBe(true);
  });

  it("should pass com event if it has typing property", () => {
    const req: COMRequest = {
      cmt: "こん",
      typing: {
        count: 10,
        milliTime: 50000,
      },
    };
    expect(validateCOMRequest(req)).toBe(true);
  });

  describe("typing", () => {
    it("should pass com event if it has typing property", () => {
      const req: COMRequest = {
        cmt: "こん",
        typing: {
          count: 10,
          milliTime: 50000,
        },
      };
      expect(validateCOMRequest(req)).toBe(true);
    });

    it("should NOT pass com event if it's typing has no count", () => {
      const req: any = {
        cmt: "こん",
        typing: {
          milliTime: 50000,
        },
      };
      expect(validateCOMRequest(req)).toBe(false);
    });

    it("should NOT pass com event if it's typing has no milliTime", () => {
      const req: any = {
        cmt: "こん",
        typing: {
          count: 10,
        },
      };
      expect(validateCOMRequest(req)).toBe(false);
    });
  });
});

describe("validateCOMRequest (attacker)", () => {
  it("should decline if too long comment", () => {
    const req: COMRequest = {
      token: "token",
      cmt: "あ".repeat(600),
    };
    expect(validateCOMRequest(req)).toBe(false);
  });

  it("should decline if suspected to load information with style", () => {
    const req: COMRequest = {
      token: "token",
      cmt: "　",
      style: 2502024020,
    };
    expect(validateCOMRequest(req)).toBe(false);
  });
});
