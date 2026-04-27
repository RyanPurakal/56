/** Public surface of the game engine consumed by the server; re-exports types and the four core functions. */
export type { GameState, Move, Player, PlayerId, Suit } from "../../shared/src/index.js";
export { CARD_POINTS, RANK_ORDER, SUITS } from "../../shared/src/index.js";

// Public core-engine API
export { createGame, dealCards } from "./Game.js";
export { applyMove, getValidMoves } from "./Rules.js";

