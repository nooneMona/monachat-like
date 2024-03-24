import { Server } from "socket.io";
import { ISystemSendLogger } from "../presenter/userPresenterInterfaces";
import { ServerCommunicator } from "./serverCommunicator";

const SystemSendLoggerMock = jest
  .fn<ISystemSendLogger, []>()
  .mockImplementation(() => {
    return {
      logSendCOM: jest.fn(),
      logSendENTER: jest.fn(),
      logSendSET: jest.fn(),
      logSendIG: jest.fn(),
      logSendEXIT: jest.fn(),
      logSendSLEEP: jest.fn(),
      logSendAWAKE: jest.fn(),
      logSendCOUNT: jest.fn(),
      logSendUsers: jest.fn(),
    };
  });

class MockServer extends Server {
  in = jest.fn().mockReturnThis();
  emit = jest.fn().mockReturnThis();
}

let socketServer: MockServer;
let serverCommunicator: ServerCommunicator;
let systemSendLogger: ISystemSendLogger;

beforeEach(() => {
  socketServer = new MockServer();
  systemSendLogger = new SystemSendLoggerMock();
  serverCommunicator = new ServerCommunicator({
    server: socketServer,
    systemLogger: systemSendLogger,
  });
  socketServer.in = jest.fn().mockReturnThis();
  socketServer.emit = jest.fn().mockReturnThis();
});

describe("ServerCommunicator#sendCOM", () => {
  it("should emit event and log it.", () => {
    serverCommunicator.sendCOM({ id: "id", cmt: "comment" }, "/1");
    expect(systemSendLogger.logSendCOM).toBeCalledTimes(1);
    expect(socketServer.in).toBeCalledTimes(1);
    expect(socketServer.emit).toBeCalledTimes(1);
  });
});

describe("ServerCommunicator#sendENTER", () => {
  it("should emit event and log it.", () => {
    serverCommunicator.sendENTER(
      { id: "id", room: "/1", isMobile: false },
      "/1"
    );
    expect(systemSendLogger.logSendENTER).toBeCalledTimes(1);
    expect(socketServer.in).toBeCalledTimes(1);
    expect(socketServer.emit).toBeCalledTimes(1);
  });

  it("should not emit event if destination is undefined", () => {
    serverCommunicator.sendENTER(
      { id: "id", room: "/1", isMobile: false },
      undefined
    );
    expect(systemSendLogger.logSendENTER).toBeCalledTimes(1);
    expect(socketServer.in).toBeCalledTimes(0);
    expect(socketServer.emit).toBeCalledTimes(0);
  });
});

describe("ServerCommunicator#sendSET", () => {
  it("should emit event and log it.", () => {
    serverCommunicator.sendSET(
      { id: "id", x: 0, y: 0, scl: 100, stat: "通常" },
      "/1"
    );
    expect(systemSendLogger.logSendSET).toBeCalledTimes(1);
    expect(socketServer.in).toBeCalledTimes(1);
    expect(socketServer.emit).toBeCalledTimes(1);
  });
});

describe("ServerCommunicator#sendIG", () => {
  it("should emit event and log it.", () => {
    serverCommunicator.sendIG({ id: "id", stat: "on", ihash: "ihash" }, "/1");
    expect(systemSendLogger.logSendIG).toBeCalledTimes(1);
    expect(socketServer.in).toBeCalledTimes(1);
    expect(socketServer.emit).toBeCalledTimes(1);
  });
});

describe("ServerCommunicator#sendEXIT", () => {
  it("should emit event and log it.", () => {
    serverCommunicator.sendEXIT({ id: "id" }, "/1");
    expect(systemSendLogger.logSendEXIT).toBeCalledTimes(1);
    expect(socketServer.in).toBeCalledTimes(1);
    expect(socketServer.emit).toBeCalledTimes(1);
  });

  it("should not emit event if destination is undefined", () => {
    serverCommunicator.sendEXIT({ id: "id" }, undefined);
    expect(systemSendLogger.logSendEXIT).toBeCalledTimes(1);
    expect(socketServer.in).toBeCalledTimes(0);
    expect(socketServer.emit).toBeCalledTimes(0);
  });
});

describe("ServerCommunicator#sendSLEEP", () => {
  it("should emit event and log it.", () => {
    serverCommunicator.sendSLEEP({ id: "id" }, "/1");
    expect(systemSendLogger.logSendSLEEP).toBeCalledTimes(1);
    expect(socketServer.in).toBeCalledTimes(1);
    expect(socketServer.emit).toBeCalledTimes(1);
  });

  it("should not emit event if destination is null", () => {
    serverCommunicator.sendSLEEP({ id: "id" }, null);
    expect(systemSendLogger.logSendSLEEP).toBeCalledTimes(1);
    expect(socketServer.in).toBeCalledTimes(0);
    expect(socketServer.emit).toBeCalledTimes(0);
  });
});

describe("ServerCommunicator#sendAWAKE", () => {
  it("should emit event and log it.", () => {
    serverCommunicator.sendAWAKE({ id: "id" }, "/1");
    expect(systemSendLogger.logSendAWAKE).toBeCalledTimes(1);
    expect(socketServer.in).toBeCalledTimes(1);
    expect(socketServer.emit).toBeCalledTimes(1);
  });

  it("should not emit event if destination is null", () => {
    serverCommunicator.sendAWAKE({ id: "id" }, null);
    expect(systemSendLogger.logSendAWAKE).toBeCalledTimes(1);
    expect(socketServer.in).toBeCalledTimes(0);
    expect(socketServer.emit).toBeCalledTimes(0);
  });
});

describe("ServerCommunicator#sendCOUNT", () => {
  it("should emit event and log it.", () => {
    serverCommunicator.sendCOUNT({ c: 0, n: "/MONA", rooms: [] });
    expect(systemSendLogger.logSendCOUNT).toBeCalledTimes(1);
    expect(socketServer.in).toBeCalledTimes(1);
    expect(socketServer.emit).toBeCalledTimes(1);
  });
});

describe("ServerCommunicator#sendUsers", () => {
  it("should emit event and log it.", () => {
    serverCommunicator.sendUsers([], "/1");
    expect(systemSendLogger.logSendUsers).toBeCalledTimes(1);
    expect(socketServer.in).toBeCalledTimes(1);
    expect(socketServer.emit).toBeCalledTimes(1);
  });

  it("should not emit event if destination is null", () => {
    serverCommunicator.sendUsers([], null);
    expect(systemSendLogger.logSendUsers).toBeCalledTimes(1);
    expect(socketServer.in).toBeCalledTimes(0);
    expect(socketServer.emit).toBeCalledTimes(0);
  });
});
