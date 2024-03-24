import { FourChanTripper, HashTripper, TripperInput } from "./tripper";

jest.mock("crypto", () => {
  let updateArg = "";
  return {
    createHash: jest.fn().mockImplementation(() => {
      return {
        update: jest.fn((value) => {
          updateArg = value;
        }),
        digest: jest.fn(() => updateArg),
      };
    }),
  };
});
jest.mock("tripcode", () => {
  return jest.fn().mockImplementation(() => "resultTrip");
});

let tripInputMockValue: string;
const TripperInputMock = jest.fn<TripperInput, []>().mockImplementation(() => {
  return {
    getValue: jest.fn().mockReturnValue(tripInputMockValue),
  };
});

beforeEach(() => {
  tripInputMockValue = "tiv";
});

describe("HashTripper", () => {
  it("#should generate trip", () => {
    const tripperInput = new TripperInputMock();
    const tripper = new HashTripper("seed12345");
    const result = tripper.execute(tripperInput);
    expect(tripperInput.getValue).toBeCalledTimes(1);
    expect(result).toBe("tivseed123");
  });
});

describe("FourChanTripper", () => {
  it("#should generate trip", () => {
    const tripperInput = new TripperInputMock();
    const tripper = new FourChanTripper();
    const result = tripper.execute(tripperInput);
    expect(tripperInput.getValue).toBeCalledTimes(1);
    expect(result).toBe("resultTrip");
  });

  it("#should not generate trip if input value is empty", () => {
    tripInputMockValue = "";
    const tripperInput = new TripperInputMock();
    const tripper = new FourChanTripper();
    const result = tripper.execute(tripperInput);
    expect(tripperInput.getValue).toBeCalledTimes(1);
    expect(result).toBe("");
  });
});
