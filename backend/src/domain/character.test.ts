import { Avatar } from "./avatar";
import { BlackTripperInput } from "./blackTripperInput";
import { CharType } from "./charType";
import { Character } from "./character";
import { Color } from "./color";
import { Direction, DirectionValue } from "./direction";
import { IP } from "./ip";
import { Name } from "./name";
import { Position } from "./position";
import { Status } from "./status";
import { BlackTrip, WhiteTrip } from "./trip";
import { FourChanTripper, HashTripper } from "./tripper";

describe("Character", () => {
  describe("#updateAvatar", () => {
    it("should update avatar", () => {
      const character = new Character();
      const avatar = new Avatar({
        charType: new CharType("giko"),
        charColor: Color.instantiateByMona({ r: 20, g: 20, b: 20 }),
        name: new Name("ほんとのなまえ"),
        blackTrip: new BlackTrip(
          new BlackTripperInput("aa"),
          new FourChanTripper()
        ),
        whiteTrip: new WhiteTrip(new IP("172.0.0.1"), new HashTripper("seed")),
      });
      const character2 = character.updateAvatar(avatar);
      expect(character2.avatar.name.value).toBe("ほんとのなまえ");
    });
  });

  describe("#movePosition", () => {
    it("should move", () => {
      const character = new Character();
      const character2 = character.movePosition(
        Position.instantiate({ x: 24, y: 48 })!
      );
      expect(character2.position).toEqual({ x: 24, y: 48 });
    });
  });

  describe("#turn", () => {
    it("should turn", () => {
      const character = new Character();
      const character2 = character.turn(
        Direction.instantiate(DirectionValue.Left)
      );
      expect(character2.direction.value).toBe(DirectionValue.Left);
      const character3 = character2.turn(
        Direction.instantiate(DirectionValue.Right)
      );
      expect(character3.direction.value).toBe(DirectionValue.Right);
    });
  });

  describe("#updateStatus", () => {
    it("should update status", () => {
      const character = new Character();
      const character2 = character.updateStatus(new Status("ﾏﾀｰﾘ"));
      expect(character2.status.value).toBe("ﾏﾀｰﾘ");
    });
  });

  describe("#updateCurrentRoom", () => {
    it("should update current room", () => {
      const character = new Character();
      const character2 = character.moveRoom("/1");
      expect(character2.currentRoom).toBe("/1");
      const character3 = character2.moveRoom("/2");
      expect(character3.currentRoom).toBe("/2");
    });
  });

  describe("#copy", () => {
    it("should copy correctly", () => {
      const character = new Character()
        .updateAvatar(
          new Avatar({
            charType: new CharType("giko"),
            charColor: Color.instantiateByMona({ r: 20, g: 20, b: 20 }),
            name: new Name("ほんとのなまえ"),
            blackTrip: new BlackTrip(
              new BlackTripperInput("aa"),
              new FourChanTripper()
            ),
            whiteTrip: new WhiteTrip(
              new IP("172.0.0.1"),
              new HashTripper("seed")
            ),
          })
        )
        .updateStatus(new Status("ステータス"))
        .movePosition(
          Position.instantiate({
            x: 10,
            y: 20,
          })!
        )
        .turn(Direction.instantiate(DirectionValue.Left))
        .moveRoom("/1");

      const accountBlackTrip = character.avatar.blackTrip?.value;
      const accountWhiteTrip = character.avatar.whiteTrip?.value;

      // コピーが正常にされることの確認
      const copiedAccount = character.copy();
      expect(copiedAccount.currentRoom).toBe("/1");
      expect(copiedAccount.avatar.charType.value).toBe("giko");
      expect(copiedAccount.avatar.charColor.r).toBe(20);
      expect(copiedAccount.avatar.name.value).toBe("ほんとのなまえ");
      expect(copiedAccount.avatar.blackTrip?.value).toBe(accountBlackTrip);
      expect(copiedAccount.avatar.whiteTrip?.value).toBe(accountWhiteTrip);
      expect(copiedAccount.position.x).toBe(10);
      expect(copiedAccount.direction.value).toBe(DirectionValue.Left);
      expect(copiedAccount.status.value).toBe("ステータス");

      // 参照が切られていることの確認
      character.currentRoom = "/2";
      character.avatar = new Avatar({
        charType: new CharType("ginu"),
        charColor: Color.instantiateByMona({ r: 30, g: 30, b: 30 }),
        name: new Name("ほんとのなまえ2"),
        blackTrip: new BlackTrip(
          new BlackTripperInput("aab"),
          new FourChanTripper()
        ),
        whiteTrip: new WhiteTrip(new IP("172.0.0.2"), new HashTripper("seed2")),
      });
      character.position = Position.instantiate({ x: 30, y: 40 })!;
      character.direction = Direction.instantiate(DirectionValue.Right);
      character.status = new Status("ステータス2");
      expect(copiedAccount.currentRoom).toBe("/1");
      expect(copiedAccount.avatar.charType.value).toBe("giko");
      expect(copiedAccount.avatar.charColor.r).toBe(20);
      expect(copiedAccount.avatar.name.value).toBe("ほんとのなまえ");
      expect(copiedAccount.avatar.blackTrip?.value).toBe(accountBlackTrip);
      expect(copiedAccount.avatar.whiteTrip?.value).toBe(accountWhiteTrip);
      expect(copiedAccount.position.x).toBe(10);
      expect(copiedAccount.direction.value).toBe(DirectionValue.Left);
      expect(copiedAccount.status.value).toBe("ステータス");
    });
  });
});
