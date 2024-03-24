import { ClientCommunicator } from "./clientCommunicator";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import Client from "socket.io-client";
import { IEventHandler } from "../presenter/userPresenterInterfaces";

const PresenterMock = jest.fn<IEventHandler, []>().mockImplementation(() => {
  return {
    receivedConnection: jest.fn(),
    receivedCOM: jest.fn(),
    receivedENTER: jest.fn(),
    receivedEXIT: jest.fn(),
    receivedSET: jest.fn(),
    receivedIG: jest.fn(),
    receivedAUTH: jest.fn(),
    receivedERROR: jest.fn(),
    receivedSUICIDE: jest.fn(),
    receivedDisconnect: jest.fn(),
    completedJoiningRoom: jest.fn(),
    receivedParseError: jest.fn(),
  };
});

let socketServer: Server;
let socketClient: any;
let generatedSocket: Socket;
let clientCommunicator: ClientCommunicator;
let presenter: IEventHandler;

beforeAll((done) => {
  const httpServer = createServer();
  socketServer = new Server(httpServer);
  socketServer.setMaxListeners(0);
  httpServer.listen(4001, done);
});

afterAll(() => {
  socketServer.close();
});

beforeEach((done) => {
  socketClient = Client("http://localhost:4001");
  socketServer.on("connection", (socket: Socket) => {
    generatedSocket = socket;
    clientCommunicator = new ClientCommunicator({ socket: generatedSocket });
    presenter = new PresenterMock();
    clientCommunicator.eventHandler = presenter;
  });
  socketClient.on("connect", done);
});

afterEach(() => {
  socketClient.close();
});

describe("ClientCommunicator#init", () => {
  it("should initialze properly", () => {
    clientCommunicator.init();
    expect(presenter.receivedConnection).toBeCalledTimes(1);
  });

  it("should receive COM event", (done) => {
    clientCommunicator.init();
    socketClient.emit("COM", {
      token: "token",
      cmt: "hogehoge",
    });
    presenter.receivedCOM = jest.fn().mockImplementation(() => {
      expect(presenter.receivedCOM).toBeCalledTimes(1);
      done();
    });
  });

  it("should reject COM event if parameter is insufficient", (done) => {
    clientCommunicator.init();
    socketClient.emit("COM", {});
    presenter.receivedParseError = jest.fn().mockImplementation(() => {
      expect(presenter.receivedParseError).toBeCalledTimes(1);
      done();
    });
  });

  it("should receive ENTER event", (done) => {
    clientCommunicator.init();
    socketClient.emit("ENTER", { token: "token", room: "/1" });
    presenter.receivedENTER = jest.fn().mockImplementation(() => {
      expect(presenter.receivedENTER).toBeCalledTimes(1);
      done();
    });
  });

  it("should reject ENTER event if parameter is insufficient", (done) => {
    clientCommunicator.init();
    socketClient.emit("ENTER", {});
    presenter.receivedParseError = jest.fn().mockImplementation(() => {
      expect(presenter.receivedParseError).toBeCalledTimes(1);
      done();
    });
  });

  it("should receive EXIT event", (done) => {
    clientCommunicator.init();
    socketClient.emit("EXIT", { token: "token" });
    presenter.receivedEXIT = jest.fn().mockImplementation(() => {
      expect(presenter.receivedEXIT).toBeCalledTimes(1);
      done();
    });
  });

  it("should not reject EXIT event if parameter is insufficient", (done) => {
    clientCommunicator.init();
    socketClient.emit("EXIT", undefined);
    presenter.receivedParseError = jest.fn().mockImplementation(() => {
      expect(presenter.receivedParseError).toBeCalledTimes(1);
      done();
    });
  });

  it("should receive SET event", (done) => {
    clientCommunicator.init();
    socketClient.emit("SET", { x: 0, y: 0, scl: 100, stat: "通常" });
    presenter.receivedSET = jest.fn().mockImplementation(() => {
      expect(presenter.receivedSET).toBeCalledTimes(1);
      done();
    });
  });

  it("should reject SET event if parameter is insufficient", (done) => {
    clientCommunicator.init();
    socketClient.emit("SET", {});
    presenter.receivedParseError = jest.fn().mockImplementation(() => {
      expect(presenter.receivedParseError).toBeCalledTimes(1);
      done();
    });
  });

  it("should receive IG event", (done) => {
    clientCommunicator.init();
    socketClient.emit("IG", { token: "token", stat: "on", ihash: "ihash" });
    presenter.receivedIG = jest.fn().mockImplementation(() => {
      expect(presenter.receivedIG).toBeCalledTimes(1);
      done();
    });
  });

  it("should reject IG event if parameter is insufficient", (done) => {
    clientCommunicator.init();
    socketClient.emit("IG", {});
    presenter.receivedParseError = jest.fn().mockImplementation(() => {
      expect(presenter.receivedParseError).toBeCalledTimes(1);
      done();
    });
  });

  it("should receive AUTH event", (done) => {
    clientCommunicator.init();
    socketClient.emit("AUTH", { token: "token" });
    presenter.receivedAUTH = jest.fn().mockImplementation(() => {
      expect(presenter.receivedAUTH).toBeCalledTimes(1);
      done();
    });
  });

  it("should reject AUTH event if parameter is undefined", (done) => {
    clientCommunicator.init();
    socketClient.emit("AUTH", undefined);
    presenter.receivedParseError = jest.fn().mockImplementation(() => {
      expect(presenter.receivedParseError).toBeCalledTimes(1);
      done();
    });
  });

  it("should receive ERROR event", (done) => {
    clientCommunicator.init();
    socketClient.emit("ERROR", { text: "error message" });
    presenter.receivedERROR = jest.fn().mockImplementation(() => {
      expect(presenter.receivedERROR).toBeCalledTimes(1);
      done();
    });
  });

  it("should reject ERROR event if parameter is insufficient", (done) => {
    clientCommunicator.init();
    socketClient.emit("ERROR", {});
    presenter.receivedParseError = jest.fn().mockImplementation(() => {
      expect(presenter.receivedParseError).toBeCalledTimes(1);
      done();
    });
  });

  it("should receive SUICIDE event", (done) => {
    clientCommunicator.init();
    socketClient.emit("SUICIDE", {});
    presenter.receivedSUICIDE = jest.fn().mockImplementation(() => {
      expect(presenter.receivedSUICIDE).toBeCalledTimes(1);
      done();
    });
  });

  it("should reject SUICIDE event if parameter is undefined", (done) => {
    clientCommunicator.init();
    socketClient.emit("SUICIDE", undefined);
    presenter.receivedParseError = jest.fn().mockImplementation(() => {
      expect(presenter.receivedParseError).toBeCalledTimes(1);
      done();
    });
  });

  it("should receive disconnect event", (done) => {
    clientCommunicator.init();
    socketClient.disconnect();
    presenter.receivedDisconnect = jest.fn().mockImplementation(() => {
      expect(presenter.receivedDisconnect).toBeCalledTimes(1);
      done();
    });
  });
});

describe("ClientCommunicator#sendUsers", () => {
  it("should emit USER event", () => {
    generatedSocket.emit = jest.fn();
    clientCommunicator.sendUsers([]);
    expect(generatedSocket.emit).toBeCalledTimes(1);
    expect(generatedSocket.emit).toBeCalledWith("USER", []);
  });
});

describe("ClientCommunicator#sendAuth", () => {
  it("should emit AUTH event", () => {
    generatedSocket.emit = jest.fn();
    clientCommunicator.sendAuth({ id: "id", token: "token" });
    expect(generatedSocket.emit).toBeCalledTimes(1);
    expect(generatedSocket.emit).toBeCalledWith("AUTH", {
      id: "id",
      token: "token",
    });
  });
});

describe("ClientCommunicator#moveRoom", () => {
  it("should change socket room and call receivedJoiningRoom", () => {
    generatedSocket.leave = jest.fn();
    generatedSocket.join = jest.fn();
    presenter.completedJoiningRoom = jest.fn();
    clientCommunicator.moveRoom("/1", "/2");
    expect(generatedSocket.leave).toBeCalledTimes(1);
    expect(generatedSocket.leave).toBeCalledWith("/1");
    expect(generatedSocket.join).toBeCalledTimes(1);
    expect(generatedSocket.join).toBeCalledWith("/2");
    expect(presenter.completedJoiningRoom).toBeCalledTimes(1);
  });
});

describe("ClientCommunicator#disconnect", () => {
  it("should disconnect", () => {
    generatedSocket.disconnect = jest.fn();
    clientCommunicator.disconnect();
    expect(generatedSocket.disconnect).toBeCalledTimes(1);
    expect(generatedSocket.disconnect).toBeCalledWith(true);
  });
});
