import { Account } from "./account";
import { IDGeneratable } from "../domain/idGenerator";
import { IDGeneratorMock } from "../test/mocks";

describe("Account", () => {
  let idGeneratorMock: IDGeneratable;

  beforeEach(() => {
    idGeneratorMock = new IDGeneratorMock();
  });

  /* --- query --- */
  describe("#instantiate", () => {
    it("should instantiate", () => {
      const account = Account.instantiate({
        idGenerator: idGeneratorMock,
        socketId: "testSocketId",
      });
      expect(account).toBeDefined();
      expect(account.id).toBe("id");
      expect(account.token).toBe("token");
      expect(account.socketId).toBe("testSocketId");
      expect(account.lastCommentTime).toBeDefined();
      expect(account.isMobile).toBeUndefined();
      expect(account.alive).toBe(true);
    });
  });

  /* --- command --- */
  describe("#updateSocketId", () => {
    it("should update socket ID", () => {
      const account = Account.instantiate({
        idGenerator: idGeneratorMock,
        socketId: "testSocketId",
      });
      account.updateSocketId("testSocketId2");
      expect(account.socketId).toBe("testSocketId2");
    });
  });

  describe("#updateAlive", () => {
    it("should update alive", () => {
      const account = Account.instantiate({
        idGenerator: idGeneratorMock,
        socketId: "testSocketId",
      });
      account.updateAlive(true);
      expect(account.alive).toBe(true);
      account.updateAlive(false);
      expect(account.alive).toBe(false);
    });
  });

  describe("#updateLastCommentTime", () => {
    it("should update lastCommentedTime", () => {
      const account = Account.instantiate({
        idGenerator: idGeneratorMock,
        socketId: "testSocketId",
      });
      const now = new Date();
      account.updateLastCommentTime(now);
      expect(account.lastCommentTime).toEqual(now);
    });
  });

  describe("#updateIsMobile", () => {
    it("should update isMobile", () => {
      const account = Account.instantiate({
        idGenerator: idGeneratorMock,
        socketId: "testSocketId",
      });
      account.updateIsMobile(true);
      expect(account.isMobile).toBe(true);
      account.updateIsMobile(false);
      expect(account.isMobile).toBe(false);
    });
  });

  describe("#speak", () => {
    it("should return true if this speak follows the rules", () => {
      const account = Account.instantiate({
        idGenerator: idGeneratorMock,
        socketId: "testSocketId",
      });
      account.updateLastCommentTime(new Date(2000, 1, 1, 10, 30, 0, 0));
      const now = new Date(2000, 1, 1, 10, 30, 30);
      const result: boolean = account.speak(now);
      expect(result).toBe(true);
    });

    it("should return false if this speak doesn't follow the rules", () => {
      const account = Account.instantiate({
        idGenerator: idGeneratorMock,
        socketId: "testSocketId",
      });
      account.updateLastCommentTime(new Date(2000, 1, 1, 10, 30, 0, 0));
      const now = new Date(2000, 1, 1, 10, 30, 0, 100);
      const result: boolean = account.speak(now);
      expect(result).toBe(false);
    });
  });
});
