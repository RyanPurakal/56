import { describe, expect, it } from "vitest";
import type { GameState, Player } from "../shared/src/index.js";
import { filterStateForPlayer } from "../server/src/game/visibility.js";
import { createGame, dealCards } from "../src/engine/index.js";

const players: Player[] = [
  { id: "p0", name: "P0", teamId: 0 },
  { id: "p1", name: "P1", teamId: 1 },
  { id: "p2", name: "P2", teamId: 0 },
  { id: "p3", name: "P3", teamId: 1 }
];

function setupGameWithHands(): GameState {
  return dealCards(createGame(players), () => 0.42);
}

describe("filterStateForPlayer", () => {
  it("shows the viewer's own hand as visible", () => {
    const gs = setupGameWithHands();
    const pub = filterStateForPlayer(gs, "p0");
    const myHand = pub.handsByPlayerId["p0"];
    expect(myHand).toBeDefined();
    expect("kind" in myHand!).toBe(true);
    expect((myHand as any).kind).toBe("visible");
    expect((myHand as any).cards).toHaveLength(12);
  });

  it("hides other players hands with correct count", () => {
    const gs = setupGameWithHands();
    const pub = filterStateForPlayer(gs, "p0");

    for (const p of players) {
      if (p.id === "p0") continue;
      const hand = pub.handsByPlayerId[p.id];
      expect(hand).toBeDefined();
      expect((hand as any).kind).toBe("hidden");
      expect((hand as any).count).toBe(12);
    }
  });

  it("passes through non-hand state unchanged", () => {
    const gs = setupGameWithHands();
    const pub = filterStateForPlayer(gs, "p0");

    expect(pub.phase).toBe(gs.phase);
    expect(pub.players).toBe(gs.players);
    expect(pub.dealerId).toBe(gs.dealerId);
    expect(pub.bidding).toBe(gs.bidding);
    expect(pub.play).toBe(gs.play);
    expect(pub.score).toBe(gs.score);
    expect(pub.deck).toBe(gs.deck);
  });

  it("exposes card details (uid, suit, rank) for visible hands", () => {
    const gs = setupGameWithHands();
    const pub = filterStateForPlayer(gs, "p1");
    const hand = pub.handsByPlayerId["p1"] as any;
    expect(hand.kind).toBe("visible");
    for (const card of hand.cards) {
      expect(card).toHaveProperty("uid");
      expect(card).toHaveProperty("suit");
      expect(card).toHaveProperty("rank");
    }
  });

  it("each player sees only their own cards", () => {
    const gs = setupGameWithHands();

    for (const p of players) {
      const pub = filterStateForPlayer(gs, p.id);
      const myHand = pub.handsByPlayerId[p.id] as any;
      expect(myHand.kind).toBe("visible");

      for (const other of players) {
        if (other.id === p.id) continue;
        const otherHand = pub.handsByPlayerId[other.id] as any;
        expect(otherHand.kind).toBe("hidden");
      }
    }
  });
});
