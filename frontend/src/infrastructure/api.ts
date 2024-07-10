export type ColorResponse = {
  id: number;
  r: number;
  g: number;
  b: number;
};

export type NewsResponse = {
  day: string;
  info: string;
  isNew: boolean;
}[];

export type CharactersResponse = {
  characters: string[];
  genre: string;
}[];

export type RoomResponse = {
  entrance: {
    id: string;
  };
  rooms: {
    id: string;
    name: string;
    img_url: string;
  }[];
};
