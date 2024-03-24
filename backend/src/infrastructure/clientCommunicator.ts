import { Socket } from "socket.io";
import { USER } from "../protocol/user";
import { ClientInfo } from "../entity/clientInfo";
import {
  IEventHandler,
  IClientCommunicator,
} from "../presenter/userPresenterInterfaces";
import { COM, validateCOMRequest } from "../protocol/com";
import { ENTER, validateENTERRequest } from "../protocol/enter";
import { validateSETRequest, SET } from "../protocol/set";
import { AUTH, AUTHResponse, validateAUTHRequest } from "../protocol/auth";
import { EXIT, validateEXITRequest } from "../protocol/exit";
import { IG, validateIGRequest } from "../protocol/ig";
import { ERROR, validateERRORRequest } from "../protocol/error";
import { SUICIDE, validateSUICIDERequest } from "../protocol/suicide";
import UAParser from "ua-parser-js";

export type ClientCommunicatorOptions = {
  socket: Socket;
};

export class ClientCommunicator implements IClientCommunicator {
  eventHandler?: IEventHandler;
  private socket: Socket;

  constructor({ socket }: ClientCommunicatorOptions) {
    this.socket = socket;
  }

  init() {
    // socketが作成されたことの通知
    this.eventHandler?.receivedConnection(this.createClientInfo(this.socket));

    // ユーザ定義イベント
    this.socket.on(COM, (param: any) => {
      if (validateCOMRequest(param)) {
        this.eventHandler?.receivedCOM(
          param,
          this.createClientInfo(this.socket)
        );
      } else {
        this.eventHandler?.receivedParseError(
          `COM: ${JSON.stringify(validateCOMRequest.errors)}`
        );
      }
    });
    this.socket.on(ENTER, (param: any) => {
      if (validateENTERRequest(param)) {
        this.eventHandler?.receivedENTER(
          param,
          this.createClientInfo(this.socket)
        );
      } else {
        this.eventHandler?.receivedParseError(
          `ENTER: ${JSON.stringify(validateENTERRequest.errors)}`
        );
      }
    });
    this.socket.on(EXIT, (param: any) => {
      if (validateEXITRequest(param)) {
        this.eventHandler?.receivedEXIT(
          param,
          this.createClientInfo(this.socket)
        );
      } else {
        this.eventHandler?.receivedParseError(
          `EXIT: ${JSON.stringify(validateEXITRequest.errors)}`
        );
      }
    });
    this.socket.on(SET, (param: any) => {
      if (validateSETRequest(param)) {
        this.eventHandler?.receivedSET(
          param,
          this.createClientInfo(this.socket)
        );
      } else {
        this.eventHandler?.receivedParseError(
          `SET: ${JSON.stringify(validateSETRequest.errors)}`
        );
      }
    });
    this.socket.on(IG, (param: any) => {
      if (validateIGRequest(param)) {
        this.eventHandler?.receivedIG(
          param,
          this.createClientInfo(this.socket)
        );
      } else {
        this.eventHandler?.receivedParseError(
          `IG: ${JSON.stringify(validateIGRequest.errors)}`
        );
      }
    });
    this.socket.on(AUTH, (param: any) => {
      if (validateAUTHRequest(param)) {
        this.eventHandler?.receivedAUTH(
          param,
          this.createClientInfo(this.socket)
        );
      } else {
        this.eventHandler?.receivedParseError(
          `AUTH: ${JSON.stringify(validateAUTHRequest.errors)}`
        );
      }
    });
    this.socket.on(ERROR, (param: any) => {
      if (validateERRORRequest(param)) {
        this.eventHandler?.receivedERROR(
          param,
          this.createClientInfo(this.socket)
        );
      } else {
        this.eventHandler?.receivedParseError(
          `ERROR: ${JSON.stringify(validateERRORRequest.errors)}`
        );
      }
    });
    this.socket.on(SUICIDE, (param: any) => {
      if (validateSUICIDERequest(param)) {
        this.eventHandler?.receivedSUICIDE(
          param,
          this.createClientInfo(this.socket)
        );
      } else {
        this.eventHandler?.receivedParseError(
          `SUICIDE: ${JSON.stringify(validateSUICIDERequest.errors)}`
        );
      }
    });

    // socketが閉じられたことの通知
    this.socket.on("disconnect", (reason) => {
      this.eventHandler?.receivedDisconnect(
        reason,
        this.createClientInfo(this.socket)
      );
    });
  }

  private createClientInfo(socket: Socket): ClientInfo {
    let clientIP = "120.0.0.1";
    if (
      process.env.NODE_ENV === "production" &&
      socket.handshake.headers[`true-client-ip`] !== undefined
    ) {
      clientIP = socket.handshake.headers[`true-client-ip`].toString();
    }
    const uaParser = new UAParser(socket.request.headers["user-agent"]);
    const device = uaParser.getDevice();
    return {
      socketId: socket.id,
      ipAddress: clientIP,
      isMobile: ["mobile", "tablet"].includes(device.type ?? ""),
    };
  }

  // - ClientCommunicator
  sendUsers(users: USER[]): void {
    this.socket.emit("USER", users);
  }

  sendAuth(res: AUTHResponse): void {
    this.socket.emit(AUTH, res);
  }

  moveRoom(from: string | undefined, to: string): void {
    if (from !== undefined) {
      this.socket.leave(from);
    }
    this.socket.join(to);
    this.eventHandler?.completedJoiningRoom(
      to,
      this.createClientInfo(this.socket)
    );
  }

  disconnect(): void {
    this.socket.disconnect(true);
  }
}
