import { Character } from "./character";

describe("Character", () => {
  it("should create a character with trip", () => {
    const character = Character.create({ name: "名無しさん", ihash: "ihash", trip: "trip" });
    expect(character.nameTag()).toBe("名無しさん◆trip");
  });

  it("should create a character with empty trip", () => {
    const character = Character.create({ name: "名無しさん", ihash: "ihash", trip: "" });
    expect(character.nameTag()).toBe("名無しさん◇ihash");
  });

  it("should create a character without trip", () => {
    const character = Character.create({ name: "名無しさん", ihash: "ihash", trip: undefined });
    expect(character.nameTag()).toBe("名無しさん◇ihash");
  });
});
