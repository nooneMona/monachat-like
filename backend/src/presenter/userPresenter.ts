import { ClientInfo } from "../entity/clientInfo";
import { IServerNotificator } from "../infrastructure/serverCommunicator";
import { COMRequest, COMResponse } from "../protocol/com";
import { ENTERRequest, ENTERResponse } from "../protocol/enter";
import { SETRequest, SETResponse } from "../protocol/set";
import { AUTHRequest } from "../protocol/auth";
import { SLEEPResponse } from "../protocol/sleep";
import { AWAKEResponse } from "../protocol/awake";
import {
  IAccountRepository,
  IClientCommunicator,
  IEventHandler,
  IServerCommunicator,
  ISystemReceivedLogger,
} from "./userPresenterInterfaces";
import { Room } from "../protocol/room";
import { COUNTResponse } from "../protocol/count";
import { EXITRequest, EXITResponse } from "../protocol/exit";
import { IGRequest, IGResponse } from "../protocol/ig";
import { ERRORRequest } from "../protocol/error";
import { SUICIDERequest } from "../protocol/suicide";
import "dotenv/config";
import { BlackTrip, WhiteTrip } from "../domain/trip";
import { BlackTripper, WhiteTripper } from "../domain/tripper";
import { BlackTripperInput } from "../domain/blackTripperInput";
import { IP } from "../domain/ip";
import { Account } from "../entity/account";
import { Position } from "../domain/position";
import { Direction } from "../domain/direction";
import { Status } from "../domain/status";
import { Avatar } from "../domain/avatar";
import { CharType } from "../domain/charType";
import { Color } from "../domain/color";
import { Name } from "../domain/name";
import { Speech } from "../domain/speech";
import { SIGRequest } from "../protocol/sig";

export type PresenterOptions = {
  client: IClientCommunicator;
  server: IServerCommunicator;
  accountRep: IAccountRepository;
  systemLogger: ISystemReceivedLogger;
  whiteTripper: WhiteTripper;
  blackTripper: BlackTripper;
};

export class UserPresenter implements IEventHandler, IServerNotificator {
  private clientCommunicator: IClientCommunicator;
  private serverCommunicator: IServerCommunicator;
  private accountRep: IAccountRepository;
  private systemLogger: ISystemReceivedLogger;
  private whiteTripper: WhiteTripper;
  private blackTripper: BlackTripper;

  constructor({
    client,
    server,
    accountRep,
    systemLogger,
    whiteTripper,
    blackTripper,
  }: PresenterOptions) {
    this.clientCommunicator = client;
    this.serverCommunicator = server;
    this.accountRep = accountRep;
    this.systemLogger = systemLogger;
    this.whiteTripper = whiteTripper;
    this.blackTripper = blackTripper;
  }

  // EventHandler
  receivedConnection(clientInfo: ClientInfo): void {
    this.systemLogger.logReceivedConnection(clientInfo);
  }

  receivedCOM(req: COMRequest, clientInfo: ClientInfo): void {
    this.systemLogger.logReceivedCOM(req, clientInfo);
    const account = this.authorize(req.token, clientInfo.socketId);
    const currentRoom = account.character.currentRoom;
    if (currentRoom == null) return;
    const speech = new Speech(req.cmt);
    if (!this.accountRep.speak(account.id, new Date())) {
      this.clientCommunicator.disconnect();
      return;
    }
    let res: COMResponse = {
      id: account.id,
      cmt: speech.value,
    };
    req.style != null && (res.style = req.style);
    req.typing != null && (res.typing = { ...req.typing });
    const accounts = this.accountRep.getAccountsByIHashes(
      account.ignoresIhashs
    );
    this.serverCommunicator.sendCOM(
      res,
      currentRoom,
      Array.from(new Set(accounts.map((e) => e.socketId)))
    );
  }

  receivedENTER(req: ENTERRequest, clientInfo: ClientInfo): void {
    this.systemLogger.logReceivedENTER(req, clientInfo);
    const account = this.authorize(req.token, clientInfo.socketId);
    const ip = new IP(clientInfo.ipAddress);
    const ihash = new WhiteTrip(ip, this.whiteTripper);
    if (!this.accountRep.isPermittedToEnter(ihash.value)) {
      this.clientCommunicator.disconnect();
      return;
    }
    const tripInput = new BlackTripperInput(req.trip ?? "");
    const trip = new BlackTrip(tripInput, this.blackTripper);
    let updatedCharacter = account.character.copy();
    const toPosition = Position.instantiate({ x: req.x, y: req.y });
    if (toPosition != null) {
      updatedCharacter = updatedCharacter.movePosition(toPosition);
    }
    if (req.scl != null) {
      updatedCharacter = updatedCharacter.turn(
        Direction.instantiateByScl(req.scl)
      );
    }
    if (req.stat != null) {
      updatedCharacter = updatedCharacter.updateStatus(new Status(req.stat));
    }
    const avatar = new Avatar({
      charType: new CharType(req.type),
      charColor: Color.instantiateByMona({ r: req.r, g: req.g, b: req.b }),
      name: new Name(req.name),
      blackTrip: trip,
      whiteTrip: ihash,
    });
    updatedCharacter = updatedCharacter.updateAvatar(avatar);
    this.accountRep.updateCharacter(account.id, updatedCharacter);
    this.accountRep.updateIsMobile(account.id, clientInfo.isMobile);

    const currentRoom = updatedCharacter.currentRoom;
    this.clientCommunicator.moveRoom(currentRoom, req.room);
    const users = this.accountRep.fetchUsers(req.room);
    this.clientCommunicator.sendUsers(users);
    const updatedUser = this.accountRep.fetchUser(account.id, req.room);
    if (updatedUser == null) return;
    let res: ENTERResponse = {
      id: account.id,
      room: req.room,
      x: updatedUser.x,
      y: updatedUser.y,
      scl: updatedUser.scl,
      stat: updatedUser.stat,
      name: updatedUser.name,
      ihash: updatedUser.ihash,
      trip: updatedUser.trip,
      r: updatedUser.r,
      g: updatedUser.g,
      b: updatedUser.b,
      type: updatedUser.type,
      isMobile: clientInfo.isMobile,
    };
    this.serverCommunicator.sendENTER(res, req.room);
  }

  receivedEXIT(req: EXITRequest, clientInfo: ClientInfo): void {
    this.systemLogger.logReceivedEXIT(req, clientInfo);
    const account = this.authorize(req.token, clientInfo.socketId);
    const oldRoom = account.character.currentRoom;
    let nextRoom = oldRoom !== "/MONA8094" ? "/MONA8094" : undefined;
    const res: EXITResponse = {
      id: account.id,
    };
    this.clientCommunicator.moveRoom(oldRoom, nextRoom);
    this.serverCommunicator.sendEXIT(res, oldRoom);
  }

  receivedSET(req: SETRequest, clientInfo: ClientInfo): void {
    this.systemLogger.logReceivedSET(req, clientInfo);
    const account = this.authorize(req.token, clientInfo.socketId);
    const currentRoom = account.character.currentRoom;
    if (currentRoom == null) return;
    let updatedCharacter = account.character.copy();
    const toPosition = Position.instantiate({ x: req.x, y: req.y });
    if (toPosition != null) {
      updatedCharacter = updatedCharacter.movePosition(toPosition);
    }
    if (req.scl != null) {
      updatedCharacter = updatedCharacter.turn(
        Direction.instantiateByScl(req.scl)
      );
    }
    if (req.stat != null) {
      updatedCharacter = updatedCharacter.updateStatus(new Status(req.stat));
    }
    this.accountRep.updateCharacter(account.id, updatedCharacter);
    const currentAccount = this.accountRep.getAccountByToken(req.token);
    if (currentAccount == null) return;
    const res: SETResponse = {
      id: currentAccount.id,
      x: currentAccount.character.position.x,
      y: currentAccount.character.position.y,
      scl: currentAccount.character.direction.getScl(),
      stat: currentAccount.character.status.value,
    };
    this.serverCommunicator.sendSET(res, currentRoom);
  }

  receivedIG(req: IGRequest, clientInfo: ClientInfo): void {
    this.systemLogger.logReceivedIG(req, clientInfo);
    const account = this.authorize(req.token, clientInfo.socketId);
    const currentRoom = account.character.currentRoom;
    if (currentRoom == null) return;
    const res: IGResponse = {
      id: account.id,
      stat: req.stat,
      ihash: req.ihash,
    };
    this.serverCommunicator.sendIG(res, currentRoom);
  }

  receivedSIG(req: SIGRequest, clientInfo: ClientInfo): void {
    this.systemLogger.logReceivedSIG(req, clientInfo);
    const account = this.authorize(req.token, clientInfo.socketId);
    if (req.stat === "on") {
      account.appendIgnoresIhashs(req.ihash);
    }
    if (req.stat === "off") {
      account.removeIgnoresIhashs(req.ihash);
    }
    return;
  }

  receivedAUTH(req: AUTHRequest, clientInfo: ClientInfo): void {
    this.systemLogger.logReceivedAUTH(req, clientInfo);
    // tokenを照合して復帰処理を書く
    const token = req.token;
    if (token == null) return;
    const account = this.accountRep.getAccountByToken(token);
    if (account == null) {
      // 前提: 存在しないtokenを持っている -> サーバー側がリセットされた
      this.clientCommunicator.sendAuth({
        id: "error",
        token,
      });
      return;
    }
    const currentRoom = account.character.currentRoom;
    if (currentRoom == null) return;
    this.accountRep.updateSocketIdWithValidToken(token, clientInfo.socketId);
    this.accountRep.updateAlive(account.id, true);
    // Socket.ioの仕様上DisconnectするとRoomから消えて(leave)しまうため。
    this.clientCommunicator.moveRoom(undefined, currentRoom);
    let res: AWAKEResponse = {
      id: account.id,
    };
    this.serverCommunicator.sendAWAKE(res, currentRoom);
    // updateAliveの完了通知を受け取って呼ぶようにする
    const users = this.accountRep.fetchUsers(currentRoom);
    this.serverCommunicator.sendUsers(users, currentRoom);
  }

  receivedParseError(str: string): void {
    this.systemLogger.logReceivedParseError(str);
  }

  receivedERROR(req: ERRORRequest, clientInfo: ClientInfo): void {
    this.systemLogger.logReceivedERROR(req.text, clientInfo);
  }

  receivedSUICIDE(req: SUICIDERequest, clientInfo: ClientInfo): void {
    this.systemLogger.logReceivedSUICIDE(req, clientInfo);
    this.clientCommunicator.disconnect();
  }

  receivedDisconnect(reason: string, clientInfo: ClientInfo): void {
    this.systemLogger.logReceivedDisconnect(reason, clientInfo);
    const account = this.accountRep.getAccountBySocketId(clientInfo.socketId);
    if (account == null) return;
    // currentRoomがnullという異常状態でもとりあえずaliveをfalseにしたい。
    this.accountRep.updateAlive(account.id, false);
    const currentRoom = account.character.currentRoom;
    if (currentRoom == null) return;
    // completedJoiningRoomの通知を送らせるため。
    this.clientCommunicator.moveRoom(undefined, currentRoom);
    const res: SLEEPResponse = {
      id: account.id,
    };
    this.serverCommunicator.sendSLEEP(res, currentRoom);
    const users = this.accountRep.fetchUsers(currentRoom);
    this.serverCommunicator.sendUsers(users, currentRoom);
  }

  completedJoiningRoom(room: string, clientInfo: ClientInfo): void {
    const account = this.accountRep.getAccountBySocketId(clientInfo.socketId);
    if (account == null) return;
    this.accountRep.updateCharacter(
      account.id,
      account.character.copy().moveRoom(room)
    );
    const rooms = this.accountRep.getRooms();
    this.notifyRoomsChanged(rooms);
  }

  // private
  private authorize(token: string | undefined, socketId: string): Account {
    const existingAccount = this.accountRep.getAccountByToken(token);
    if (existingAccount !== undefined) {
      return existingAccount;
    }
    const account = this.accountRep.create(socketId);
    this.clientCommunicator.sendAuth({
      id: account.id,
      token: account.token,
    });
    return account;
  }

  private notifyRoomsChanged(rooms: Room[]): void {
    let entranceRoom = rooms.find((e) => e.n === "/MONA8094");
    let newRooms = rooms.filter((e) => e.n !== "/MONA8094");
    const entranceCount = entranceRoom?.c ?? 0;
    let res: COUNTResponse = {
      c: entranceCount,
      n: "/MONA8094",
      rooms: newRooms,
    };
    this.serverCommunicator.sendCOUNT(res);
  }
}
