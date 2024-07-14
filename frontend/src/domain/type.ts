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
};

export type ChatMessage = {
  messageID: string;
  id: string;
  cmt: string;
  style: number;
  typing: string;
};
