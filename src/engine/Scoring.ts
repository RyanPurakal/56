/**
 * End-of-hand scoring: tallies card-point values from completed tricks and produces a ScoreSummary
 * that applies the contract multiplier (1/2/4) to the winning or losing team's raw points.
 */
import type { Card, CompletedTrick, Player, PlayerId, ScoreSummary, Suit, TeamId } from "../../shared/src/index.js";
import { CARD_POINTS } from "../../shared/src/index.js";

export function getTeamId(players: ReadonlyArray<Player>, playerId: PlayerId): TeamId {
  const p = players.find((x) => x.id === playerId);
  if (!p) throw new Error(`Unknown playerId: ${playerId}`);
  return p.teamId;
}

export function pointsForCard(card: Card): number {
  return CARD_POINTS[card.rank] ?? 0;
}

export function calculateTeamPointsFromTricks(
  completedTricks: ReadonlyArray<CompletedTrick>
): Readonly<Record<TeamId, number>> {
  let team0 = 0;
  let team1 = 0;

  for (const trick of completedTricks) {
    const trickPoints = trick.plays.reduce((sum, p) => sum + pointsForCard(p.card), 0);
    if (trick.winningTeamId === 0) team0 += trickPoints;
    else team1 += trickPoints;
  }

  return { 0: team0, 1: team1 };
}

export function calculateScoreSummary(args: {
  players: ReadonlyArray<Player>;
  completedTricks: ReadonlyArray<CompletedTrick>;
  contract: { bidderId: PlayerId; amount: number; multiplier: 1 | 2 | 4; trump: Suit };
}): ScoreSummary {
  const raw = calculateTeamPointsFromTricks(args.completedTricks);
  const bidderTeamId = getTeamId(args.players, args.contract.bidderId);
  const defenderTeamId: TeamId = bidderTeamId === 0 ? 1 : 0;

  const bidderPoints = raw[bidderTeamId];
  const defenderPoints = raw[defenderTeamId];

  const contractMet = bidderPoints >= args.contract.amount;
  const m = args.contract.multiplier;

  const numericScoreByTeam: Record<TeamId, number> = {
    0: 0,
    1: 0
  };

  if (contractMet) {
    numericScoreByTeam[bidderTeamId] = bidderPoints * m;
    numericScoreByTeam[defenderTeamId] = defenderPoints;
  } else {
    numericScoreByTeam[bidderTeamId] = 0;
    numericScoreByTeam[defenderTeamId] = defenderPoints * m;
  }

  return {
    rawPointsByTeam: raw,
    contract: {
      bidderTeamId,
      amount: args.contract.amount,
      multiplier: m,
      trump: args.contract.trump
    },
    contractMet,
    numericScoreByTeam
  };
}

