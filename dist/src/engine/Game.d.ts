import type { GameState, Player, PlayerId, Rng } from "../../shared/src/index.js";
export declare function getPlayerIndex(players: ReadonlyArray<Player>, playerId: PlayerId): number;
export declare function createGame(players: ReadonlyArray<Player>): GameState;
export declare function dealCards(state: GameState, rng?: Rng): GameState;
