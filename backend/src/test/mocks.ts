import { IDGeneratable } from "../domain/idGenerator";
import { BlackTripper, TripperInput, WhiteTripper } from "../domain/tripper";

export const IDGeneratorMock = jest
  .fn<IDGeneratable, []>()
  .mockImplementation(() => {
    return {
      generate: jest
        .fn()
        .mockReturnValueOnce("id")
        .mockReturnValueOnce("token"),
    };
  });

export class MockWhiteTripper extends WhiteTripper {
  execute(input: TripperInput): string {
    return `${input.getValue()}+whiteTripperResult`;
  }
}
export class MockBlackTripper extends BlackTripper {
  execute(input: TripperInput): string {
    return `${input.getValue()}+blackTripperResult`;
  }
}
export class MockTripperInput implements TripperInput {
  constructor(private value: string) {}
  getValue(): string {
    return this.value;
  }
}
