import { v4 } from "uuid";

export interface IDGeneratable {
  generate(): string;
}

export class IDGenerator implements IDGeneratable {
  public static instance: IDGenerator = new IDGenerator();
  private constructor() {}

  generate(): string {
    return v4();
  }
}
