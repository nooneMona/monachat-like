import { TripperInput } from "./tripper";

export class BlackTripperInput implements TripperInput {
  constructor(private readonly value: string) {}

  getValue(): string {
    return this.value;
  }
}
