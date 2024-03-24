// インフラを通じて取得できるクライアントの情報

export interface ClientInfo {
  readonly socketId: string;
  readonly ipAddress: string;
  readonly isMobile: boolean;
}
