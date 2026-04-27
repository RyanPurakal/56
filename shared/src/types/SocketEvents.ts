/**
 * Typed Socket.IO event maps for both directions, plus the room-system payloads and the
 * visibility-filtered PublicGameState that the server sends to seated players (opponents' hands
 * replaced by { kind: "hidden"; count }).
 */
import type { Suit } from "./GameTypes.js";
import type { GameState } from "./GameTypes.js";

// Room system payloads
export type RoomPhase = "LOBBY" | "IN_GAME";
export type RoomId = string;

export type RoomSeatSummary = Readonly<{ seat: number; playerId: string; name: string }> | null;
export type ReservedSeatSummary = Readonly<{ seat: number; playerId: string; name: string; reservedUntilMs: number }>;

export type RoomSummary = Readonly<{
  roomId: RoomId;
  phase: RoomPhase;
  isFull: boolean;
  players: ReadonlyArray<RoomSeatSummary>;
  reservedSeats: ReadonlyArray<ReservedSeatSummary>;
  spectatorCount: number;
}>;

export type PlayerJoinedPayload = Readonly<{
  roomId: RoomId;
  seat?: number;
  playerId: string;
  name: string;
  spectator?: boolean;
}>;

// Visibility-filtered state types
export type VisibleHand =
  | Readonly<{ kind: "visible"; cards: ReadonlyArray<Readonly<{ uid: string; suit: string; rank: string }>> }>
  | Readonly<{ kind: "hidden"; count: number }>;

export type PublicGameState = Omit<GameState, "handsByPlayerId"> & {
  handsByPlayerId: Record<string, VisibleHand>;
};

export type GameStateUpdatePayload = PublicGameState | GameState;

// STRICT socket event maps (Socket.IO style: event -> handler signature)
export type ClientToServerEvents = {
  create_room: (payload: { name: string }) => void;
  join_room: (payload: { roomId: RoomId; name: string; playerId?: string; playerToken?: string; spectator?: boolean }) => void;
  start_game: (payload: { roomId: RoomId }) => void;
  make_bid: (payload: { roomId: RoomId; action: "Bid" | "Pass" | "Double"; amount?: number; trump?: Suit }) => void;
  play_card: (payload: { roomId: RoomId; cardUid: string }) => void;
};

export type ServerToClientEvents = {
  room_update: (payload: RoomSummary) => void;
  game_state_update: (payload: GameStateUpdatePayload) => void;
  invalid_move: (payload: { message: string }) => void;
  player_joined: (payload: PlayerJoinedPayload) => void;
  game_started: (payload: { roomId: RoomId }) => void;
  player_token: (payload: { token: string }) => void;
};

