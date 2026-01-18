// lib/sockets/socket.js
import { io } from "socket.io-client";

const DEFAULT_SERVER = (typeof window !== "undefined" && window.__SERVER_URL__) || "http://localhost:8000";

let socket = null;

export function getSocketInstance() {
  if (socket) return socket;
  socket = io(DEFAULT_SERVER, { transports: ["websocket", "polling"], autoConnect: false });
  return socket;
}

