import { BlackTrip, WhiteTrip } from "./trip";
import { WhiteTripper, BlackTripper, TripperInput } from "./tripper";

const WhiteTripperMock = vi.fn().mockImplementation(() => {
  return {
    execute: vi.fn().mockReturnValue("tripResult"),
  };
});
const BlackTripperMock = vi.fn().mockImplementation(() => {
  return {
    execute: vi.fn().mockReturnValue("tripResult"),
  };
});
const TripperInputMock = vi.fn().mockImplementation(() => {
  return {
    getValue: vi.fn().mockReturnValue("tiv"),
  };
});

describe("WhiteTrip", () => {
  it("should create value by tripper", () => {
    const tripper = new WhiteTripperMock();
    const tripperInput = new TripperInputMock();
    const whiteTrip = new WhiteTrip(tripperInput, tripper);
    expect(tripper.execute).toBeCalledTimes(1);
    expect(whiteTrip.value).toBe("tripResult");
  });
});

describe("BlackTrip", () => {
  it("should create value by tripper", () => {
    const tripper = new BlackTripperMock();
    const tripperInput = new TripperInputMock();
    const blackTrip = new BlackTrip(tripperInput, tripper);
    expect(tripper.execute).toBeCalledTimes(1);
    expect(blackTrip.value).toBe("tripResult");
  });
});
