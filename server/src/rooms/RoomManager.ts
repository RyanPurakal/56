import crypto from "node:crypto";
import type { GameRoom } from "./GameRoom.js";
import { activePlayers, createRoom, roomIsFull } from "./GameRoom.js";
import type { ConnectedPlayer, ReservedSeat, RoomId, SeatIndex } from "./types.js";
import { saveRooms, loadRooms } from "../persistence/store.js";

const RESERVATION_MS = 60_000;

function nowMs(): number {
  return Date.now();
}

function randomRoomCode(): RoomId {
  // short-ish, human-friendly
  return crypto.randomBytes(3).toString("hex").toUpperCase(); // e.g. "A1B2C3"
}

function randomPlayerId(): string {
  return crypto.randomUUID();
}

function firstOpenSeat(playersBySeat: Array<ConnectedPlayer | null>): SeatIndex | null {
  for (let i = 0 as SeatIndex; i < 4; i = (i + 1) as SeatIndex) {
    if (!playersBySeat[i]) return i;
  }
  return null;
}

function pruneExpiredReservations(reserved: ReadonlyArray<ReservedSeat>): ReservedSeat[] {
  const t = nowMs();
  return reserved.filter((r) => r.reservedUntilMs > t);
}

export class RoomManager {
  private rooms = new Map<RoomId, GameRoom>();

  constructor() {
    this.loadFromDisk();
  }

  private loadFromDisk(): void {
    const saved = loadRooms();
    for (const [id, data] of saved) {
      const room: GameRoom = {
        id: data.id,
        phase: data.phase as GameRoom["phase"],
        playersBySeat: (data.playersBySeat ?? [null, null, null, null]) as GameRoom["playersBySeat"],
        reservedSeats: (data.reservedSeats ?? []) as GameRoom["reservedSeats"],
        spectators: new Set(),
        gameState: data.gameState as GameRoom["gameState"]
      };
      this.rooms.set(id, room);
    }
  }

  private persist(): void {
    saveRooms(this.rooms as Map<string, unknown>);
  }

  createRoom(): GameRoom {
    let id = randomRoomCode();
    while (this.rooms.has(id)) id = randomRoomCode();
    const room = createRoom(id);
    this.rooms.set(id, room);
    this.persist();
    return room;
  }

  getRoom(roomId: RoomId): GameRoom | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;
    // lazily prune
    room.reservedSeats = pruneExpiredReservations(room.reservedSeats);
    return room;
  }

  upsertRoom(room: GameRoom): void {
    this.rooms.set(room.id, room);
    this.persist();
  }

  joinRoom(args: { roomId: RoomId; socketId: string; name: string; playerId?: string }): {
    room: GameRoom;
    joined: ConnectedPlayer;
    isSpectator: boolean;
  } {
    const room = this.getRoom(args.roomId);
    if (!room) throw new Error("Room not found");

    room.reservedSeats = pruneExpiredReservations(room.reservedSeats);

    // If client provides playerId and it matches a reservation, reclaim that seat.
    if (args.playerId) {
      const resIdx = room.reservedSeats.findIndex((r) => r.playerId === args.playerId);
      if (resIdx !== -1) {
        const reservation = room.reservedSeats[resIdx]!;
        room.reservedSeats = [...room.reservedSeats.slice(0, resIdx), ...room.reservedSeats.slice(resIdx + 1)];
        const joined: ConnectedPlayer = {
          seat: reservation.seat,
          playerId: reservation.playerId,
          name: reservation.name,
          socketId: args.socketId
        };
        room.playersBySeat[reservation.seat] = joined;
        this.upsertRoom(room);
        return { room, joined, isSpectator: false };
      }
    }

    // If room has open seat, seat the player; otherwise spectator.
    const seat = firstOpenSeat(room.playersBySeat);
    if (seat === null) {
      room.spectators.add(args.socketId);
      this.upsertRoom(room);
      const joined: ConnectedPlayer = { seat: 0, playerId: randomPlayerId(), name: args.name, socketId: args.socketId };
      return { room, joined, isSpectator: true };
    }

    const joined: ConnectedPlayer = {
      seat,
      playerId: args.playerId ?? randomPlayerId(),
      name: args.name,
      socketId: args.socketId
    };
    room.playersBySeat[seat] = joined;
    this.upsertRoom(room);
    return { room, joined, isSpectator: false };
  }

  markDisconnected(socketId: string): { room: GameRoom; reservation: ReservedSeat } | null {
    for (const room of this.rooms.values()) {
      const seat = room.playersBySeat.findIndex((p) => p?.socketId === socketId);
      if (seat === -1) continue;
      const player = room.playersBySeat[seat]!;
      room.playersBySeat[seat] = null;
      const reservation: ReservedSeat = {
        seat: seat as SeatIndex,
        playerId: player.playerId,
        name: player.name,
        reservedUntilMs: nowMs() + RESERVATION_MS
      };
      room.reservedSeats = pruneExpiredReservations([...room.reservedSeats, reservation]);
      this.upsertRoom(room);
      return { room, reservation };
    }
    return null;
  }

  roomSummary(room: GameRoom) {
    const players = room.playersBySeat.map((p) => (p ? { seat: p.seat, playerId: p.playerId, name: p.name } : null));
    return {
      roomId: room.id,
      phase: room.phase,
      isFull: roomIsFull(room),
      players,
      reservedSeats: room.reservedSeats.map((r) => ({
        seat: r.seat,
        playerId: r.playerId,
        name: r.name,
        reservedUntilMs: r.reservedUntilMs
      })),
      spectatorCount: room.spectators.size
    };
  }

  players(room: GameRoom) {
    return activePlayers(room);
  }
}

