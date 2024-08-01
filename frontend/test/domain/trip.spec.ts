import { TripFactory } from "@/domain/trip";

describe("Trip", () => {
  it("should create a black trip", () => {
    expect.assertions(2);
    const blackTrip = TripFactory.create("black", "ABCDE12345FGHIJ67890");
    expect(blackTrip.constructor.name).toBe("BlackTrip");
    expect(blackTrip.toString()).toBe("◆ABCDE12345");
  });

  it("should create a white trip", () => {
    expect.assertions(2);
    const whiteTrip = TripFactory.create("white", "ABCDE12345FGHIJ67890");
    expect(whiteTrip.constructor.name).toBe("WhiteTrip");
    expect(whiteTrip.toString()).toBe("◇ABCDE1");
  });
});
