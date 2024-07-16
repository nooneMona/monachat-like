import uuid from "uuid";
import { IDGenerator } from "./idGenerator";

describe("IDGenerator", () => {
  describe("#generate", () => {
    it("should generate mocked value", () => {
      // TODO: きちんとモックしてテストすること
      expect(IDGenerator.instance.generate()).toHaveLength(36);
    });
  });
});
