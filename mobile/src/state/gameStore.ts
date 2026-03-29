import { create } from "zustand";
import type {
  Card,
  GameStateUpdatePayload,
  PublicGameState,
  RoomSummary,
  ServerToClientEvents,
  Suit,
  TrickPlay,
  VisibleHand
} from "../../../shared/src/index.js";
import type { GameState } from "../../../shared/src/index.js";

export type ClientPhase = "lobby" | "dealing" | "bidding" | "playing" | "scoring";

type PlayerJoinedPayload = Parameters<ServerToClientEvents["player_joined"]>[0];

type GameStore = {
  serverUrl: string;
  setServerUrl: (url: string) => void;

  connectionStatus: "disconnected" | "connecting" | "connected" | "reconnecting";
  setConnectionStatus: (s: GameStore["connectionStatus"]) => void;

  currentRoomId: string | null;
  playerId: string | null;
  playerName: string;
  seat: number | null;
  spectator: boolean;

  serverPhase: "LOBBY" | "IN_GAME" | null;
  roomSummary: RoomSummary | null;

  // Derived view model from server game state
  gameState: GameStateUpdatePayload | null;
  clientPhase: ClientPhase;
  trump: Suit | null;
  currentTurnPlayerId: string | null;
  tableCards: ReadonlyArray<TrickPlay>;
  myHand: ReadonlyArray<Card>;
  invalidMoveMessage: string | null;

  onRoomUpdate: (payload: RoomSummary) => void;
  onGameStateUpdate: (payload: GameStateUpdatePayload) => void;
  onInvalidMove: (message: string) => void;
  onPlayerJoined: (payload: PlayerJoinedPayload) => void;
  onGameStarted: () => void;

  resetToLobby: () => void;
  /** Clear round state but stay in room (Figma “Play again” → room). */
  resetToRoom: () => void;
};

function phaseFromServer(gs: GameState | PublicGameState | null): ClientPhase {
  if (!gs) return "lobby";
  if (gs.phase === "DEAL") return "dealing";
  if (gs.phase === "BIDDING") return "bidding";
  if (gs.phase === "PLAY") return "playing";
  if (gs.phase === "SCORING") return "scoring";
  return "lobby";
}

function extractMyHand(handsByPlayerId: GameStateUpdatePayload["handsByPlayerId"], me: string | null): ReadonlyArray<Card> {
  if (!me) return [];
  const hand = (handsByPlayerId as Record<string, VisibleHand>)[me];
  if (hand && "kind" in hand && hand.kind === "visible") {
    return hand.cards as ReadonlyArray<Card>;
  }
  return [];
}

function extractHandCount(handsByPlayerId: GameStateUpdatePayload["handsByPlayerId"], playerId: string): number {
  const hand = (handsByPlayerId as Record<string, VisibleHand>)[playerId];
  if (!hand || !("kind" in hand)) return 0;
  return hand.kind === "hidden" ? hand.count : hand.kind === "visible" ? hand.cards.length : 0;
}

export const useGameStore = create<GameStore>((set, get) => ({
  serverUrl: "http://localhost:3000",
  setServerUrl: (url) => set({ serverUrl: url }),

  connectionStatus: "disconnected",
  setConnectionStatus: (s) => set({ connectionStatus: s }),

  currentRoomId: null,
  playerId: null,
  playerName: "",
  seat: null,
  spectator: false,

  serverPhase: null,
  roomSummary: null,

  gameState: null,
  clientPhase: "lobby",
  trump: null,
  currentTurnPlayerId: null,
  tableCards: [],
  myHand: [],
  invalidMoveMessage: null,

  onRoomUpdate: (payload) => {
    set({
      roomSummary: payload,
      currentRoomId: payload.roomId,
      serverPhase: payload.phase
    });
  },

  onPlayerJoined: (payload) => {
    set({
      currentRoomId: payload.roomId,
      playerId: payload.playerId,
      playerName: payload.name,
      seat: payload.seat ?? null,
      spectator: Boolean(payload.spectator)
    });
  },

  onGameStarted: () => {
    // no-op; we switch views on game_state_update
  },

  onGameStateUpdate: (payload) => {
    const me = get().playerId;
    const trump = payload.bidding?.highestBid?.trump ?? payload.play?.trump ?? null;
    const currentTurnPlayerId =
      payload.phase === "BIDDING" && payload.bidding
        ? payload.players[payload.bidding.currentPlayerIndex]?.id ?? null
        : payload.phase === "PLAY" && payload.play
          ? payload.players[payload.play.turnPlayerIndex]?.id ?? null
          : null;

    const myHand = extractMyHand(payload.handsByPlayerId, me);

    const tableCards: ReadonlyArray<TrickPlay> = payload.play?.currentTrick?.plays?.slice() ?? [];

    set({
      gameState: payload,
      clientPhase: phaseFromServer(payload),
      trump,
      currentTurnPlayerId,
      myHand,
      tableCards
    });
  },

  onInvalidMove: (message) => {
    set({ invalidMoveMessage: message });
    setTimeout(() => {
      // Only clear if unchanged
      if (get().invalidMoveMessage === message) set({ invalidMoveMessage: null });
    }, 2500);
  },

  resetToLobby: () =>
    set({
      currentRoomId: null,
      playerId: null,
      playerName: "",
      seat: null,
      spectator: false,
      serverPhase: null,
      roomSummary: null,
      gameState: null,
      clientPhase: "lobby",
      trump: null,
      currentTurnPlayerId: null,
      tableCards: [],
      myHand: [],
      invalidMoveMessage: null
    }),

  resetToRoom: () =>
    set({
      gameState: null,
      clientPhase: "lobby",
      trump: null,
      currentTurnPlayerId: null,
      tableCards: [],
      myHand: [],
      invalidMoveMessage: null
    })
}));

