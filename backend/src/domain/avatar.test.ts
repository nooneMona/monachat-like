import { Avatar } from "./avatar";
import { BlackTripperInput } from "./blackTripperInput";
import { CharType } from "./charType";
import { Color } from "./color";
import { IP } from "./ip";
import { Name } from "./name";
import { BlackTrip, WhiteTrip } from "./trip";
import { FourChanTripper, HashTripper } from "./tripper";

describe("avatar", () => {
  let avatarData: Avatar;
  beforeEach(() => {
    avatarData = new Avatar({
      name: new Name("田中太郎"),
      charType: new CharType("unknown2"),
      charColor: Color.instantiateByMona({ r: 50, g: 50, b: 50 }),
      blackTrip: undefined,
      whiteTrip: new WhiteTrip(new IP("000.111.222.333"), new HashTripper("")),
    });
  });

  it("should be constructed", () => {
    const avatar = avatarData;
    expect(avatar).toBeDefined();
  });

  it("should be constructed if color is invalid", () => {
    const whiteAvatar = new Avatar({
      name: new Name("田中太郎"),
      charType: new CharType("unknown2"),
      charColor: undefined, // <-
      blackTrip: undefined,
      whiteTrip: new WhiteTrip(new IP("000.111.222.333"), new HashTripper("")),
    });
    expect(whiteAvatar).toBeDefined();
    expect(whiteAvatar.charColor.r).toBe(100);
    expect(whiteAvatar.charColor.g).toBe(100);
    expect(whiteAvatar.charColor.b).toBe(100);
  });

  it("should be updated on room selection screen", () => {
    const avatar = avatarData;
    const blackColor = Color.instantiateByMona({ r: 0, g: 0, b: 0 });
    const updatedAvatar = avatar.updatedBy({
      charColor: blackColor,
      charType: new CharType("giko"),
    });
    expect(updatedAvatar.charColor.r).toBe(0);
    expect(updatedAvatar.charColor.r).not.toBe(100);
    expect(updatedAvatar.charType.value).toBe("giko");
    expect(updatedAvatar.charType.value).not.toBe("mona");
    // 元のデータが変わらないこと
    expect(avatar.charColor.r).not.toBe(0);
    expect(avatar.charColor.r).toBe(50);
    expect(avatar.charType.value).not.toBe("giko");
    expect(avatar.charType.value).toBe("unknown2");
    // 指定していないデータが変わっていないこと
    expect(updatedAvatar.name.value).toBe(avatar.name.value);
    expect(updatedAvatar.whiteTrip?.value).toBe(avatar.whiteTrip?.value);
    expect(updatedAvatar.blackTrip?.value).toBe(avatar.blackTrip?.value);
  });

  it("should be updated on entrance screen", () => {
    const avatar = avatarData;
    const whiteTrip = new WhiteTrip(
      new IP("172.0.0.3"),
      new HashTripper("hoge")
    );
    const blackTrip = new BlackTrip(
      new BlackTripperInput("aaaa"),
      new FourChanTripper()
    );
    const updatedAvatar = avatar.updatedBy({
      name: new Name("田中さん"),
      whiteTrip,
      blackTrip,
    });
    expect(updatedAvatar.name.value).toBe("田中さん");
    expect(updatedAvatar.name.value).not.toBe("名無しさん");
    expect(updatedAvatar.whiteTrip?.value).toBe(whiteTrip.value);
    expect(updatedAvatar.whiteTrip?.value).not.toBe(avatar.whiteTrip?.value);
    expect(updatedAvatar.blackTrip?.value).toBe(blackTrip.value);
    expect(updatedAvatar.blackTrip?.value).not.toBe(avatar.blackTrip?.value);
    // 元のデータが変わらないこと
    expect(avatar.name.value).not.toBe("田中さん");
    expect(avatar.name.value).toBe("田中太郎");
    expect(avatar.whiteTrip?.value).not.toBe(whiteTrip.value);
    expect(avatar.whiteTrip?.value).toBe(avatar.whiteTrip?.value);
    expect(avatar.blackTrip?.value).not.toBe(blackTrip.value);
    expect(avatar.blackTrip?.value).toBe(avatar.blackTrip?.value);
    // 指定していないデータが変わっていないこと
    expect(updatedAvatar.charColor.r).toBe(avatar.charColor.r);
    expect(updatedAvatar.charType.value).toBe(avatar.charType.value);
  });

  it("should copy correctly", () => {
    const copiedAvatar = avatarData.copy();
    expect(copiedAvatar.name.value).toBe("田中太郎");
    expect(copiedAvatar.charType.value).toBe("unknown2");
    expect(copiedAvatar.charColor.r).toBe(50);
    expect(copiedAvatar.blackTrip).toBeUndefined();
    expect(copiedAvatar.whiteTrip?.value).toBe(avatarData.whiteTrip?.value);
  });
});
