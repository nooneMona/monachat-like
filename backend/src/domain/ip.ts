import { TripperInput } from "./tripper";

export class IP implements TripperInput {
  constructor(private readonly value: string) {}

  getValue(): string {
    return this.value;
  }
}
