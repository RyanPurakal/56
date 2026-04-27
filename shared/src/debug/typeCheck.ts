/**
 * Compile-time type consistency check: instantiates every shared type to catch assignability
 * regressions; this file is never imported at runtime and contains no exported symbols.
 */
import type {
  Bid,
  BiddingState,
  Card,
  CompletedTrick,
  GameState,
  Move,
  Pass,
  PlayCard,
  Player,
  PlayerId,
  PlayState,
  Rank,
  ScoreSummary,
  Suit,
  TeamId,
  Trick,
  TrickPlay
} from "../index.js";

// This file is never executed in production; it exists to ensure
// shared types compile and are self-consistent.
// Engine integration checks live in test/rules.test.ts instead.

const _player: Player = { id: "p0", name: "P0", teamId: 0 };
const _card: Card = { uid: "S-J-0", suit: "S", rank: "J" };
const _trick: Trick = { leaderId: "p0", plays: [{ playerId: "p0", card: _card }] };
const _bid: Bid = { type: "Bid", playerId: "p0", amount: 28, trump: "S" };
const _pass: Pass = { type: "Pass", playerId: "p0" };
const _playCard: PlayCard = { type: "PlayCard", playerId: "p0", cardUid: "S-J-0" };
const _move: Move = _bid;

// Ensure type assignability
const _suit: Suit = "H";
const _rank: Rank = "J";
const _teamId: TeamId = 0;
const _playerId: PlayerId = "p0";

