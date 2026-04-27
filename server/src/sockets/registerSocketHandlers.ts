/**
 * Socket.IO event router: translates raw client payloads into engine Move objects, validates them
 * via getValidMoves, and emits per-player filtered game state after each successful move; all game
 * logic stays in the engine — this module only handles I/O and authorization (seated-player check).
 */
import type { Server, Socket } from "socket.io";
import type { ClientToServerEvents, Move, ServerToClientEvents } from "../../../shared/src/index.js";
import { applyMove, getValidMoves } from "../../../src/engine/index.js";
import { filterStateForPlayer } from "../game/visibility.js";
import { startRoomGame } from "../rooms/GameRoom.js";
import type { RoomManager } from "../rooms/RoomManager.js";
import { createPlayerToken, verifyPlayerToken } from "../auth/playerToken.js";

type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
type TypedServer = Server<ClientToServerEvents, ServerToClientEvents>;

function emitRoomUpdate(io: TypedServer, rm: RoomManager, roomId: string) {
  const room = rm.getRoom(roomId);
  if (!room) return;
  io.to(roomId).emit("room_update", rm.roomSummary(room));
}

function emitGameState(io: TypedServer, rm: RoomManager, roomId: string) {
  const room = rm.getRoom(roomId);
  if (!room?.gameState) return;

  // Send per-player filtered views
  for (const p of rm.players(room)) {
    const socket = io.sockets.sockets.get(p.socketId) as TypedSocket | undefined;
    if (!socket) continue;
    socket.emit("game_state_update", filterStateForPlayer(room.gameState, p.playerId));
  }

  // Spectators get full state (bonus)
  for (const socketId of room.spectators) {
    const socket = io.sockets.sockets.get(socketId) as TypedSocket | undefined;
    if (!socket) continue;
    socket.emit("game_state_update", room.gameState);
  }
}

function invalid(socket: TypedSocket, message: string) {
  socket.emit("invalid_move", { message });
}

export function registerSocketHandlers(io: TypedServer, roomManager: RoomManager) {
  io.on("connection", (socket: TypedSocket) => {
    socket.on("create_room", (payload) => {
      try {
        const room = roomManager.createRoom();
        socket.join(room.id);

        const joined = roomManager.joinRoom({
          roomId: room.id,
          socketId: socket.id,
          name: payload.name
        });

        socket.emit("player_joined", joined.isSpectator
          ? { roomId: room.id, playerId: joined.joined.playerId, name: joined.joined.name, spectator: true }
          : { roomId: room.id, seat: joined.joined.seat, playerId: joined.joined.playerId, name: joined.joined.name }
        );

        // Issue a signed player token for reconnection
        const token = createPlayerToken(joined.joined.playerId);
        socket.emit("player_token" as any, { token });

        emitRoomUpdate(io, roomManager, room.id);
      } catch (e: any) {
        invalid(socket, e?.message ?? "Failed to create room");
      }
    });

    socket.on("join_room", (payload) => {
      try {
        const room = roomManager.getRoom(payload.roomId);
        if (!room) return invalid(socket, "Room not found");
        socket.join(payload.roomId);

        // Try to resolve playerId from token if provided
        let resolvedPlayerId = payload.playerId;
        if ((payload as any).playerToken) {
          const tokenPlayerId = verifyPlayerToken((payload as any).playerToken);
          if (tokenPlayerId) resolvedPlayerId = tokenPlayerId;
        }

        const joined = roomManager.joinRoom({
          roomId: payload.roomId,
          socketId: socket.id,
          name: payload.name,
          ...(resolvedPlayerId ? { playerId: resolvedPlayerId } : {})
        });

        socket.emit("player_joined", joined.isSpectator
          ? { roomId: payload.roomId, playerId: joined.joined.playerId, name: joined.joined.name, spectator: true }
          : { roomId: payload.roomId, seat: joined.joined.seat, playerId: joined.joined.playerId, name: joined.joined.name }
        );

        // Issue auth token
        const token = createPlayerToken(joined.joined.playerId);
        socket.emit("player_token" as any, { token });

        emitRoomUpdate(io, roomManager, payload.roomId);
        emitGameState(io, roomManager, payload.roomId);
      } catch (e: any) {
        invalid(socket, e?.message ?? "Failed to join room");
      }
    });

    socket.on("start_game", (payload) => {
      try {
        const room = roomManager.getRoom(payload.roomId);
        if (!room) return invalid(socket, "Room not found");
        const started = startRoomGame(room);
        roomManager.upsertRoom(started);
        io.to(payload.roomId).emit("game_started", { roomId: payload.roomId });
        emitRoomUpdate(io, roomManager, payload.roomId);
        emitGameState(io, roomManager, payload.roomId);
      } catch (e: any) {
        invalid(socket, e?.message ?? "Failed to start game");
      }
    });

    socket.on("make_bid", (payload) => {
      try {
        const room = roomManager.getRoom(payload.roomId);
        if (!room?.gameState) return invalid(socket, "Game not started");
        const seatPlayer = room.playersBySeat.find((p) => p?.socketId === socket.id);
        if (!seatPlayer) return invalid(socket, "Not a seated player");

        const action = payload.action;
        const move: Move =
          action === "Pass"
            ? { type: "Pass", playerId: seatPlayer.playerId }
            : action === "Double"
              ? { type: "Double", playerId: seatPlayer.playerId }
              : {
                  type: "Bid",
                  playerId: seatPlayer.playerId,
                  amount: payload.amount ?? -1,
                  trump: payload.trump ?? "S"
                };

        const valid = getValidMoves(room.gameState, seatPlayer.playerId);
        if (!valid.some((m) => JSON.stringify(m) === JSON.stringify(move))) {
          return invalid(socket, "Invalid move");
        }

        // eslint-disable-next-line no-console
        console.log(`[move] room=${payload.roomId} ${seatPlayer.playerId} -> ${move.type}`);

        const next = applyMove(room.gameState, move);
        const updated = { ...room, gameState: next };
        roomManager.upsertRoom(updated);
        emitGameState(io, roomManager, payload.roomId);
      } catch (e: any) {
        invalid(socket, e?.message ?? "Move rejected");
      }
    });

    socket.on("play_card", (payload) => {
      try {
        const room = roomManager.getRoom(payload.roomId);
        if (!room?.gameState) return invalid(socket, "Game not started");
        const seatPlayer = room.playersBySeat.find((p) => p?.socketId === socket.id);
        if (!seatPlayer) return invalid(socket, "Not a seated player");

        const move: Move = { type: "PlayCard", playerId: seatPlayer.playerId, cardUid: payload.cardUid };
        const valid = getValidMoves(room.gameState, seatPlayer.playerId);
        if (!valid.some((m) => m.type === "PlayCard" && (m as any).cardUid === payload.cardUid)) {
          return invalid(socket, "Invalid move");
        }

        // eslint-disable-next-line no-console
        console.log(`[move] room=${payload.roomId} ${seatPlayer.playerId} -> PlayCard ${payload.cardUid}`);

        const next = applyMove(room.gameState, move);
        const updated = { ...room, gameState: next };
        roomManager.upsertRoom(updated);
        emitGameState(io, roomManager, payload.roomId);
      } catch (e: any) {
        invalid(socket, e?.message ?? "Move rejected");
      }
    });

    socket.on("disconnect", () => {
      const res = roomManager.markDisconnected(socket.id);
      if (!res) return;
      emitRoomUpdate(io, roomManager, res.room.id);
    });
  });
}

