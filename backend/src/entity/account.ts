import { Character } from "../domain/character";
import { IDGeneratable } from "../domain/idGenerator";

export type AccountParameters = {
  idGenerator: IDGeneratable;
  socketId: string;
};

// アカウント情報（＝システムで管理しているユーザーデータ）
export class Account {
  // - 認証認可に関わる属性
  // もなちゃとで一意に識別できるID
  readonly id: string;
  // アカウント利用者に要求するトークン
  readonly token: string;
  // Socket.ioのソケットID
  socketId: string;
  // アカウントの活性に関するフラグ
  alive: boolean = true;

  // 操作するキャラクター
  character: Character = new Character();

  // - 追加属性
  // モバイルユーザーかどうか
  isMobile?: boolean;
  // 最後の発言
  lastCommentTime: Date = new Date();

  private constructor(id: string, token: string, socketId: string) {
    this.id = id;
    this.token = token;
    this.socketId = socketId;
  }

  static instantiate({ idGenerator, socketId }: AccountParameters) {
    const id = idGenerator.generate();
    const token = idGenerator.generate();
    const socket = socketId;
    return new Account(id, token, socket);
  }

  updateSocketId(socketId: string) {
    this.socketId = socketId;
  }

  updateAlive(alive: boolean) {
    this.alive = alive;
  }

  speak(now: Date): boolean {
    const commentIntervalMilliSec = 800;
    if (
      now.getTime() - this.lastCommentTime.getTime() <
      commentIntervalMilliSec
    ) {
      return false;
    }
    this.updateLastCommentTime(now);
    return true;
  }

  updateIsMobile(isMobile: boolean) {
    this.isMobile = isMobile;
  }

  updateLastCommentTime(lastCommentTime: Date) {
    this.lastCommentTime = lastCommentTime;
  }
}
