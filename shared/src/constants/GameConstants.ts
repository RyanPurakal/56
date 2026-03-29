import type { Rank, Suit } from "../types/GameTypes.js";

export const SUITS: ReadonlyArray<Suit> = ["S", "H", "D", "C"];

export const RANK_ORDER: ReadonlyArray<Rank> = ["J", "9", "A", "10", "K", "Q"];

export const CARD_POINTS: Readonly<Record<Rank, number>> = {
  J: 3,
  "9": 2,
  A: 1,
  "10": 1,
  K: 0,
  Q: 0
} as const;

