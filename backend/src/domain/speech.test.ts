import { Speech } from "./speech";

describe("Comment", () => {
  describe("constructor", () => {
    it("should constuct", () => {
      expect(new Speech("こんにちは").value).toBe("こんにちは");
    });

    it("should remove malicious characters", () => {
      expect(
        new Speech(
          "\u200F\u202B\u202E\u2066\u2067こんにちは\u200F\u202B\u202E\u2066\u2067"
        ).value
      ).toBe("こんにちは");
    });
  });
});
