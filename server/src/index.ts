import http from "node:http";
import express from "express";
import { Server } from "socket.io";
import { registerSocketHandlers } from "./sockets/registerSocketHandlers.js";
import { RoomManager } from "./rooms/RoomManager.js";

const PORT = Number(process.env.PORT ?? 3000);

const app = express();
app.get("/health", (_req, res) => res.json({ ok: true }));

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

const roomManager = new RoomManager();
registerSocketHandlers(io, roomManager);

httpServer.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[56-server] listening on :${PORT}`);
});

