import type { Card, Player, PlayerId, Suit, TeamId, Trick, TrickPlay } from "../../shared/src/index.js";
export declare function getTeamId(players: ReadonlyArray<Player>, playerId: PlayerId): TeamId;
export declare function getLeadSuit(trick: Trick): Suit | null;
export declare function cardsOfSuit(hand: ReadonlyArray<Card>, suit: Suit): ReadonlyArray<Card>;
export declare function validPlaysForFollowSuit(hand: ReadonlyArray<Card>, leadSuit: Suit | null): ReadonlyArray<Card>;
export declare function resolveTrickWinner(trickPlays: ReadonlyArray<TrickPlay>, trump: Suit): {
    winnerId: PlayerId;
    winningCard: Card;
};
export declare function nextTurnIndex(players: ReadonlyArray<Player>, currentIndex: number): number;
export declare function startNewTrick(leaderId: PlayerId): Trick;
export declare function appendPlay(trick: Trick, play: TrickPlay): Trick;
