import { Logger as Log4JSLogger } from "log4js";
import { ClientInfo } from "../entity/clientInfo";
import { ISystemLogger } from "../presenter/userPresenterInterfaces";
import { AUTH, AUTHRequest } from "../protocol/auth";
import { AWAKE, AWAKEResponse } from "../protocol/awake";
import { COM, COMRequest, COMResponse } from "../protocol/com";
import { COUNT, COUNTResponse } from "../protocol/count";
import { ENTER, ENTERRequest, ENTERResponse } from "../protocol/enter";
import { EXIT, EXITRequest, EXITResponse } from "../protocol/exit";
import { IG, IGRequest, IGResponse } from "../protocol/ig";
import { SET, SETRequest, SETResponse } from "../protocol/set";
import { SLEEP, SLEEPResponse } from "../protocol/sleep";
import { SUICIDE, SUICIDERequest } from "../protocol/suicide";

export type SystemLoggerOptions = {
  logger: Log4JSLogger;
};

export class SystemLogger implements ISystemLogger {
  private logger: Log4JSLogger;
  constructor({ logger }: SystemLoggerOptions) {
    this.logger = logger;
  }

  // receive
  logReceivedConnection(clientInfo: ClientInfo): void {
    const socketID = this.maskSocketID(clientInfo.socketId);
    this.logger.info(`Connected Socket (socketID: ${socketID})`);
  }

  logReceivedCOM(req: COMRequest, clientInfo: ClientInfo): void {
    const socketID = this.maskSocketID(clientInfo.socketId);
    this.logger.info(
      `Received <${COM} ${this.getLoggedString(
        this.hiddenObj(req)
      )}> socket=${socketID}`
    );
  }

  logReceivedENTER(req: ENTERRequest, clientInfo: ClientInfo): void {
    const socketID = this.maskSocketID(clientInfo.socketId);
    this.logger.info(
      `Received <${ENTER} ${this.getLoggedString(
        this.hiddenObj(req)
      )}> socket=${socketID}`
    );
  }

  logReceivedEXIT(req: EXITRequest, clientInfo: ClientInfo): void {
    const socketID = this.maskSocketID(clientInfo.socketId);
    this.logger.info(
      `Received <${EXIT} ${this.getLoggedString(
        this.hiddenObj(req)
      )}> socket=${socketID}`
    );
  }

  logReceivedSET(req: SETRequest, clientInfo: ClientInfo): void {
    const socketID = this.maskSocketID(clientInfo.socketId);
    this.logger.info(
      `Received <${SET} ${this.getLoggedString(
        this.hiddenObj(req)
      )}> socket=${socketID}`
    );
  }

  logReceivedIG(req: IGRequest, clientInfo: ClientInfo): void {
    const socketID = this.maskSocketID(clientInfo.socketId);
    this.logger.info(
      `Received <${IG} ${this.getLoggedString(
        this.hiddenObj(req)
      )}> socket=${socketID}`
    );
  }

  logReceivedAUTH(req: AUTHRequest, clientInfo: ClientInfo): void {
    const socketID = this.maskSocketID(clientInfo.socketId);
    this.logger.info(
      `Received <${AUTH} ${this.getLoggedString(
        this.hiddenObj(req)
      )}> socket=${socketID}`
    );
  }

  logReceivedERROR(text: String, clientInfo: ClientInfo): void {
    const socketID = this.maskSocketID(clientInfo.socketId);
    this.logger.error(`(socketID: ${socketID}) ${text}`);
  }

  logReceivedSUICIDE(req: SUICIDERequest, clientInfo: ClientInfo): void {
    const socketID = this.maskSocketID(clientInfo.socketId);
    this.logger.info(
      `Received <${SUICIDE} ${this.getLoggedString(
        this.hiddenObj(req)
      )}> socket=${socketID}`
    );
  }

  logReceivedDisconnect(reason: string, clientInfo: ClientInfo): void {
    const socketID = this.maskSocketID(clientInfo.socketId);
    this.logger.info(`Received disconnect (${reason}) socket=${socketID}`);
  }

  logReceivedParseError(str: string): void {
    this.logger.error(str);
  }

  // send
  logSendCOM(param: COMResponse, to: string | null): void {
    this.logger.info(
      `Send <${COM} ${this.getLoggedString(this.hiddenObj(param))}> ===> ${
        to ?? "null"
      }`
    );
  }

  logSendENTER(param: ENTERResponse, to: string | undefined): void {
    this.logger.info(
      `Send <${ENTER} ${this.getLoggedString(this.hiddenObj(param))}> ===> ${
        to ?? "undefined"
      }`
    );
  }

  logSendSET(param: SETResponse, to: string | null): void {
    this.logger.info(
      `Send <${SET} ${this.getLoggedString(this.hiddenObj(param))}> ===> ${
        to ?? "null"
      }`
    );
  }

  logSendIG(param: IGResponse, to: string | null): void {
    this.logger.info(
      `Send <${IG} ${this.getLoggedString(this.hiddenObj(param))}> ===> ${
        to ?? "null"
      }`
    );
  }

  logSendEXIT(param: EXITResponse, to: string | undefined): void {
    this.logger.info(
      `Send <${EXIT} ${this.getLoggedString(this.hiddenObj(param))}> ===> ${
        to ?? "undefined"
      }`
    );
  }

  logSendSLEEP(param: SLEEPResponse, to: string | null): void {
    this.logger.info(
      `Send <${SLEEP} ${this.getLoggedString(this.hiddenObj(param))}> ===> ${
        to ?? "null"
      }`
    );
  }

  logSendAWAKE(param: AWAKEResponse, to: string | null): void {
    this.logger.info(
      `Send <${AWAKE} ${this.getLoggedString(this.hiddenObj(param))}> ===> ${
        to ?? "null"
      }`
    );
  }

  logSendCOUNT(param: COUNTResponse): void {
    this.logger.info(
      `Send <${COUNT} ${this.getLoggedString(
        this.hiddenObj(param)
      )}> ===> entrance`
    );
  }

  logSendUsers(): void {
    this.logger.info("SystemLogger#logSendUsers called.");
  }

  private maskSocketID(socketID: string): string {
    return `${socketID.slice(0, 6)}..`;
  }

  private hiddenObj(obj: any): any {
    let resultObj = { ...obj };
    if (resultObj.token) {
      resultObj.token = `${resultObj.token.slice(0, 6)}..`;
    }
    if (resultObj.id) {
      resultObj.id = `${resultObj.id.slice(0, 6)}..`;
    }
    if (resultObj.trip) {
      resultObj.trip = `***`;
    }
    return resultObj;
  }

  private getLoggedString(obj: any): any {
    let result = "";
    Object.keys(obj).forEach((key) => {
      result += `${key}="${obj[key]}" `;
    });
    return result;
  }
}
