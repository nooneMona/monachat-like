import { BlackTrip, WhiteTrip } from "./trip";
import { WhiteTripper, BlackTripper, TripperInput } from "./tripper";

const WhiteTripperMock = jest.fn<WhiteTripper, []>().mockImplementation(() => {
  return {
    execute: jest.fn().mockReturnValue("tripResult"),
  };
});
const BlackTripperMock = jest.fn<BlackTripper, []>().mockImplementation(() => {
  return {
    execute: jest.fn().mockReturnValue("tripResult"),
  };
});
const TripperInputMock = jest.fn<TripperInput, []>().mockImplementation(() => {
  return {
    getValue: jest.fn().mockReturnValue("tiv"),
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
