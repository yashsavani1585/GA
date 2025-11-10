// config/socketUtils.js
import { Server } from "socket.io";

let ioInstance = null;

export function setSocketIO(server) {
  if (ioInstance) return ioInstance;
  ioInstance = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://everglowb2b.onrender.com",
      ],
      credentials: true,
    }
  });
  return ioInstance;
}

export function getSocketIO() {
  if (!ioInstance) throw new Error("Socket.io not initialized - call setSocketIO(server) first");
  return ioInstance;
}
