import { Server } from "socket.io";
import {
  IServerCommunicator,
  ISystemSendLogger,
} from "../presenter/userPresenterInterfaces";
import { AWAKE, AWAKEResponse } from "../protocol/awake";
import { COM, COMResponse } from "../protocol/com";
import { COUNT, COUNTResponse } from "../protocol/count";
import { ENTER, ENTERResponse } from "../protocol/enter";
import { EXIT, EXITResponse } from "../protocol/exit";
import { IG, IGResponse } from "../protocol/ig";
import { SET, SETResponse } from "../protocol/set";
import { SLEEP, SLEEPResponse } from "../protocol/sleep";
import { USER } from "../protocol/user";

export interface IServerNotificator {}

export type ServerCommunicatorOptions = {
  server: Server;
  systemLogger: ISystemSendLogger;
};

export class ServerCommunicator implements IServerCommunicator {
  notificator?: IServerNotificator;
  private server: Server;
  private systemLogger: ISystemSendLogger;

  constructor({ server, systemLogger }: ServerCommunicatorOptions) {
    this.server = server;
    this.systemLogger = systemLogger;
  }

  sendCOM(param: COMResponse, to: string, exceptIDs: string[]): void {
    this.systemLogger.logSendCOM(param, to);
    const broadCaster = this.server.in(to);
    exceptIDs.forEach((id) => {
      broadCaster.except(id);
    });
    broadCaster.emit(COM, param);
  }

  sendENTER(param: ENTERResponse, to: string | undefined): void {
    this.systemLogger.logSendENTER(param, to);
    if (to !== undefined) {
      this.server.in(to).emit(ENTER, param);
    }
  }

  sendSET(param: SETResponse, to: string): void {
    this.systemLogger.logSendSET(param, to);
    this.server.in(to).emit(SET, param);
  }

  sendIG(param: IGResponse, to: string): void {
    this.systemLogger.logSendIG(param, to);
    this.server.in(to).emit(IG, param);
  }

  sendEXIT(param: EXITResponse, to: string | undefined): void {
    this.systemLogger.logSendEXIT(param, to);
    if (to !== undefined) {
      this.server.in(to).emit(EXIT, param);
    }
  }

  sendSLEEP(param: SLEEPResponse, to: string | null): void {
    this.systemLogger.logSendSLEEP(param, to);
    if (to !== null) {
      this.server.in(to).emit(SLEEP, param);
    }
  }

  sendAWAKE(param: AWAKEResponse, to: string | null): void {
    this.systemLogger.logSendAWAKE(param, to);
    if (to !== null) {
      this.server.in(to).emit(AWAKE, param);
    }
  }

  sendCOUNT(param: COUNTResponse): void {
    this.systemLogger.logSendCOUNT(param);
    this.server.in("/MONA8094").emit(COUNT, param);
  }

  sendUsers(users: USER[], to: string | null): void {
    this.systemLogger.logSendUsers();
    if (to !== null) {
      this.server.in(to).emit("USER", users);
    }
  }
}
