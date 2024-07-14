export type TripType = "black" | "white";

export class TripFactory {
  static create(type: TripType, value: string): Trip {
    switch (type) {
      case "black":
        return BlackTrip.create(value);
      case "white":
        return WhiteTrip.create(value);
    }
  }
}

export abstract class Trip {
  protected constructor(
    protected readonly _value: string,
    protected readonly _type: TripType,
  ) {}

  get value(): string {
    return this._value;
  }

  get type(): TripType {
    return this._type;
  }

  abstract toString(): string;
}

export class BlackTrip extends Trip {
  private constructor(protected readonly _value: string) {
    super(_value, "black");
  }

  static create(value: string): BlackTrip {
    return new BlackTrip(value);
  }

  toString(): string {
    return `◆${this._value.slice(0, 10)}`;
  }
}

export class WhiteTrip extends Trip {
  private constructor(protected readonly _value: string) {
    super(_value, "white");
  }

  static create(value: string): WhiteTrip {
    return new WhiteTrip(value);
  }

  toString(): string {
    return `◇${this._value.slice(0, 6)}`;
  }
}
