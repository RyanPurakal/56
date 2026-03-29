import { describe, expect, it } from "vitest";
import { applyBiddingMove, getValidBiddingMoves, isBiddingComplete } from "../src/engine/Bidding.js";
const players = [
    { id: "p0", name: "P0", teamId: 0 },
    { id: "p1", name: "P1", teamId: 1 },
    { id: "p2", name: "P2", teamId: 0 },
    { id: "p3", name: "P3", teamId: 1 }
];
describe("Bidding", () => {
    it("enforces strictly increasing bids", () => {
        let bidding = {
            currentPlayerIndex: 0,
            highestBid: null,
            multiplier: 1,
            passesSinceLastAction: 0,
            history: []
        };
        bidding = applyBiddingMove(players, bidding, { type: "Bid", playerId: "p0", amount: 28, trump: "S" });
        expect(() => applyBiddingMove(players, bidding, { type: "Bid", playerId: "p1", amount: 28, trump: "H" })).toThrow(/higher/);
    });
    it("allows double by defenders then redouble by bidders", () => {
        let bidding = {
            currentPlayerIndex: 0,
            highestBid: null,
            multiplier: 1,
            passesSinceLastAction: 0,
            history: []
        };
        // p0 bids; bidder team = 0
        bidding = applyBiddingMove(players, bidding, { type: "Bid", playerId: "p0", amount: 28, trump: "S" });
        // p1 is defender team 1 -> can double
        const movesP1 = getValidBiddingMoves(players, bidding).filter((m) => m.playerId === "p1");
        expect(movesP1.some((m) => m.type === "Double")).toBe(true);
        bidding = applyBiddingMove(players, bidding, { type: "Double", playerId: "p1" });
        expect(bidding.multiplier).toBe(2);
        // p2 is bidder team 0 -> can redouble (represented as Double)
        const movesP2 = getValidBiddingMoves(players, bidding).filter((m) => m.playerId === "p2");
        expect(movesP2.some((m) => m.type === "Double")).toBe(true);
        bidding = applyBiddingMove(players, bidding, { type: "Double", playerId: "p2" });
        expect(bidding.multiplier).toBe(4);
    });
    it("ends after 3 consecutive passes once there is a highest bid", () => {
        let bidding = {
            currentPlayerIndex: 0,
            highestBid: null,
            multiplier: 1,
            passesSinceLastAction: 0,
            history: []
        };
        bidding = applyBiddingMove(players, bidding, { type: "Bid", playerId: "p0", amount: 28, trump: "S" });
        bidding = applyBiddingMove(players, bidding, { type: "Pass", playerId: "p1" });
        bidding = applyBiddingMove(players, bidding, { type: "Pass", playerId: "p2" });
        bidding = applyBiddingMove(players, bidding, { type: "Pass", playerId: "p3" });
        expect(isBiddingComplete(bidding)).toBe(true);
    });
});
