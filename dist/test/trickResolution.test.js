import { describe, expect, it } from "vitest";
import { resolveTrickWinner, validPlaysForFollowSuit } from "../src/engine/Trick.js";
function c(uid, suit, rank) {
    return { uid, suit, rank };
}
describe("Trick resolution", () => {
    it("uses ranking order within lead suit when no trump played", () => {
        const plays = [
            { playerId: "p0", card: c("S-Q-0", "S", "Q") },
            { playerId: "p1", card: c("S-K-0", "S", "K") },
            { playerId: "p2", card: c("S-10-0", "S", "10") },
            { playerId: "p3", card: c("S-A-0", "S", "A") }
        ];
        // trump is hearts; nobody played hearts
        const winner = resolveTrickWinner(plays, "H");
        expect(winner.winnerId).toBe("p3"); // A beats 10,K,Q in this game
    });
    it("trump beats lead suit", () => {
        const plays = [
            { playerId: "p0", card: c("S-J-0", "S", "J") },
            { playerId: "p1", card: c("S-9-0", "S", "9") },
            { playerId: "p2", card: c("H-Q-0", "H", "Q") }, // trump
            { playerId: "p3", card: c("S-A-0", "S", "A") }
        ];
        const winner = resolveTrickWinner(plays, "H");
        expect(winner.winnerId).toBe("p2");
    });
    it("uses ranking order among trumps", () => {
        const plays = [
            { playerId: "p0", card: c("D-Q-0", "D", "Q") },
            { playerId: "p1", card: c("H-10-0", "H", "10") }, // trump
            { playerId: "p2", card: c("H-A-0", "H", "A") }, // trump
            { playerId: "p3", card: c("H-9-0", "H", "9") } // trump
        ];
        const winner = resolveTrickWinner(plays, "H");
        expect(winner.winnerId).toBe("p3"); // 9 beats A and 10 (J>9>A>10>K>Q)
    });
});
describe("Follow-suit filtering", () => {
    it("forces follow suit when possible", () => {
        const hand = [c("S-Q-0", "S", "Q"), c("H-J-0", "H", "J"), c("S-A-0", "S", "A")];
        const valid = validPlaysForFollowSuit(hand, "S");
        expect(valid.map((x) => x.uid).sort()).toEqual(["S-A-0", "S-Q-0"].sort());
    });
    it("allows any card when no lead suit available", () => {
        const hand = [c("D-10-0", "D", "10"), c("C-9-0", "C", "9")];
        const valid = validPlaysForFollowSuit(hand, null);
        expect(valid).toHaveLength(2);
    });
    it("allows any card if cannot follow suit", () => {
        const hand = [c("D-10-0", "D", "10"), c("C-9-0", "C", "9")];
        const valid = validPlaysForFollowSuit(hand, "H");
        expect(valid).toHaveLength(2);
    });
});
