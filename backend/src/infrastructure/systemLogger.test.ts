import { SystemLogger } from "./systemLogger";
import log4js, { Logger } from "log4js";
import { ClientInfo } from "../entity/clientInfo";

let systemLogger: SystemLogger;
let logger: Logger;
const clinetInfo: ClientInfo = {
  socketId: "id001002345",
  ipAddress: "192.0.0.1",
  isMobile: true,
};

beforeEach(() => {
  logger = log4js.getLogger();
  logger.info = jest.fn();
  logger.error = jest.fn();
  systemLogger = new SystemLogger({ logger });
});

describe("SystemLogger#logReceivedConnection", () => {
  it("should log", () => {
    systemLogger.logReceivedConnection(clinetInfo);
    expect(logger.info).toBeCalledTimes(1);
    expect(logger.info).toBeCalledWith("Connected Socket (socketID: id0010..)");
  });
});

describe("SystemLogger#logReceivedCOM", () => {
  it("should log", () => {
    systemLogger.logReceivedCOM(
      {
        token: "token01234",
        cmt: "hogehoge",
      },
      clinetInfo
    );
    expect(logger.info).toBeCalledTimes(1);
    expect(logger.info).toBeCalledWith(
      'Received <COM token="token0.." cmt="hogehoge" > socket=id0010..'
    );
  });
});

describe("SystemLogger#logReceivedENTER", () => {
  it("should log", () => {
    systemLogger.logReceivedENTER(
      {
        token: "token01234",
        room: "/1",
        trip: "password",
      },
      clinetInfo
    );
    expect(logger.info).toBeCalledTimes(1);
    expect(logger.info).toBeCalledWith(
      'Received <ENTER token="token0.." room="/1" trip="***" > socket=id0010..'
    );
  });
});

describe("SystemLogger#logReceivedEXIT", () => {
  it("should log", () => {
    systemLogger.logReceivedEXIT(
      {
        token: "token01234",
      },
      clinetInfo
    );
    expect(logger.info).toBeCalledTimes(1);
    expect(logger.info).toBeCalledWith(
      'Received <EXIT token="token0.." > socket=id0010..'
    );
  });
});

describe("SystemLogger#logReceivedSET", () => {
  it("should log", () => {
    systemLogger.logReceivedSET(
      {
        token: "token01234",
        x: 100,
        y: 200,
        scl: 100,
        stat: "通常",
      },
      clinetInfo
    );
    expect(logger.info).toBeCalledTimes(1);
    expect(logger.info).toBeCalledWith(
      'Received <SET token="token0.." x="100" y="200" scl="100" stat="通常" > socket=id0010..'
    );
  });
});

describe("SystemLogger#logReceivedIG", () => {
  it("should log", () => {
    systemLogger.logReceivedIG(
      {
        token: "token01234",
        stat: "on",
        ihash: "ihash",
      },
      clinetInfo
    );
    expect(logger.info).toBeCalledTimes(1);
    expect(logger.info).toBeCalledWith(
      'Received <IG token="token0.." stat="on" ihash="ihash" > socket=id0010..'
    );
  });
});

describe("SystemLogger#logReceivedAUTH", () => {
  it("should log", () => {
    systemLogger.logReceivedAUTH(
      {
        token: "token01234",
      },
      clinetInfo
    );
    expect(logger.info).toBeCalledTimes(1);
    expect(logger.info).toBeCalledWith(
      'Received <AUTH token="token0.." > socket=id0010..'
    );
  });
});

describe("SystemLogger#logReceivedERROR", () => {
  it("should log", () => {
    systemLogger.logReceivedERROR("error text", clinetInfo);
    expect(logger.error).toBeCalledTimes(1);
    expect(logger.error).toBeCalledWith("(socketID: id0010..) error text");
  });
});

describe("SystemLogger#logReceivedSUICIDE", () => {
  it("should log", () => {
    systemLogger.logReceivedSUICIDE(
      {
        token: "token01234",
      },
      clinetInfo
    );
    expect(logger.info).toBeCalledTimes(1);
    expect(logger.info).toBeCalledWith(
      'Received <SUICIDE token="token0.." > socket=id0010..'
    );
  });
});

describe("SystemLogger#logReceivedDisconnect", () => {
  it("should log", () => {
    systemLogger.logReceivedDisconnect("some reason", clinetInfo);
    expect(logger.info).toBeCalledTimes(1);
    expect(logger.info).toBeCalledWith(
      "Received disconnect (some reason) socket=id0010.."
    );
  });
});

describe("SystemLogger#logParseError", () => {
  it("should log", () => {
    systemLogger.logReceivedParseError("text");
    expect(logger.error).toBeCalledTimes(1);
    expect(logger.error).toBeCalledWith("text");
  });
});

describe("SystemLogger#logSendCOM", () => {
  it("should log", () => {
    systemLogger.logSendCOM(
      {
        id: "id001002345",
        cmt: "cmt",
      },
      "/1"
    );
    expect(logger.info).toBeCalledTimes(1);
    expect(logger.info).toBeCalledWith(
      'Send <COM id="id0010.." cmt="cmt" > ===> /1'
    );
  });

  it("should log if destination is null", () => {
    systemLogger.logSendCOM(
      {
        id: "id001002345",
        cmt: "cmt",
      },
      null
    );
    expect(logger.info).toBeCalledTimes(1);
    expect(logger.info).toBeCalledWith(
      'Send <COM id="id0010.." cmt="cmt" > ===> null'
    );
  });
});

describe("SystemLogger#logParseError", () => {
  it("should log", () => {
    systemLogger.logReceivedParseError("text");
    expect(logger.error).toBeCalledTimes(1);
    expect(logger.error).toBeCalledWith("text");
  });
});

describe("SystemLogger#logSendENTER", () => {
  it("should log", () => {
    systemLogger.logSendENTER(
      {
        id: "id001002345",
        room: "/1",
        isMobile: false,
      },
      "/1"
    );
    expect(logger.info).toBeCalledTimes(1);
    expect(logger.info).toBeCalledWith(
      'Send <ENTER id="id0010.." room="/1" isMobile="false" > ===> /1'
    );
  });

  it("should log if destination is null", () => {
    systemLogger.logSendENTER(
      {
        id: "id001002345",
        room: "/1",
        isMobile: false,
      },
      undefined
    );
    expect(logger.info).toBeCalledTimes(1);
    expect(logger.info).toBeCalledWith(
      'Send <ENTER id="id0010.." room="/1" isMobile="false" > ===> undefined'
    );
  });
});

describe("SystemLogger#logSendSET", () => {
  it("should log", () => {
    systemLogger.logSendSET(
      {
        id: "id001002345",
        x: 100,
        y: 200,
        scl: 100,
        stat: "通常",
      },
      "/1"
    );
    expect(logger.info).toBeCalledTimes(1);
    expect(logger.info).toBeCalledWith(
      'Send <SET id="id0010.." x="100" y="200" scl="100" stat="通常" > ===> /1'
    );
  });

  it("should log if destination is null", () => {
    systemLogger.logSendSET(
      {
        id: "id001002345",
        x: 100,
        y: 200,
        scl: 100,
        stat: "通常",
      },
      null
    );
    expect(logger.info).toBeCalledTimes(1);
    expect(logger.info).toBeCalledWith(
      'Send <SET id="id0010.." x="100" y="200" scl="100" stat="通常" > ===> null'
    );
  });
});

describe("SystemLogger#logSendIG", () => {
  it("should log", () => {
    systemLogger.logSendIG(
      {
        id: "id001002345",
        stat: "on",
        ihash: "ihash",
      },
      "/1"
    );
    expect(logger.info).toBeCalledTimes(1);
    expect(logger.info).toBeCalledWith(
      'Send <IG id="id0010.." stat="on" ihash="ihash" > ===> /1'
    );
  });

  it("should log if destination is null", () => {
    systemLogger.logSendIG(
      {
        id: "id001002345",
        stat: "on",
        ihash: "ihash",
      },
      null
    );
    expect(logger.info).toBeCalledTimes(1);
    expect(logger.info).toBeCalledWith(
      'Send <IG id="id0010.." stat="on" ihash="ihash" > ===> null'
    );
  });
});

describe("SystemLogger#logSendIG", () => {
  it("should log", () => {
    systemLogger.logSendEXIT(
      {
        id: "id001002345",
      },
      "/1"
    );
    expect(logger.info).toBeCalledTimes(1);
    expect(logger.info).toBeCalledWith('Send <EXIT id="id0010.." > ===> /1');
  });

  it("should log if destination is null", () => {
    systemLogger.logSendEXIT(
      {
        id: "id001002345",
      },
      undefined
    );
    expect(logger.info).toBeCalledTimes(1);
    expect(logger.info).toBeCalledWith(
      'Send <EXIT id="id0010.." > ===> undefined'
    );
  });
});

describe("SystemLogger#logSendSLEEP", () => {
  it("should log", () => {
    systemLogger.logSendSLEEP(
      {
        id: "id001002345",
      },
      "/1"
    );
    expect(logger.info).toBeCalledTimes(1);
    expect(logger.info).toBeCalledWith('Send <SLEEP id="id0010.." > ===> /1');
  });

  it("should log if destination is null", () => {
    systemLogger.logSendSLEEP(
      {
        id: "id001002345",
      },
      null
    );
    expect(logger.info).toBeCalledTimes(1);
    expect(logger.info).toBeCalledWith('Send <SLEEP id="id0010.." > ===> null');
  });
});

describe("SystemLogger#logSendAWAKE", () => {
  it("should log", () => {
    systemLogger.logSendAWAKE(
      {
        id: "id001002345",
      },
      "/1"
    );
    expect(logger.info).toBeCalledTimes(1);
    expect(logger.info).toBeCalledWith('Send <AWAKE id="id0010.." > ===> /1');
  });

  it("should log if destination is null", () => {
    systemLogger.logSendAWAKE(
      {
        id: "id001002345",
      },
      null
    );
    expect(logger.info).toBeCalledTimes(1);
    expect(logger.info).toBeCalledWith('Send <AWAKE id="id0010.." > ===> null');
  });
});

describe("SystemLogger#logSendCOUNT", () => {
  it("should log", () => {
    systemLogger.logSendCOUNT({
      rooms: [
        {
          c: 2,
          n: "/1",
        },
      ],
      c: 0,
      n: "",
    });
    expect(logger.info).toBeCalledTimes(1);
    expect(logger.info).toBeCalledWith(
      'Send <COUNT rooms="[object Object]" c="0" n="" > ===> entrance'
    );
  });

  describe("SystemLogger#logSendUsers", () => {
    it("should log", () => {
      systemLogger.logSendUsers();
      expect(logger.info).toBeCalledTimes(1);
    });
  });
});
