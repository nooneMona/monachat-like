// TODO: どこがOptionalなのか見極める
export type ChatCharacterUser = {
  id: string;
  x: number;
  y: number;
  dispX: number;
  dispY: number;
  scl: number;
  stat: string;
  trip: string;
  ihash: string;
  name: string;
  rgbaValue: string;
  hexValue: string;
  type: string;
  isMobile: boolean;
  alive: boolean;
  width: number;
  height: number;
  r: number;
  g: number;
  b: number;
  isIgnored: boolean;
};

export type ChatCharacterUserDict = { [key in string]: ChatCharacterUser };

export type ChatMessage = {
  id: string;
  cmt: string;
  style: number;
  typing: { count: number; milliTime: number };
};

export type ChatMessages = (ChatMessage & { messageID: string })[];
