import type { Card, CompletedTrick, Player, PlayerId, ScoreSummary, Suit, TeamId } from "../../shared/src/index.js";
export declare function getTeamId(players: ReadonlyArray<Player>, playerId: PlayerId): TeamId;
export declare function pointsForCard(card: Card): number;
export declare function calculateTeamPointsFromTricks(completedTricks: ReadonlyArray<CompletedTrick>): Readonly<Record<TeamId, number>>;
export declare function calculateScoreSummary(args: {
    players: ReadonlyArray<Player>;
    completedTricks: ReadonlyArray<CompletedTrick>;
    contract: {
        bidderId: PlayerId;
        amount: number;
        multiplier: 1 | 2 | 4;
        trump: Suit;
    };
}): ScoreSummary;
