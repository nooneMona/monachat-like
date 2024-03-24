import { Room } from "./room";
export const COUNT = "COUNT";

export interface COUNTResponse {
  c: number;
  n: string;
  rooms: Room[];
}
