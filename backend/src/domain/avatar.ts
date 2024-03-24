import { CharType } from "./charType";
import { Color } from "./color";
import { Name } from "./name";
import { WhiteTrip } from "./trip";
import { BlackTrip } from "./trip";

export type AvatarParameters = {
  charType: CharType;
  charColor: Color | undefined;
  name: Name;
  blackTrip?: BlackTrip;
  whiteTrip?: WhiteTrip;
};

export type AvatarUpdatingParameters = {
  charType?: CharType;
  charColor?: Color;
  name?: Name;
  blackTrip?: BlackTrip;
  whiteTrip?: WhiteTrip;
};

// キャラクターのアバターを表す。
export class Avatar {
  readonly charType: CharType;
  readonly charColor: Color;
  readonly name: Name;
  readonly blackTrip: BlackTrip | undefined; // FIXME:トリップができあがるまでにアバターが存在することはあるかも？
  readonly whiteTrip: WhiteTrip | undefined; // FIXME: トリップができあがるまでにアバターが存在することはあるかも？

  static default(): Avatar {
    return new Avatar({
      charType: new CharType(undefined),
      charColor: Color.white(),
      name: new Name(undefined),
    });
  }

  constructor({
    charType,
    charColor,
    name,
    blackTrip,
    whiteTrip,
  }: AvatarParameters) {
    this.charType = charType;
    this.charColor = charColor ?? Color.white();
    this.name = name;
    this.blackTrip = blackTrip;
    this.whiteTrip = whiteTrip;
  }

  // TODO: 更新のドメイン知識で分離したほうがよさそう
  updatedBy({
    charType,
    charColor,
    name,
    blackTrip,
    whiteTrip,
  }: AvatarUpdatingParameters): Avatar {
    let updatingCharType = this.charType;
    if (charType != null) {
      updatingCharType = charType;
    }
    let updatingCharColor = this.charColor;
    if (charColor != null) {
      updatingCharColor = charColor;
    }
    let updatingName = this.name;
    if (name != null) {
      updatingName = name;
    }
    let updatingBlackTrip = this.blackTrip;
    if (blackTrip != null) {
      updatingBlackTrip = blackTrip;
    }
    let updatingWhiteTrip = this.whiteTrip;
    if (whiteTrip != null) {
      updatingWhiteTrip = whiteTrip;
    }
    return new Avatar({
      charType: updatingCharType,
      charColor: updatingCharColor,
      name: updatingName,
      blackTrip: updatingBlackTrip,
      whiteTrip: updatingWhiteTrip,
    });
  }

  copy(): Avatar {
    return this.updatedBy({
      charType: this.charType,
      charColor: this.charColor,
      name: this.name,
      blackTrip: this.blackTrip,
      whiteTrip: this.whiteTrip,
    });
  }
}
