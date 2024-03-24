import { AccountRepository } from "./accountRepository";
import { userData } from "../test/data";
import { BlackTrip, WhiteTrip } from "../domain/trip";
import { Position } from "../domain/position";
import { Direction } from "../domain/direction";
import { Avatar } from "../domain/avatar";
import { Color } from "../domain/color";
import { CharType } from "../domain/charType";
import { Name } from "../domain/name";
import { Status } from "../domain/status";
import {
  MockBlackTripper,
  MockTripperInput,
  MockWhiteTripper,
} from "../test/mocks";

describe("AccountRepository", () => {
  const whiteTrip = new WhiteTrip(
    new MockTripperInput("white input"),
    new MockWhiteTripper()
  );
  const blackTrip = new BlackTrip(
    new MockTripperInput("black input"),
    new MockBlackTripper()
  );
  let accountRepsitory: AccountRepository;

  beforeEach(() => {
    accountRepsitory = AccountRepository.getInstance();
    accountRepsitory.deleteAll();
  });

  describe("story", () => {
    it("main story", () => {
      // アカウント作成
      const account = accountRepsitory.create("socketId");
      expect(account.socketId).toBe("socketId");

      // トークンによるアカウントの照合
      let gotAccount = accountRepsitory.getAccountByToken(account.token);
      let gotAccountId = gotAccount!.id;
      expect(gotAccountId).toBe(account.id);

      // 部屋に入って、部屋を変える
      const currentAccount = accountRepsitory.getAccountBySocketId("socketId")!;
      expect(currentAccount.character.currentRoom).toBeUndefined();
      accountRepsitory.updateCharacter(
        currentAccount.id,
        currentAccount.character.moveRoom("/1")
      );
      const newCurrentAccount =
        accountRepsitory.getAccountBySocketId("socketId")!;
      expect(newCurrentAccount.character.currentRoom).toBe("/1");

      // ユーザー状態の更新
      let updatedCharacter = currentAccount.character.copy();
      updatedCharacter = updatedCharacter.movePosition(
        Position.instantiate({
          x: userData.tanaka().x,
          y: userData.tanaka().y,
        })!
      );
      updatedCharacter = updatedCharacter.turn(
        Direction.instantiateByScl(userData.tanaka().scl)
      );
      updatedCharacter = updatedCharacter.moveRoom("/1");
      updatedCharacter = updatedCharacter.updateAvatar(
        new Avatar({
          charColor: Color.instantiateByMona({
            r: userData.tanaka().r,
            g: userData.tanaka().g,
            b: userData.tanaka().b,
          })!,
          charType: new CharType(userData.tanaka().type),
          name: new Name(userData.tanaka().name),
          blackTrip,
          whiteTrip,
        })
      );
      updatedCharacter = updatedCharacter.updateStatus(
        new Status(userData.tanaka().stat)
      );
      accountRepsitory.updateCharacter(currentAccount.id, updatedCharacter);

      accountRepsitory.updateAlive(currentAccount.id, true);
      accountRepsitory.updateIsMobile(
        currentAccount.id,
        userData.tanaka().isMobile
      );

      expect(
        accountRepsitory
          .fetchUsers("/1")
          .filter((e) => e.id === currentAccount.id)[0]
      ).toEqual({
        ...userData.tanaka(),
        ihash: "white input+whiteTripperResult",
        trip: "black input+blackTripperResult",
        id: currentAccount.id,
      });

      // ソケットIDの更新
      const nextAccount1 = accountRepsitory.getAccountBySocketId("socketId")!;
      expect(nextAccount1.id).toBe(account.id);
      const noExistedAccount =
        accountRepsitory.getAccountBySocketId("noExisted");
      expect(noExistedAccount).toBeUndefined();
      accountRepsitory.updateSocketIdWithValidToken(
        nextAccount1.token,
        "socketNewId"
      );
      const newAccount2 = accountRepsitory.getAccountBySocketId("socketNewId")!;
      expect(newAccount2.id).toBe(account.id);
    });
  });

  describe("#getAccountByToken", () => {
    it("should return account if token is valid", () => {
      const account1 = accountRepsitory.create("socketId");
      const account2 = accountRepsitory.create("socketId");
      const account = accountRepsitory.getAccountByToken(account1.token);
      expect(account?.id).toBe(account1.id);
      expect(account?.id).not.toBe(account2.id);
    });

    it("should return undefined if token is invalid.", () => {
      accountRepsitory.create("socketId");
      const account = accountRepsitory.getAccountByToken("invalidID");
      expect(account).toBeUndefined();
    });

    it("should return undefined if token is undefined.", () => {
      accountRepsitory.create("socketId");
      const account = accountRepsitory.getAccountByToken(undefined);
      expect(account).toBeUndefined();
    });
  });

  describe("#getAccountBySocketId", () => {
    it("should return correct account if socketID is valid.", () => {
      const { id } = accountRepsitory.create("socketId");
      const gotID = accountRepsitory.getAccountBySocketId("socketId")?.id;
      expect(gotID).toBe(id);
    });

    it("should return undefined if socketID is invalid.", () => {
      const gotID =
        accountRepsitory.getAccountBySocketId("invalidSocketId")?.id;
      expect(gotID).toBeUndefined();
    });
  });

  describe("#getBannedUsers", () => {
    it("should return empty string if BAN_USER_IHASHS is unset", () => {
      const banUserIhash = accountRepsitory.getBannedIhashes();
      expect(banUserIhash).toStrictEqual([]);
    });

    it("should return BAN_USER_IHASHS to array if env file read and contains only one", () => {
      process.env.BAN_USER_IHASHS = "BhIdZGEYPL";
      const banUserIhash = accountRepsitory.getBannedIhashes();
      expect(banUserIhash).toStrictEqual(["BhIdZGEYPL"]);
    });

    it("should return BAN_USER_IHASHS to array if env file read and only colon", () => {
      process.env.BAN_USER_IHASHS = ":";
      const banUserIhash = accountRepsitory.getBannedIhashes();
      expect(banUserIhash).toStrictEqual(["", ""]);
    });

    it("should return BAN_USER_IHASHS to array if env file read", () => {
      process.env.BAN_USER_IHASHS = "BhIdZGEYPL:TANAKAXXXX";
      const banUserIhash = accountRepsitory.getBannedIhashes();
      expect(banUserIhash).toStrictEqual(["BhIdZGEYPL", "TANAKAXXXX"]);
    });
  });

  describe("#create", () => {
    it("should make object", () => {
      const account = accountRepsitory.create("socketId");
      expect(account).toBeDefined();
    });

    it("should add to array.", () => {
      let users = accountRepsitory.fetchUsers("/1");
      expect(users.length).toBe(0);
      const account = accountRepsitory.create("socketId");
      accountRepsitory.updateCharacter(
        account.id,
        account.character.moveRoom("/1")
      );
      users = accountRepsitory.fetchUsers("/1");
      expect(users.length).toBe(1);
    });
  });

  describe("#fetchUsers", () => {
    it("should return only alive users", () => {
      const account1 = accountRepsitory.create("socketId1");
      const updatedCharacter1 = account1.character.moveRoom("/1");
      accountRepsitory.updateCharacter(account1.id, updatedCharacter1);
      accountRepsitory.updateAlive(account1.id, false);
      const account2 = accountRepsitory.create("socketId2");
      const updatedCharacter2 = account2.character.moveRoom("/1");
      accountRepsitory.updateCharacter(account2.id, updatedCharacter2);
      accountRepsitory.updateAlive(account2.id, true);
      const users = accountRepsitory.fetchUsers("/1");
      expect(users.length).toBe(1);
      const user1 = users.find((v) => v.id === account1.id);
      expect(user1).toBeUndefined();
      const user2 = users.find((v) => v.id === account2.id);
      expect(user2).toBeDefined();
    });

    it("should return only users in same rooms", () => {
      const account1 = accountRepsitory.create("socketId1");
      const updatedCharacter1 = account1.character.moveRoom("/1");
      accountRepsitory.updateCharacter(account1.id, updatedCharacter1);
      accountRepsitory.updateAlive(account1.id, true);
      const account2 = accountRepsitory.create("socketId2");
      const updatedCharacter2 = account2.character.moveRoom("/2");
      accountRepsitory.updateCharacter(account2.id, updatedCharacter2);
      accountRepsitory.updateAlive(account2.id, true);
      const users = accountRepsitory.fetchUsers("/2");
      expect(users.length).toBe(1);
      const user1 = users.find((v) => v.id === account1.id);
      expect(user1).toBeUndefined();
      const user2 = users.find((v) => v.id === account2.id);
      expect(user2).toBeDefined();
    });
  });

  describe("#fetchUser", () => {
    it("should return only alive user", () => {
      const account1 = accountRepsitory.create("socketId1");
      const updatedCharacter1 = account1.character.moveRoom("/1");
      accountRepsitory.updateCharacter(account1.id, updatedCharacter1);
      accountRepsitory.updateAlive(account1.id, false);
      const account2 = accountRepsitory.create("socketId2");
      const updatedCharacter2 = account2.character.moveRoom("/1");
      accountRepsitory.updateCharacter(account2.id, updatedCharacter2);
      accountRepsitory.updateAlive(account2.id, true);
      const user1 = accountRepsitory.fetchUser(account1.id, "/1");
      expect(user1).toBeUndefined();
      const user2 = accountRepsitory.fetchUser(account2.id, "/1");
      expect(user2).toBeDefined();
    });

    it("should return only user in same rooms", () => {
      const account1 = accountRepsitory.create("socketId1");
      const updatedCharacter1 = account1.character.moveRoom("/1");
      accountRepsitory.updateCharacter(account1.id, updatedCharacter1);
      accountRepsitory.updateAlive(account1.id, true);
      const account2 = accountRepsitory.create("socketId2");
      const updatedCharacter2 = account2.character.moveRoom("/2");
      accountRepsitory.updateCharacter(account2.id, updatedCharacter2);
      accountRepsitory.updateAlive(account2.id, true);
      const user1 = accountRepsitory.fetchUser(account1.id, "/2");
      expect(user1).toBeUndefined();
      const user2 = accountRepsitory.fetchUser(account2.id, "/2");
      expect(user2).toBeDefined();
    });
  });

  describe("#getRooms", () => {
    it("should return some rooms if exists", () => {
      const account1 = accountRepsitory.create("socketId1");
      const updatedCharacter1 = account1.character.moveRoom("/1");
      accountRepsitory.updateCharacter(account1.id, updatedCharacter1);
      accountRepsitory.updateAlive(account1.id, true);
      const account2 = accountRepsitory.create("socketId2");
      const updatedCharacter2 = account2.character.moveRoom("/1");
      accountRepsitory.updateCharacter(account2.id, updatedCharacter2);
      accountRepsitory.updateAlive(account2.id, true);
      const account3 = accountRepsitory.create("socketId3");
      const updatedCharacter3 = account3.character.moveRoom("/2");
      accountRepsitory.updateCharacter(account3.id, updatedCharacter3);
      accountRepsitory.updateAlive(account3.id, true);
      const account4 = accountRepsitory.create("socketId4");
      const updatedCharacter4 = account4.character.moveRoom("/1");
      accountRepsitory.updateCharacter(account4.id, updatedCharacter4);
      accountRepsitory.updateAlive(account4.id, false);
      const rooms = accountRepsitory.getRooms();
      expect(rooms).toStrictEqual([
        { n: "/1", c: 2 },
        { n: "/2", c: 1 },
      ]);
    });

    it("should return some rooms whose name is not null", () => {
      const account1 = accountRepsitory.create("socketId1");
      const updatedCharacter1 = account1.character.moveRoom("/1");
      accountRepsitory.updateCharacter(account1.id, updatedCharacter1);
      accountRepsitory.updateAlive(account1.id, true);
      const account2 = accountRepsitory.create("socketId2");
      accountRepsitory.updateAlive(account2.id, true);
      const rooms = accountRepsitory.getRooms();
      expect(rooms).toStrictEqual([{ n: "/1", c: 1 }]);
    });

    it("should return empty array if no exists", () => {
      const rooms = accountRepsitory.getRooms();
      expect(rooms).toStrictEqual([]);
    });
  });

  describe("#countSameIhash", () => {
    it("should return same ihash counter equal 1 if 1 user login by only 1 account", () => {
      const account1 = accountRepsitory.create("soketId1");
      accountRepsitory.updateCharacter(
        account1.id,
        account1.character
          .copy()
          .updateAvatar(account1.character.avatar.updatedBy({ whiteTrip }))
      );
      const count = accountRepsitory.countSameIhash(whiteTrip.value);
      expect(count).toBe(1);
    });

    it("should return same ihash counter equal 2 if 1 user login by 2 account have same ihash", () => {
      const account1 = accountRepsitory.create("soketId1");
      accountRepsitory.updateCharacter(
        account1.id,
        account1.character
          .copy()
          .updateAvatar(account1.character.avatar.updatedBy({ whiteTrip }))
      );
      const account2 = accountRepsitory.create("soketId2");
      accountRepsitory.updateCharacter(
        account2.id,
        account2.character
          .copy()
          .updateAvatar(account2.character.avatar.updatedBy({ whiteTrip }))
      );
      const count = accountRepsitory.countSameIhash(whiteTrip.value);
      expect(count).toBe(2);
    });

    it("should return same ihash counter equal 3 if 1 user login by 3 account have same ihash", () => {
      const account1 = accountRepsitory.create("soketId1");
      accountRepsitory.updateCharacter(
        account1.id,
        account1.character
          .copy()
          .updateAvatar(account1.character.avatar.updatedBy({ whiteTrip }))
      );
      const account2 = accountRepsitory.create("soketId2");
      accountRepsitory.updateCharacter(
        account2.id,
        account2.character
          .copy()
          .updateAvatar(account2.character.avatar.updatedBy({ whiteTrip }))
      );
      const account3 = accountRepsitory.create("soketId3");
      accountRepsitory.updateCharacter(
        account3.id,
        account3.character
          .copy()
          .updateAvatar(account3.character.avatar.updatedBy({ whiteTrip }))
      );
      const count = accountRepsitory.countSameIhash(whiteTrip.value);
      expect(count).toBe(3);
    });

    it("should return same ihash counter equal 1 if 1 user login by 2 account have same ihash but 1 account does not alive", () => {
      const account1 = accountRepsitory.create("soketId1");
      accountRepsitory.updateCharacter(
        account1.id,
        account1.character
          .copy()
          .updateAvatar(account1.character.avatar.updatedBy({ whiteTrip }))
      );
      const account2 = accountRepsitory.create("soketId2");
      accountRepsitory.updateCharacter(
        account2.id,
        account2.character
          .copy()
          .updateAvatar(account2.character.avatar.updatedBy({ whiteTrip }))
      );
      accountRepsitory.updateAlive(account2.id, false);
      const count = accountRepsitory.countSameIhash(whiteTrip.value);
      expect(count).toBe(1);
    });
  });

  describe("#isPermittedToEnter", () => {
    it("should isPermittedToEnter return true if 1 user login by only 1 account", () => {
      const account1 = accountRepsitory.create("soketId1");
      accountRepsitory.updateCharacter(
        account1.id,
        account1.character
          .copy()
          .updateAvatar(account1.character.avatar.updatedBy({ whiteTrip }))
      );
      const isPermitted = accountRepsitory.isPermittedToEnter(
        userData.tanaka().ihash
      );
      expect(isPermitted).toBe(true);
    });

    it("should isPermittedToEnter return true if 1 user login by 2 account have same ihash when PERMISSION_MULTI_ACCOUNT is true", () => {
      process.env.PERMISSION_MULTI_ACCOUNT = undefined;
      const account1 = accountRepsitory.create("soketId1");
      accountRepsitory.updateCharacter(
        account1.id,
        account1.character
          .copy()
          .updateAvatar(account1.character.avatar.updatedBy({ whiteTrip }))
      );
      const account2 = accountRepsitory.create("soketId2");
      accountRepsitory.updateCharacter(
        account2.id,
        account2.character
          .copy()
          .updateAvatar(account2.character.avatar.updatedBy({ whiteTrip }))
      );
      const isPermitted = accountRepsitory.isPermittedToEnter(
        userData.tanaka().ihash
      );
      expect(isPermitted).toBe(true);
    });

    it("should isPermittedToEnter return false if 1 user login by 3 account have same ihash when PERMISSION_MULTI_ACCOUNT is false(undefined)", () => {
      process.env.PERMISSION_MULTI_ACCOUNT = undefined;
      const account1 = accountRepsitory.create("soketId1");
      accountRepsitory.updateCharacter(
        account1.id,
        account1.character
          .copy()
          .updateAvatar(account1.character.avatar.updatedBy({ whiteTrip }))
      );
      const account2 = accountRepsitory.create("soketId2");
      accountRepsitory.updateCharacter(
        account2.id,
        account2.character
          .copy()
          .updateAvatar(account2.character.avatar.updatedBy({ whiteTrip }))
      );
      const account3 = accountRepsitory.create("soketId3");
      accountRepsitory.updateCharacter(
        account3.id,
        account3.character
          .copy()
          .updateAvatar(account3.character.avatar.updatedBy({ whiteTrip }))
      );
      const isPermitted = accountRepsitory.isPermittedToEnter(whiteTrip.value);
      expect(isPermitted).toBeFalsy();
    });

    it("should isPermittedToEnter return true if 1 user login by 2 account have same ihash when PERMISSION_MULTI_ACCOUNT is true", () => {
      process.env.PERMISSION_MULTI_ACCOUNT = "true";
      const account1 = accountRepsitory.create("soketId1");
      accountRepsitory.updateCharacter(
        account1.id,
        account1.character
          .copy()
          .updateAvatar(account1.character.avatar.updatedBy({ whiteTrip }))
      );
      const account2 = accountRepsitory.create("soketId2");
      accountRepsitory.updateCharacter(
        account2.id,
        account2.character
          .copy()
          .updateAvatar(account2.character.avatar.updatedBy({ whiteTrip }))
      );
      const isPermitted = accountRepsitory.isPermittedToEnter(
        userData.tanaka().ihash
      );
      expect(isPermitted).toBe(true);
    });

    it("should isPermittedToEnter return true if 1 user login by 2 account have same ihash but 1 accout does not alive when PERMISSION_MULTI_ACCOUNT is true", () => {
      process.env.PERMISSION_MULTI_ACCOUNT = undefined;
      accountRepsitory.create("soketId1");
      const account2 = accountRepsitory.create("socketID2");
      accountRepsitory.updateAlive(account2.id, false);
      const isPermitted = accountRepsitory.isPermittedToEnter(
        userData.tanaka().ihash
      );
      expect(isPermitted).toBe(true);
    });

    describe("#updateCharacter", () => {
      it("should update character", () => {
        const account = accountRepsitory.create("socketId");
        const updatedCharacter = account.character.copy().moveRoom("/1");
        accountRepsitory.updateCharacter(account.id, updatedCharacter);
        const gotAccount = accountRepsitory.getAccountBySocketId("socketId");
        expect(gotAccount?.character.currentRoom).toBe("/1");
      });

      it("should not update character", () => {
        const account = accountRepsitory.create("socketId");
        const updatedCharacter = account.character.copy().moveRoom("/1");
        accountRepsitory.updateCharacter("notFoundId", updatedCharacter);
        const gotAccount = accountRepsitory.getAccountBySocketId("socketId");
        expect(gotAccount?.character.currentRoom).toBeUndefined();
      });
    });
  });
});
