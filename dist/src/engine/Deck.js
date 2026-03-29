import { RANK_ORDER, SUITS } from "../../shared/src/index.js";
export function createDeck() {
    const deck = [];
    // Two identical decks -> two physical copies of each suit+rank
    for (let copy = 0; copy < 2; copy++) {
        for (const suit of SUITS) {
            for (const rank of RANK_ORDER) {
                deck.push({
                    uid: `${suit}-${rank}-${copy}`,
                    suit,
                    rank
                });
            }
        }
    }
    return deck;
}
/**
 * The ONLY function allowed to use randomness.
 * Provide a seeded `rng` in tests to make shuffles deterministic.
 */
export function shuffleDeck(deck, rng = Math.random) {
    const a = deck.slice();
    // Fisher–Yates
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        const tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a;
}
export function dealHands(deck, players) {
    if (players.length !== 4) {
        throw new Error(`Expected 4 players, got ${players.length}`);
    }
    if (deck.length !== 48) {
        throw new Error(`Expected 48-card deck, got ${deck.length}`);
    }
    const handSize = 12;
    const hands = Object.fromEntries(players.map((p) => [p.id, []]));
    for (let i = 0; i < players.length * handSize; i++) {
        const player = players[i % players.length];
        hands[player.id].push(deck[i]);
    }
    return Object.fromEntries(players.map((p) => [p.id, hands[p.id].slice()]));
}
