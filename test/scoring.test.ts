import { describe, expect, it } from "vitest";
import type { Card, CompletedTrick, Player } from "../shared/src/index.js";
import { calculateScoreSummary, calculateTeamPointsFromTricks, pointsForCard } from "../src/engine/Scoring.js";

function c(suit: Card["suit"], rank: Card["rank"]): Card {
  return { uid: `${suit}-${rank}-0`, suit, rank };
}

const players: Player[] = [
  { id: "p0", name: "P0", teamId: 0 },
  { id: "p1", name: "P1", teamId: 1 },
  { id: "p2", name: "P2", teamId: 0 },
  { id: "p3", name: "P3", teamId: 1 }
];

describe("pointsForCard", () => {
  it("assigns correct point values", () => {
    expect(pointsForCard(c("S", "J"))).toBe(3);
    expect(pointsForCard(c("H", "9"))).toBe(2);
    expect(pointsForCard(c("D", "A"))).toBe(1);
    expect(pointsForCard(c("C", "10"))).toBe(1);
    expect(pointsForCard(c("S", "K"))).toBe(0);
    expect(pointsForCard(c("H", "Q"))).toBe(0);
  });
});

describe("calculateTeamPointsFromTricks", () => {
  it("sums points for each team correctly", () => {
    const tricks: CompletedTrick[] = [
      {
        leaderId: "p0",
        plays: [
          { playerId: "p0", card: c("S", "J") },  // 3
          { playerId: "p1", card: c("S", "9") },  // 2
          { playerId: "p2", card: c("S", "A") },  // 1
          { playerId: "p3", card: c("S", "10") }  // 1
        ],
        winnerId: "p0",
        winningTeamId: 0
      },
      {
        leaderId: "p1",
        plays: [
          { playerId: "p1", card: c("H", "J") },  // 3
          { playerId: "p2", card: c("H", "K") },  // 0
          { playerId: "p3", card: c("H", "Q") },  // 0
          { playerId: "p0", card: c("H", "10") }  // 1
        ],
        winnerId: "p1",
        winningTeamId: 1
      }
    ];

    const result = calculateTeamPointsFromTricks(tricks);
    expect(result[0]).toBe(7);  // trick 1: J(3)+9(2)+A(1)+10(1) = 7
    expect(result[1]).toBe(4);  // trick 2: J(3)+K(0)+Q(0)+10(1) = 4
  });

  it("returns zero for both teams with no tricks", () => {
    const result = calculateTeamPointsFromTricks([]);
    expect(result[0]).toBe(0);
    expect(result[1]).toBe(0);
  });
});

describe("calculateScoreSummary", () => {
  const baseTricks: CompletedTrick[] = [
    {
      leaderId: "p0",
      plays: [
        { playerId: "p0", card: c("S", "J") },
        { playerId: "p1", card: c("S", "K") },
        { playerId: "p2", card: c("S", "9") },
        { playerId: "p3", card: c("S", "Q") }
      ],
      winnerId: "p0",
      winningTeamId: 0
    }
  ];

  it("identifies contract met when bidder team has enough points", () => {
    const result = calculateScoreSummary({
      players,
      completedTricks: baseTricks,
      contract: { bidderId: "p0", amount: 5, multiplier: 1, trump: "S" }
    });
    expect(result.contractMet).toBe(true);
    expect(result.contract.bidderTeamId).toBe(0);
  });

  it("identifies contract failed when bidder team has insufficient points", () => {
    const result = calculateScoreSummary({
      players,
      completedTricks: baseTricks,
      contract: { bidderId: "p0", amount: 28, multiplier: 1, trump: "S" }
    });
    expect(result.contractMet).toBe(false);
  });

  it("applies multiplier to bidder score when contract is met", () => {
    const result = calculateScoreSummary({
      players,
      completedTricks: baseTricks,
      contract: { bidderId: "p0", amount: 5, multiplier: 2, trump: "S" }
    });
    expect(result.contractMet).toBe(true);
    // Raw bidder points = 5, multiplied by 2 = 10
    expect(result.numericScoreByTeam[0]).toBe(10);
    // Defender gets raw points
    expect(result.numericScoreByTeam[1]).toBe(0);
  });

  it("applies multiplier to defender score when contract fails", () => {
    const result = calculateScoreSummary({
      players,
      completedTricks: baseTricks,
      contract: { bidderId: "p0", amount: 28, multiplier: 4, trump: "S" }
    });
    expect(result.contractMet).toBe(false);
    // Bidder gets 0 on failure
    expect(result.numericScoreByTeam[0]).toBe(0);
    // Defender raw = 0, multiplied by 4 = 0
    expect(result.numericScoreByTeam[1]).toBe(0);
  });

  it("handles team 1 as bidder", () => {
    const result = calculateScoreSummary({
      players,
      completedTricks: baseTricks,
      contract: { bidderId: "p1", amount: 28, multiplier: 1, trump: "S" }
    });
    expect(result.contract.bidderTeamId).toBe(1);
    expect(result.contractMet).toBe(false);
  });
});
