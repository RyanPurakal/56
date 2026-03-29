import type { Card, Player, PlayerId, Rng } from "../../shared/src/index.js";
export declare function createDeck(): ReadonlyArray<Card>;
/**
 * The ONLY function allowed to use randomness.
 * Provide a seeded `rng` in tests to make shuffles deterministic.
 */
export declare function shuffleDeck(deck: ReadonlyArray<Card>, rng?: Rng): ReadonlyArray<Card>;
export declare function dealHands(deck: ReadonlyArray<Card>, players: ReadonlyArray<Player>): Readonly<Record<PlayerId, ReadonlyArray<Card>>>;
