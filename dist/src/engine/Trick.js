import { RANK_ORDER } from "../../shared/src/index.js";
export function getTeamId(players, playerId) {
    const p = players.find((x) => x.id === playerId);
    if (!p)
        throw new Error(`Unknown playerId: ${playerId}`);
    return p.teamId;
}
export function getLeadSuit(trick) {
    return trick.plays.length > 0 ? trick.plays[0].card.suit : null;
}
export function cardsOfSuit(hand, suit) {
    return hand.filter((c) => c.suit === suit);
}
export function validPlaysForFollowSuit(hand, leadSuit) {
    if (!leadSuit)
        return hand.slice();
    const suited = cardsOfSuit(hand, leadSuit);
    return suited.length > 0 ? suited : hand.slice();
}
function rankIndex(rank) {
    const idx = RANK_ORDER.indexOf(rank);
    if (idx === -1)
        throw new Error(`Unknown rank: ${rank}`);
    return idx;
}
export function resolveTrickWinner(trickPlays, trump) {
    if (trickPlays.length !== 4)
        throw new Error("Trick must have 4 plays to resolve");
    const leadSuit = trickPlays[0].card.suit;
    const compare = (a, b) => {
        const aIsTrump = a.card.suit === trump;
        const bIsTrump = b.card.suit === trump;
        if (aIsTrump !== bIsTrump)
            return aIsTrump ? 1 : -1;
        const suitToFollow = aIsTrump ? trump : leadSuit;
        const aFollows = a.card.suit === suitToFollow;
        const bFollows = b.card.suit === suitToFollow;
        if (aFollows !== bFollows)
            return aFollows ? 1 : -1;
        // Higher rank wins; lower index in RANK_ORDER is higher rank
        return rankIndex(b.card.rank) - rankIndex(a.card.rank);
    };
    let best = trickPlays[0];
    for (let i = 1; i < trickPlays.length; i++) {
        const cur = trickPlays[i];
        if (compare(cur, best) > 0)
            best = cur;
    }
    return { winnerId: best.playerId, winningCard: best.card };
}
export function nextTurnIndex(players, currentIndex) {
    return (currentIndex + 1) % players.length;
}
export function startNewTrick(leaderId) {
    return { leaderId, plays: [] };
}
export function appendPlay(trick, play) {
    return { ...trick, plays: [...trick.plays, play] };
}
