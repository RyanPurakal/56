import type { PlayerId } from "./PlayerTypes.js";
import type { Suit } from "./GameTypes.js";
export type Bid = Readonly<{
    type: "Bid";
    playerId: PlayerId;
    amount: number;
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
