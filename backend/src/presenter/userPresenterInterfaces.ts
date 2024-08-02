import { Account } from "../entity/account";
import { ClientInfo } from "../entity/clientInfo";
import { Room } from "../protocol/room";
import { USER } from "../protocol/user";
import { AUTHRequest, AUTHResponse } from "../protocol/auth";
import { AWAKEResponse } from "../protocol/awake";
import { COMRequest, COMResponse } from "../protocol/com";
import { COUNTResponse } from "../protocol/count";
import { ENTERRequest, ENTERResponse } from "../protocol/enter";
import { ERRORRequest } from "../protocol/error";
import { EXITRequest, EXITResponse } from "../protocol/exit";
import { IGRequest, IGResponse } from "../protocol/ig";
import { SETRequest, SETResponse } from "../protocol/set";
import { SLEEPResponse } from "../protocol/sleep";
import { SUICIDERequest } from "../protocol/suicide";
import { IDGeneratable } from "../domain/idGenerator";
import { Character } from "../domain/character";
import { SIGRequest } from "../protocol/sig";

// サーバーのマルチキャスト処理
export interface IServerCommunicator {
  sendCOM(param: COMResponse, to: string, exceptIDs: string[]): void;
  sendENTER(param: ENTERResponse, to: string | undefined): void;
  sendSET(param: SETResponse, to: string): void;
  sendIG(param: IGResponse, to: string): void;
  sendEXIT(param: EXITResponse, to: string | undefined): void;
  sendSLEEP(param: SLEEPResponse, to: string | null): void;
  sendAWAKE(param: AWAKEResponse, to: string | null): void;
  sendCOUNT(param: COUNTResponse): void;
  sendUsers(users: USER[], to: string | null): void;
}

// クライアントからのイベントを定義したインターフェイス
export interface IEventHandler {
  receivedConnection(clientInfo: ClientInfo): void;
  receivedCOM(req: COMRequest, clientInfo: ClientInfo): void;
  receivedENTER(req: ENTERRequest, clientInfo: ClientInfo): void;
  receivedEXIT(req: EXITRequest, clientInfo: ClientInfo): void;
  receivedSET(req: SETRequest, clientInfo: ClientInfo): void;
  receivedIG(req: IGRequest, clientInfo: ClientInfo): void;
  receivedSIG(req: SIGRequest, clientInfo: ClientInfo): void;
  receivedAUTH(req: AUTHRequest, clientInfo: ClientInfo): void;
  receivedERROR(req: ERRORRequest, clientInfo: ClientInfo): void;
  receivedSUICIDE(req: SUICIDERequest, clientInfo: ClientInfo): void;
  receivedDisconnect(reason: string, clientInfo: ClientInfo): void;
  completedJoiningRoom(room: string, clientInfo: ClientInfo): void;
  receivedParseError(str: string): void;
}

// クライアントにやりとりをするためのインターフェイス
export interface IClientCommunicator {
  sendUsers(users: USER[]): void;
  sendAuth(res: AUTHResponse): void;
  moveRoom(from: string | undefined, to: string | undefined): void;
  disconnect(): void;
}

export interface IAccountRepository {
  getAccountBySocketId(socketId: string): Account | undefined;
  getAccountByToken(token?: string): Account | undefined;
  fetchUsers(room: string): USER[];
  fetchUser(id: string, room: string): USER | undefined;
  getRooms(): Room[];
  countSameIhash(ihash: string): number;
  isPermittedToEnter(ihash: string): boolean;
  // commands
  create(socketId: string, idGenerator?: IDGeneratable): Account;
  updateSocketIdWithValidToken(token: string, socketId: string): void;
  updateAlive(id: string, alive: boolean): void;
  updateIsMobile(id: string, isMobile: boolean): void;
  updateLastCommentTime(id: string, now: Date): void;
  updateCharacter(id: string, character: Character): void;
  speak(id: string, now: Date): boolean;
}

export interface ISystemReceivedLogger {
  logReceivedConnection(clientInfo: ClientInfo): void;
  logReceivedCOM(req: COMRequest, clientInfo: ClientInfo): void;
  logReceivedENTER(req: ENTERRequest, clientInfo: ClientInfo): void;
  logReceivedEXIT(req: EXITRequest, clientInfo: ClientInfo): void;
  logReceivedSET(req: SETRequest, clientInfo: ClientInfo): void;
  logReceivedIG(req: IGRequest, clientInfo: ClientInfo): void;
  logReceivedSIG(req: IGRequest, clientInfo: ClientInfo): void;
  logReceivedAUTH(req: AUTHRequest, clientInfo: ClientInfo): void;
  logReceivedERROR(text: string, clientInfo: ClientInfo): void;
  logReceivedSUICIDE(req: SUICIDERequest, clientInfo: ClientInfo): void;
  logReceivedDisconnect(reason: string, clientInfo: ClientInfo): void;
  logReceivedParseError(str: string): void;
}

export interface ISystemSendLogger {
  logSendCOM(param: COMResponse, to: string | null): void;
  logSendENTER(param: ENTERResponse, to: string | undefined): void;
  logSendSET(param: SETResponse, to: string | null): void;
  logSendIG(param: IGResponse, to: string | null): void;
  logSendEXIT(param: EXITResponse, to: string | undefined): void;
  logSendSLEEP(param: SLEEPResponse, to: string | null): void;
  logSendAWAKE(param: AWAKEResponse, to: string | null): void;
  logSendCOUNT(param: COUNTResponse): void;
  logSendUsers(): void;
}
export interface ISystemLogger
  extends ISystemReceivedLogger,
    ISystemSendLogger {}

export interface ITripper {
  generateTrip(str: string): string;
  generateSHATrip(str: string): string;
}
