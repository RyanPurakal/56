import type { PlayerId, TeamId, Player } from "./PlayerTypes.js";
import type { Bid, Pass, Double } from "./MoveTypes.js";
export type Suit = "S" | "H" | "D" | "C";
export type Rank = "J" | "9" | "A" | "10" | "K" | "Q";
export type Phase = "DEAL" | "BIDDING" | "PLAY" | "SCORING";
export type Card = Readonly<{
    uid: string;
    suit: Suit;
    rank: Rank;
}>;
export type BiddingState = Readonly<{
    currentPlayerIndex: number;
    highestBid: Readonly<{
        amount: number;
        trump: Suit;
        bidderId: PlayerId;
    }> | null;
    multiplier: 1 | 2 | 4;
    passesSinceLastAction: number;
    history: ReadonlyArray<Bid | Pass | Double>;
}>;
export type TrickPlay = Readonly<{
    playerId: PlayerId;
    card: Card;
}>;
export type Trick = Readonly<{
    leaderId: PlayerId;
    plays: ReadonlyArray<TrickPlay>;
}>;
export type CompletedTrick = Readonly<{
    leaderId: PlayerId;
    plays: ReadonlyArray<TrickPlay>;
    winnerId: PlayerId;
    winningTeamId: TeamId;
}>;
export type PlayState = Readonly<{
    trump: Suit;
    leaderId: PlayerId;
    turnPlayerIndex: number;
    currentTrick: Trick;
    completedTricks: ReadonlyArray<CompletedTrick>;
}>;
export type ScoreSummary = Readonly<{
    rawPointsByTeam: Readonly<Record<TeamId, number>>;
    contract: Readonly<{
        bidderTeamId: TeamId;
        amount: number;
        multiplier: 1 | 2 | 4;
        trump: Suit;
    }>;
    contractMet: boolean;
    numericScoreByTeam: Readonly<Record<TeamId, number>>;
}>;
export type GameState = Readonly<{
    players: ReadonlyArray<Player>;
    dealerId: PlayerId;
    phase: Phase;
    deck: ReadonlyArray<Card>;
    handsByPlayerId: Readonly<Record<PlayerId, ReadonlyArray<Card>>>;
    bidding: BiddingState | null;
    play: PlayState | null;
    score: ScoreSummary | null;
}>;
export type Rng = () => number;
