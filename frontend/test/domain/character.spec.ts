import { Character } from "@/domain/character";

describe("Character", () => {
  it("should create a character with trip", () => {
    expect.assertions(1);
    const character = Character.create({ name: "名無しさん", ihash: "ihash", trip: "trip" });
    expect(character.nameTag()).toBe("名無しさん◆trip");
  });

  it("should create a character with empty trip", () => {
    expect.assertions(1);
    const character = Character.create({ name: "名無しさん", ihash: "ihash", trip: "" });
    expect(character.nameTag()).toBe("名無しさん◇ihash");
  });

  it("should create a character without trip", () => {
    expect.assertions(1);
    const character = Character.create({ name: "名無しさん", ihash: "ihash", trip: undefined });
    expect(character.nameTag()).toBe("名無しさん◇ihash");
  });

  it("should create from text with trip", () => {
    expect.assertions(2);
    const character = Character.createFromText("名無しさん#trip");
    expect(character.name).toBe("名無しさん");
    expect(character.tripInput).toBe("trip");
  });

  it("should create from text without trip", () => {
    expect.assertions(2);
    const character = Character.createFromText("名無しさん");
    expect(character.name).toBe("名無しさん");
    expect(character.tripInput).toBe("");
  });
});
