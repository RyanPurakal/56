import { describe, expect, it } from "vitest";
import type { Player } from "../shared/src/index.js";
import { createGame, dealCards } from "../src/engine/index.js";

const validPlayers: Player[] = [
  { id: "p0", name: "P0", teamId: 0 },
  { id: "p1", name: "P1", teamId: 1 },
  { id: "p2", name: "P2", teamId: 0 },
  { id: "p3", name: "P3", teamId: 1 }
];

describe("createGame", () => {
  it("creates a game with 4 players in DEAL phase", () => {
    const gs = createGame(validPlayers);
    expect(gs.phase).toBe("DEAL");
    expect(gs.players).toHaveLength(4);
    expect(gs.dealerId).toBe("p0");
    expect(gs.bidding).toBeNull();
    expect(gs.play).toBeNull();
    expect(gs.score).toBeNull();
  });

  it("rejects fewer than 4 players", () => {
    expect(() => createGame(validPlayers.slice(0, 3))).toThrow(/Expected 4/);
  });

  it("rejects more than 4 players", () => {
    const five = [...validPlayers, { id: "p4", name: "P4", teamId: 0 as const }];
    expect(() => createGame(five)).toThrow(/Expected 4/);
  });

  it("rejects duplicate player IDs", () => {
    const dupes: Player[] = [
      { id: "p0", name: "P0", teamId: 0 },
      { id: "p0", name: "P1", teamId: 1 },
      { id: "p2", name: "P2", teamId: 0 },
      { id: "p3", name: "P3", teamId: 1 }
    ];
    expect(() => createGame(dupes)).toThrow(/unique/);
  });

  it("rejects invalid team composition", () => {
    const badTeams: Player[] = [
      { id: "p0", name: "P0", teamId: 0 },
      { id: "p1", name: "P1", teamId: 0 },
      { id: "p2", name: "P2", teamId: 0 },
      { id: "p3", name: "P3", teamId: 1 }
    ];
    expect(() => createGame(badTeams)).toThrow(/2 players/);
  });

  it("creates a deck of 48 cards", () => {
    const gs = createGame(validPlayers);
    expect(gs.deck).toHaveLength(48);
  });
});

describe("dealCards", () => {
  it("transitions from DEAL to BIDDING", () => {
    const gs0 = createGame(validPlayers);
    const gs1 = dealCards(gs0);
    expect(gs1.phase).toBe("BIDDING");
  });

  it("deals 12 cards to each player", () => {
    const gs0 = createGame(validPlayers);
    const gs1 = dealCards(gs0, () => 0.5);
    for (const p of validPlayers) {
      expect(gs1.handsByPlayerId[p.id]).toHaveLength(12);
    }
  });

  it("sets first bidder to the player after the dealer", () => {
    const gs0 = createGame(validPlayers);
    const gs1 = dealCards(gs0, () => 0.5);
    expect(gs1.bidding).not.toBeNull();
    // Dealer is p0 (index 0), so first bidder should be p1 (index 1)
    expect(gs1.bidding!.currentPlayerIndex).toBe(1);
  });

  it("initializes bidding state correctly", () => {
    const gs0 = createGame(validPlayers);
    const gs1 = dealCards(gs0, () => 0.5);
    expect(gs1.bidding!.highestBid).toBeNull();
    expect(gs1.bidding!.multiplier).toBe(1);
    expect(gs1.bidding!.passesSinceLastAction).toBe(0);
    expect(gs1.bidding!.history).toEqual([]);
  });

  it("rejects dealing in non-DEAL phase", () => {
    const gs0 = createGame(validPlayers);
    const gs1 = dealCards(gs0, () => 0.5);
    expect(() => dealCards(gs1)).toThrow(/Cannot deal/);
  });

  it("produces deterministic hands with seeded RNG", () => {
    const gs0 = createGame(validPlayers);
    const gs1 = dealCards(gs0, () => 0.42);
    const gs2 = dealCards(gs0, () => 0.42);
    expect(gs1.handsByPlayerId).toEqual(gs2.handsByPlayerId);
  });
});
