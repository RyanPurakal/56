import type { GameState, Player } from "../../../shared/src/index.js";
import { createGame, dealCards } from "../../../src/engine/index.js";
import type { ConnectedPlayer, ReservedSeat, RoomId, SeatIndex } from "./types.js";

export type RoomPhase = "LOBBY" | "IN_GAME";

export type GameRoom = {
  id: RoomId;
  phase: RoomPhase;
  playersBySeat: Array<ConnectedPlayer | null>; // length 4
  reservedSeats: Array<ReservedSeat>;
  spectators: Set<string>; // socketIds
  gameState: GameState | null;
};

export function createRoom(id: RoomId): GameRoom {
  return {
    id,
    phase: "LOBBY",
    playersBySeat: [null, null, null, null],
    reservedSeats: [],
    spectators: new Set(),
    gameState: null
  };
}

export function roomIsFull(room: GameRoom): boolean {
  return room.playersBySeat.every((p) => p !== null);
}

export function activePlayers(room: GameRoom): ConnectedPlayer[] {
  return room.playersBySeat.filter((p): p is ConnectedPlayer => p !== null);
}

export function toEnginePlayers(room: GameRoom): Player[] {
  // stable seat order -> engine player array order
  return (room.playersBySeat.map((p, seat) => {
    if (!p) throw new Error(`Missing player in seat ${seat}`);
    const teamId = (seat % 2) as 0 | 1; // seats 0/2 vs 1/3
    return { id: p.playerId, name: p.name, teamId };
  })) as Player[];
}

export function startRoomGame(room: GameRoom): GameRoom {
  if (!roomIsFull(room)) throw new Error("Room not full");
  if (room.phase !== "LOBBY") throw new Error("Game already started");

  const players = toEnginePlayers(room);
  const gs0 = createGame(players);
  const gs1 = dealCards(gs0); // randomness occurs only inside engine shuffle

  return {
    ...room,
    phase: "IN_GAME",
    gameState: gs1
  };
}

