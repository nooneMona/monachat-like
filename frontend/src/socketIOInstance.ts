import io from "socket.io-client";

export const socketIOInstance = io(import.meta.env.VITE_APP_SOCKET_HOST, {
  path: "/monachatchat/",
  withCredentials: true,
  reconnectionDelay: 200,
  closeOnBeforeunload: false,
});
