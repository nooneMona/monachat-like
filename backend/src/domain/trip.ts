import { Tripper, TripperInput, WhiteTripper, BlackTripper } from "./tripper";

export abstract class Trip<TripperType extends Tripper> {
  readonly value: string;

  public constructor(input: TripperInput, tripper: TripperType) {
    this.value = tripper.execute(input);
  }
}

export class WhiteTrip extends Trip<WhiteTripper> {}

export class BlackTrip extends Trip<BlackTripper> {}
