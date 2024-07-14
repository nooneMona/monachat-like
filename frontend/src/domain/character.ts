import { Trip, TripFactory } from "./trip";

export type CharacterProps = {
  name: string;
  ihash: string;
  tripInput?: string;
  trip?: string;
};

export class Character {
  private constructor(
    private readonly _name: string,
    private readonly _ihash: Trip,
    private readonly _tripInput: string | undefined,
    private readonly _trip: Trip | undefined,
  ) {}

  static create(props: CharacterProps): Character {
    const ihash = TripFactory.create("white", props.ihash);
    const trip =
      props.trip !== undefined && props.trip !== ""
        ? TripFactory.create("black", props.trip)
        : undefined;
    return new Character(props.name, ihash, props.tripInput, trip);
  }

  static createFromText(text: string): Character {
    let name: string | undefined = "";
    let tripInput = "";
    if (text.includes("#")) {
      const splitNames = text.split("#");
      [name] = splitNames;
      tripInput = splitNames.slice(1).join("#");
    } else {
      // トリップの予約語 `#` が含まれていない場合
      name = text;
    }
    const trimmedName = name?.trim() ?? "";
    const nameResult = trimmedName === "" ? "名無しさん" : trimmedName;
    return Character.create({ name: nameResult, ihash: "", tripInput });
  }

  get name(): string {
    return this._name;
  }

  // TODO: string | undefined じゃなくていいのか検討
  get tripInput(): string {
    return this._tripInput ?? "";
  }

  nameTag(): string {
    return `${this._name}${this.tripTag()}`;
  }

  tripTag(): string {
    return this._trip !== undefined && this._trip.value !== ""
      ? this._trip.toString()
      : this._ihash.toString();
  }
}
