import { describe, expect, it } from "vitest";
import type { GameState, Player } from "../shared/src/index.js";
import { createGame, dealCards, applyMove, getValidMoves } from "../src/engine/index.js";

const players: Player[] = [
  { id: "p0", name: "P0", teamId: 0 },
  { id: "p1", name: "P1", teamId: 1 },
  { id: "p2", name: "P2", teamId: 0 },
  { id: "p3", name: "P3", teamId: 1 }
];

// Deterministic RNG for reproducible tests
const seededRng = () => 0.42;

function setupBiddingPhase(): GameState {
  return dealCards(createGame(players), seededRng);
}

function completeBidding(state: GameState): GameState {
  // p1 bids 28S, then p2, p3, p0 pass
  let gs = applyMove(state, { type: "Bid", playerId: "p1", amount: 28, trump: "S" });
  gs = applyMove(gs, { type: "Pass", playerId: "p2" });
  gs = applyMove(gs, { type: "Pass", playerId: "p3" });
  gs = applyMove(gs, { type: "Pass", playerId: "p0" });
  return gs;
}

describe("State machine transitions", () => {
  it("DEAL → BIDDING via dealCards", () => {
    const gs0 = createGame(players);
    expect(gs0.phase).toBe("DEAL");
    const gs1 = dealCards(gs0, seededRng);
    expect(gs1.phase).toBe("BIDDING");
  });

  it("BIDDING → PLAY after bidding completes", () => {
    const gs = completeBidding(setupBiddingPhase());
    expect(gs.phase).toBe("PLAY");
    expect(gs.play).not.toBeNull();
    expect(gs.play!.trump).toBe("S");
    expect(gs.play!.leaderId).toBe("p1"); // bidder leads
  });

  it("PLAY → SCORING after all tricks played", () => {
    let gs = completeBidding(setupBiddingPhase());
    expect(gs.phase).toBe("PLAY");

    // Play all 12 tricks (48 cards / 4 players)
    let trickCount = 0;
    while (gs.phase === "PLAY") {
      const turnPlayerId = gs.players[gs.play!.turnPlayerIndex]!.id;
      const validMoves = getValidMoves(gs, turnPlayerId);
      expect(validMoves.length).toBeGreaterThan(0);
      gs = applyMove(gs, validMoves[0]!);

      if (gs.phase === "PLAY" && gs.play!.currentTrick.plays.length === 0) {
        trickCount++;
      }
    }

    expect(gs.phase).toBe("SCORING");
    expect(gs.score).not.toBeNull();
    expect(gs.play!.completedTricks).toHaveLength(12);
  });
});

describe("getValidMoves", () => {
  it("returns bidding moves during BIDDING phase for current player", () => {
    const gs = setupBiddingPhase();
    const currentPlayer = gs.players[gs.bidding!.currentPlayerIndex]!.id;
    const moves = getValidMoves(gs, currentPlayer);
    expect(moves.length).toBeGreaterThan(0);
    expect(moves.every((m) => m.type === "Bid" || m.type === "Pass" || m.type === "Double")).toBe(true);
  });

  it("returns empty array for non-current player", () => {
    const gs = setupBiddingPhase();
    const currentPlayer = gs.players[gs.bidding!.currentPlayerIndex]!.id;
    const otherPlayer = gs.players.find((p) => p.id !== currentPlayer)!.id;
    const moves = getValidMoves(gs, otherPlayer);
    expect(moves).toHaveLength(0);
  });

  it("returns PlayCard moves during PLAY phase", () => {
    const gs = completeBidding(setupBiddingPhase());
    expect(gs.phase).toBe("PLAY");
    const turnPlayer = gs.players[gs.play!.turnPlayerIndex]!.id;
    const moves = getValidMoves(gs, turnPlayer);
    expect(moves.length).toBeGreaterThan(0);
    expect(moves.every((m) => m.type === "PlayCard")).toBe(true);
  });

  it("throws for unknown player ID", () => {
    const gs = setupBiddingPhase();
    expect(() => getValidMoves(gs, "unknown")).toThrow(/Unknown/);
  });
});

describe("applyMove", () => {
  it("rejects moves from wrong player", () => {
    const gs = setupBiddingPhase();
    const currentPlayer = gs.players[gs.bidding!.currentPlayerIndex]!.id;
    const otherPlayer = gs.players.find((p) => p.id !== currentPlayer)!.id;
    expect(() => applyMove(gs, { type: "Bid", playerId: otherPlayer, amount: 28, trump: "S" })).toThrow(/Invalid/);
  });

  it("rejects invalid moves during PLAY", () => {
    const gs = completeBidding(setupBiddingPhase());
    const turnPlayer = gs.players[gs.play!.turnPlayerIndex]!.id;
    expect(() => applyMove(gs, { type: "PlayCard", playerId: turnPlayer, cardUid: "nonexistent-card" })).toThrow();
  });

  it("does not mutate the original state", () => {
    const gs = setupBiddingPhase();
    const currentPlayer = gs.players[gs.bidding!.currentPlayerIndex]!.id;
    const originalPhase = gs.phase;
    const originalBidding = gs.bidding;
    applyMove(gs, { type: "Bid", playerId: currentPlayer, amount: 28, trump: "S" });
    expect(gs.phase).toBe(originalPhase);
    expect(gs.bidding).toBe(originalBidding);
  });
});
