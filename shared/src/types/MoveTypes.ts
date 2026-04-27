/**
 * All player actions as a discriminated union: Bid (amount 28–56 + trump suit), Pass, Double
 * (doubles/redoubles the contract multiplier), and PlayCard (references a card by uid).
 */
import type { PlayerId } from "./PlayerTypes.js";
import type { Suit } from "./GameTypes.js";

export type Bid = Readonly<{
  type: "Bid";
  playerId: PlayerId;
  amount: number; // 28..56
  trump: Suit;
}>;

export type Pass = Readonly<{
  type: "Pass";
  playerId: PlayerId;
}>;

export type Double = Readonly<{
  type: "Double";
  playerId: PlayerId;
}>;

export type PlayCard = Readonly<{
  type: "PlayCard";
  playerId: PlayerId;
  cardUid: string;
}>;

export type Move = Bid | Pass | Double | PlayCard;

