import { io, type Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents, Suit } from "../../../shared/src/index.js";
import { useGameStore } from "../state/gameStore";

export type ConnectionStatus = "disconnected" | "connecting" | "connected" | "reconnecting";

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

function serverUrl(): string {
  // Default: local dev. For device testing use your LAN IP, e.g. "http://192.168.1.10:3000"
  return (useGameStore.getState().serverUrl || "http://localhost:3000").trim();
}

export function getSocket(): Socket<ServerToClientEvents, ClientToServerEvents> {
  if (socket) return socket;

  socket = io(serverUrl(), {
    autoConnect: false,
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 500,
    reconnectionDelayMax: 2500
  });

  socket.on("connect", () => useGameStore.getState().setConnectionStatus("connected"));
  socket.on("disconnect", () => useGameStore.getState().setConnectionStatus("disconnected"));
  socket.io.on("reconnect_attempt", () => useGameStore.getState().setConnectionStatus("reconnecting"));
  socket.io.on("reconnect", () => useGameStore.getState().setConnectionStatus("connected"));

  socket.on("room_update", (payload) => useGameStore.getState().onRoomUpdate(payload));
  socket.on("game_state_update", (payload) => useGameStore.getState().onGameStateUpdate(payload));
  socket.on("invalid_move", (payload) => useGameStore.getState().onInvalidMove(payload.message));
  socket.on("player_joined", (payload) => useGameStore.getState().onPlayerJoined(payload));
  socket.on("game_started", () => useGameStore.getState().onGameStarted());

  return socket;
}

export function connect() {
  const s = getSocket();
  if (s.connected) return;
  useGameStore.getState().setConnectionStatus("connecting");
  s.connect();
}

export function createRoom(playerName: string) {
  connect();
  getSocket().emit("create_room", { name: playerName });
}

export function joinRoom(roomId: string, playerName: string, playerId?: string) {
  connect();
  getSocket().emit("join_room", { roomId, name: playerName, ...(playerId ? { playerId } : {}) });
}

export function startGame(roomId: string) {
  getSocket().emit("start_game", { roomId });
}

export function sendBid(payload: { roomId: string; action: "Bid" | "Pass" | "Double"; amount?: number; trump?: Suit }) {
  getSocket().emit("make_bid", payload);
}

export function playCard(roomId: string, cardUid: string) {
  getSocket().emit("play_card", { roomId, cardUid });
}

