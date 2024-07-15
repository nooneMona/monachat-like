import io from "socket.io-client";

export const socketIOInstance = io(import.meta.env.VITE_APP_SOCKET_HOST, {
  path: "/monachatchat/",
  withCredentials: true,
  reconnectionDelay: 200,
  closeOnBeforeunload: false,
});

// TODO: サーバーから localでnpmを読み込む

export type COMResParam = {
  id: string;
  cmt: string;
  style: number;
  typing: { count: number; milliTime: number };
};

export type ENTERResParam = {
  id: string;
  room: string;
  // user
  x?: number;
  y?: number;
  scl?: number;
  stat?: string;
  name?: string;
  ihash?: string;
  trip?: string;
  r?: number;
  g?: number;
  b?: number;
  type?: string;
  isMobile: boolean;
};

export type SETResParam = {
  id: string;
  x: number;
  y: number;
  scl: number;
  stat: string;
  cmd?: string;
  pre?: string;
  param?: string;
  ev?: number;
};

export type IGResParam = {
  id: string;
  stat: "on" | "off";
  ihash: string;
};

export type EXITResParam = {
  id: string;
};

export type USERResParam = {
  readonly id: string; // ID
  x?: number; // X座標
  y?: number; // Y座標
  scl?: number; // 向き
  stat?: string; // 状態
  name?: string; // 名前
  ihash?: string; // 白トリップ
  trip?: string; // 黒トリップ
  r?: number; // 赤成分
  g?: number; // 緑成分
  b?: number; // 青成分
  type?: string; // キャラID

  // 追加属性
  isMobile?: boolean; // モバイルユーザーかどうか
}[];

type RoomResParam = {
  c: number; // count
  n: string; // name
};

export type COUNTResParam = {
  c: number;
  n: string;
  rooms: RoomResParam[];
};

export type AUTHResParam = {
  id: string;
  token: string;
};

export type AWAKEResParam = {
  id: string;
};

export type SLEEPResParam = {
  id: string;
};
