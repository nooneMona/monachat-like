import "dotenv/config";
import crypto from "crypto";
import tripcode from "tripcode";

export interface TripperInput {
  getValue(): string;
}

export abstract class Tripper {
  abstract execute(input: TripperInput): string;
}
export abstract class WhiteTripper extends Tripper {}
export abstract class BlackTripper extends Tripper {}

export class HashTripper extends WhiteTripper {
  public constructor(private readonly seed: string) {
    super();
  }

  execute(input: TripperInput): string {
    const sha512 = crypto.createHash("sha512");
    sha512.update(input.getValue() + this.seed);
    return sha512.digest("base64").slice(0, 10);
  }
}

export class FourChanTripper extends BlackTripper {
  execute(input: TripperInput): string {
    const inputValue = input.getValue();
    if (inputValue === "") {
      return "";
    }
    return tripcode(inputValue);
  }
}
