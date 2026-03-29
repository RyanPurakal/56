import { applyMove, createGame, dealCards } from "../../../src/engine/index.js";
// This file is never executed in production; it exists to ensure
// shared types can flow through engine/server/mobile builds.
const players = [
    { id: "p0", name: "P0", teamId: 0 },
    { id: "p1", name: "P1", teamId: 1 },
    { id: "p2", name: "P2", teamId: 0 },
    { id: "p3", name: "P3", teamId: 1 }
];
const gs0 = createGame(players);
const gs1 = dealCards(gs0, () => 0.42);
// Minimal bidding sequence: p1 bids 28S, then 3 passes to end bidding.
const gs2 = applyMove(gs1, { type: "Bid", playerId: "p1", amount: 28, trump: "S" });
const gs3 = applyMove(gs2, { type: "Pass", playerId: "p2" });
const gs4 = applyMove(gs3, { type: "Pass", playerId: "p3" });
const gs5 = applyMove(gs4, { type: "Pass", playerId: "p0" });
// Now in PLAY. Play a single card from the current leader.
if (gs5.phase === "PLAY") {
    const leader = gs5.players[gs5.play.turnPlayerIndex].id;
    const leaderHand = gs5.handsByPlayerId[leader];
    const firstCardUid = leaderHand[0].uid;
    applyMove(gs5, { type: "PlayCard", playerId: leader, cardUid: firstCardUid });
}
