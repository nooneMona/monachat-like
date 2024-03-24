export interface USER {
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
}
