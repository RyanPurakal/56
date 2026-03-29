import type { GameState, Move, PlayerId } from "../../shared/src/index.js";
export declare function getValidMoves(state: GameState, playerId: PlayerId): ReadonlyArray<Move>;
export declare function applyMove(state: GameState, move: Move): GameState;
