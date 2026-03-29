import { createDeck, dealHands, shuffleDeck } from "./Deck.js";
function assertUniquePlayerIds(players) {
    const ids = new Set(players.map((p) => p.id));
    if (ids.size !== players.length)
        throw new Error("Player ids must be unique");
}
function assertTwoTeams(players) {
    const team0 = players.filter((p) => p.teamId === 0).length;
    const team1 = players.filter((p) => p.teamId === 1).length;
    if (team0 !== 2 || team1 !== 2) {
        throw new Error("Expected 2 players on each of 2 teams (teamId 0/1)");
    }
}
function nextPlayerIndex(players, currentIndex) {
    return (currentIndex + 1) % players.length;
}
export function getPlayerIndex(players, playerId) {
    const idx = players.findIndex((p) => p.id === playerId);
    if (idx === -1)
        throw new Error(`Unknown playerId: ${playerId}`);
    return idx;
}
export function createGame(players) {
    if (players.length !== 4)
        throw new Error(`Expected 4 players, got ${players.length}`);
    assertUniquePlayerIds(players);
    assertTwoTeams(players);
    const dealerId = players[0].id;
    const deck = createDeck();
    const handsByPlayerId = Object.fromEntries(players.map((p) => [p.id, []]));
    return {
        players: players.slice(),
        dealerId,
        phase: "DEAL",
        deck,
        handsByPlayerId,
        bidding: null,
        play: null,
        score: null
    };
}
export function dealCards(state, rng) {
    if (state.phase !== "DEAL")
        throw new Error(`Cannot deal in phase ${state.phase}`);
    const shuffled = shuffleDeck(state.deck, rng);
    const handsByPlayerId = dealHands(shuffled, state.players);
    const dealerIndex = getPlayerIndex(state.players, state.dealerId);
    const firstBidderIndex = nextPlayerIndex(state.players, dealerIndex);
    return {
        ...state,
        deck: shuffled,
        handsByPlayerId,
        phase: "BIDDING",
        bidding: {
            currentPlayerIndex: firstBidderIndex,
            highestBid: null,
            multiplier: 1,
            passesSinceLastAction: 0,
            history: []
        },
        play: null,
        score: null
    };
}
