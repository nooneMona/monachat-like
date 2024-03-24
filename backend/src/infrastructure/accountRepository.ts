import "dotenv/config";
import { IAccountRepository } from "../presenter/userPresenterInterfaces";
import { Account } from "../entity/account";
import { USER } from "../protocol/user";
import { Room } from "../protocol/room";
import { IDGeneratable, IDGenerator } from "../domain/idGenerator";
import { Character } from "../domain/character";

export class AccountRepository implements IAccountRepository {
  private static instance: AccountRepository;
  private accounts: Account[];

  private constructor() {
    this.accounts = [];
  }

  static getInstance(): AccountRepository {
    if (!AccountRepository.instance) {
      AccountRepository.instance = new AccountRepository();
    }
    return AccountRepository.instance;
  }

  /* query */
  // トークンからAccountを取得する
  getAccountByToken(token: string | undefined): Account | undefined {
    if (token === undefined) return undefined;
    const account = this.accounts.find((u) => u.token === token);
    return account;
  }

  // ソケットIDからAccountを取得する
  getAccountBySocketId(socketId: string): Account | undefined {
    const account = this.accounts.find((u) => u.socketId === socketId);
    return account;
  }

  // バンされたユーザーのihashを取得する
  getBannedIhashes() {
    if (!process.env.BAN_USER_IHASHS) {
      return [];
    }
    return process.env.BAN_USER_IHASHS.split(":");
  }

  // 指定した部屋にいるユーザーをすべて取得する
  fetchUsers(room: string): USER[] {
    const accounts = this.accounts.filter(
      (account) => account.character.currentRoom === room && account.alive
    );
    return accounts.map((account) => {
      const user = {
        id: account.id,
        ihash: account.character.avatar.whiteTrip?.value,
        trip: account.character.avatar.blackTrip?.value,
        name: account.character.avatar.name.value,
        type: account.character.avatar.charType.value,
        r: account.character.avatar.charColor.r,
        g: account.character.avatar.charColor.g,
        b: account.character.avatar.charColor.b,
        stat: account.character.status.value,
        x: account.character.position.x,
        y: account.character.position.y,
        scl: account.character.direction.getScl(),
        isMobile: account.isMobile,
      };
      return user;
    });
  }

  // 指定した部屋にいる特定のユーザーをすべて取得する
  fetchUser(id: string, room: string): USER | undefined {
    const usersInRoom = this.fetchUsers(room);
    return usersInRoom.find((u) => u.id === id);
  }

  // 全部屋の情報を取得する
  getRooms(): Room[] {
    const roomNames = this.accounts
      .filter((a) => a.alive)
      .map((a) => a.character.currentRoom);
    let count: { [key: string]: number } = {};
    for (const room of roomNames) {
      if (room == null) continue;
      count[room] = (count[room] ?? 0) + 1;
    }
    let rooms: Room[] = [];
    for (const name in count) {
      rooms.push({
        n: name,
        c: count[name],
      });
    }
    return rooms;
  }

  // 同じihashのアカウントの数を取得する
  countSameIhash(ihash: string): number {
    return this.accounts
      .filter((account) => account.alive)
      .filter((v) => v.character.avatar.whiteTrip?.value === ihash).length;
  }

  // 特定のihash(=HASH(IP))が来たときに、入室ができるかどうかを判定する
  isPermittedToEnter(ihash: string): boolean {
    const isMultiAccountPermitted =
      process.env.PERMISSION_MULTI_ACCOUNT === "true";
    return this.countSameIhash(ihash) < 3 || isMultiAccountPermitted;
  }

  /* command */
  // アカウントの作成
  // TODO: IDを返すかAccountのfieldを隠蔽する
  create(socketId: string, idGenerator?: IDGeneratable): Account {
    const generator = idGenerator ?? IDGenerator.instance;
    const account = Account.instantiate({ idGenerator: generator, socketId });
    this.accounts.push(account);
    return account;
  }

  // 有効なトークンを使ってソケットIDを更新する
  updateSocketIdWithValidToken(token: string, socketId: string): void {
    const account = this.accounts.find((u) => u.token === token);
    if (account) {
      account.socketId = socketId;
    }
  }

  updateAlive(id: string, alive: boolean): void {
    const account = this.getAccountByID(id);
    account?.updateAlive(alive);
  }

  updateIsMobile(id: string, isMobile: boolean): void {
    const account = this.getAccountByID(id);
    account?.updateIsMobile(isMobile);
  }

  updateLastCommentTime(id: string, now: Date): void {
    const account = this.getAccountByID(id);
    account?.updateLastCommentTime(now);
  }

  // キャラクター情報の更新
  updateCharacter(id: string, character: Character): void {
    const account = this.getAccountByID(id);
    if (account) {
      account.character = character.copy();
    }
  }

  speak(id: string, now: Date): boolean {
    const account = this.getAccountByID(id);
    return account?.speak(now) ?? false;
  }

  //! 単体テストにのみ使用
  deleteAll(): void {
    this.accounts = [];
  }

  private getAccountByID(id: string): Account | undefined {
    const account = this.accounts.filter((u) => u.id === id)[0];
    return account;
  }
}
