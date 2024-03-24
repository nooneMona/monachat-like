import uuid from "uuid";
import { IDGenerator } from "./idGenerator";

const mockedUUIDValue = "generatedUUID";
// FIXME: この方法だとテストケースが複数あるときにメモリ(v4Counter)を共有する可能性があり、結果が安定しなくなる。
let v4Counter = 0;
jest.mock("uuid", () => ({
  v4: jest.fn(() => {
    v4Counter += 1;
    return `${mockedUUIDValue}=${v4Counter}`;
  }),
}));

describe("IDGenerator", () => {
  beforeEach(() => {
    v4Counter = 0;
  });

  describe("#generate", () => {
    it("should generate mocked value", () => {
      expect(IDGenerator.instance.generate()).toBe("generatedUUID=1");
      expect(uuid.v4).toBeCalledTimes(1);
      expect(IDGenerator.instance.generate()).toBe("generatedUUID=2");
      expect(uuid.v4).toBeCalledTimes(2);
    });
  });
});
