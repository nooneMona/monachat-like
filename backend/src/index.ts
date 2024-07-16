import "dotenv/config";
import express, { Application, Request, Response } from "express";
import * as http from "http";
import { Server, Socket } from "socket.io";
import Log4js, { Logger } from "log4js";
import { UserPresenter } from "./presenter/userPresenter";
import { ServerCommunicator as ServerCommunicator } from "./infrastructure/serverCommunicator";
import { ClientCommunicator } from "./infrastructure/clientCommunicator";
import path from "path";
import { AccountRepository } from "./infrastructure/accountRepository";
import { readFile } from "fs";
import cors from "cors";
import { SystemLogger } from "./infrastructure/systemLogger";
import { FourChanTripper, HashTripper } from "./domain/tripper";
import moment from "moment";

const app: Application = express();
const server: http.Server = http.createServer(app);
const ioServer: Server = new Server(server, {
  path: "/monachatchat/",
  cors: {
    origin: process.env.FRONTEND_HOST,
    credentials: true,
  },
  pingInterval: 25000,
  pingTimeout: 20000,
});
const logger: Logger = Log4js.getLogger();
logger.level = "debug";

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/dist")));
app.get("/api/rooms", (_: Request, res: Response) => {
  readFile(path.join(__dirname, "/config/room.json"), (err, data) => {
    if (err) {
      res.statusCode = 404;
    }
    return res.json(JSON.parse(data.toString("utf-8")));
  });
});
app.get("/api/colors", (_: Request, res: Response) => {
  readFile(path.join(__dirname, "/config/colors.json"), (err, data) => {
    if (err) {
      res.statusCode = 404;
    }
    return res.json(JSON.parse(data.toString("utf-8")));
  });
});
app.get("/api/characters", (_: Request, res: Response) => {
  readFile(path.join(__dirname, "/config/characters.json"), (err, data) => {
    if (err) {
      res.statusCode = 404;
    }
    return res.json(JSON.parse(data.toString("utf-8")));
  });
});
app.get("/api/character/random", (_: Request, res: Response) => {
  readFile(path.join(__dirname, "/config/characters.json"), (err, data) => {
    if (err) {
      res.statusCode = 404;
    }
    let obj = JSON.parse(data.toString("utf-8"));
    let characterSequence: Array<string> = obj.characters
      .map((e: { characters: any }) => e.characters)
      .flat();
    let randomChar =
      characterSequence[Math.floor(Math.random() * characterSequence.length)];
    return res.json({ randomChar });
  });
});
app.get("/api/news", (_: Request, res: Response) => {
  readFile(path.join(__dirname, "/config/news.json"), (err, data) => {
    if (err) {
      res.statusCode = 404;
    }
    let obj = JSON.parse(data.toString("utf-8"));
    obj.news.forEach((e: any) => {
      if (e.day == null) {
        e.isNew = false;
        return;
      }
      const isoNewsDay = new Date(e.day).toISOString();
      const newsDay = moment(isoNewsDay);
      const dayThresholdNewNews = moment().subtract(1, "week");
      e.isNew = newsDay > dayThresholdNewNews;
    });
    return res.json(obj);
  });
});

// サーバーを起動しているときに、もともとつながっているソケットを一旦切断する
ioServer.disconnectSockets();

ioServer.on("connection", (socket: Socket): void => {
  // DI
  const systemLogger = new SystemLogger({ logger: logger });
  const whiteTripper = new HashTripper(process.env.IHASH_SEED ?? "");
  const blackTripper = new FourChanTripper();
  const eventSender = new ServerCommunicator({
    server: ioServer,
    systemLogger: systemLogger,
  });
  const eventReceiver = new ClientCommunicator({ socket: socket });
  const presenter = new UserPresenter({
    client: eventReceiver,
    server: eventSender,
    accountRep: AccountRepository.getInstance(),
    systemLogger,
    whiteTripper,
    blackTripper,
  });
  eventReceiver.eventHandler = presenter;
  eventSender.notificator = presenter;
  eventReceiver.init();
});

try {
  server.listen(3000, () => {
    logger.info(`Start server...`);
  });
} catch (e) {
  if (e instanceof Error) {
    logger.error(e.message);
  }
}
