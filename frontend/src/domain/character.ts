import { Trip, TripFactory } from "./trip";

export type CharacterProps = {
  name: string;
  ihash: string;
  trip?: string;
};

export class Character {
  private constructor(
    private readonly _name: string,
    private readonly _ihash: Trip,
    private readonly _trip: Trip | undefined,
  ) {}

  static create(props: CharacterProps): Character {
    const ihash = TripFactory.create("white", props.ihash);
    const trip =
      props.trip !== undefined && props.trip !== ""
        ? TripFactory.create("black", props.trip)
        : undefined;
    return new Character(props.name, ihash, trip);
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
