import { ClientInfo } from "./clientInfo";

/* --- query --- */
test("ClientInfoに準拠したオブジェクトが存在できる", () => {
  const clientInfo: ClientInfo = {
    socketId: "testSocketId",
    ipAddress: "192.0.0.1",
    isMobile: true,
  };
  expect(clientInfo).toBeDefined();
});

/* --- command --- */
