import { FourChanTripper, HashTripper, TripperInput } from "./tripper";

vi.mock("crypto", async (importOriginal) => {
  const actual = await importOriginal();
  let updateArg = "";
  return {
    ...(actual as any),
    createHash: vi.fn().mockImplementation(() => {
      return {
        update: vi.fn((value) => {
          updateArg = value;
        }),
        digest: vi.fn(() => updateArg),
      };
    }),
  };
});
vi.mock("tripcode", () => ({
  default: vi.fn().mockImplementation(() => "resultTrip"),
}));

let tripInputMockValue: string;
const TripperInputMock = vi.fn().mockImplementation(() => {
  return {
    getValue: vi.fn().mockReturnValue(tripInputMockValue),
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
    expect(result).toBe("qi8nvSdPNC");
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
