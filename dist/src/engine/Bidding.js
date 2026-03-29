export function biddingCurrentPlayerId(players, bidding) {
    return players[bidding.currentPlayerIndex].id;
}
export function getTeamId(players, playerId) {
    const p = players.find((x) => x.id === playerId);
    if (!p)
        throw new Error(`Unknown playerId: ${playerId}`);
    return p.teamId;
}
export function isBidMove(move) {
    return move.type === "Bid";
}
export function isPassMove(move) {
    return move.type === "Pass";
}
export function isDoubleMove(move) {
    return move.type === "Double";
}
export function canBid(amount) {
    return Number.isInteger(amount) && amount >= 28 && amount <= 56;
}
export function isHigherBid(amount, highest) {
    if (!highest)
        return true;
    return amount > highest.amount;
}
export function canDouble(players, bidding, byPlayerId) {
    if (!bidding.highestBid)
        return false;
    const bidderTeam = getTeamId(players, bidding.highestBid.bidderId);
    const byTeam = getTeamId(players, byPlayerId);
    // defenders can double if not yet doubled
    return bidding.multiplier === 1 && byTeam !== bidderTeam;
}
export function canRedouble(players, bidding, byPlayerId) {
    if (!bidding.highestBid)
        return false;
    const bidderTeam = getTeamId(players, bidding.highestBid.bidderId);
    const byTeam = getTeamId(players, byPlayerId);
    // bidders can redouble after a double
    return bidding.multiplier === 2 && byTeam === bidderTeam;
}
export function getValidBiddingMoves(players, bidding) {
    const playerId = biddingCurrentPlayerId(players, bidding);
    const moves = [{ type: "Pass", playerId }];
    // Bid space: 28..56, strictly increasing
    const start = bidding.highestBid ? bidding.highestBid.amount + 1 : 28;
    for (let amount = start; amount <= 56; amount++) {
        for (const trump of ["S", "H", "D", "C"]) {
            moves.push({ type: "Bid", playerId, amount, trump });
        }
    }
    if (canDouble(players, bidding, playerId) || canRedouble(players, bidding, playerId)) {
        moves.push({ type: "Double", playerId });
    }
    return moves;
}
export function applyBiddingMove(players, bidding, move) {
    const expected = biddingCurrentPlayerId(players, bidding);
    if (move.playerId !== expected)
        throw new Error("Not your turn to bid");
    const nextIndex = (bidding.currentPlayerIndex + 1) % players.length;
    if (move.type === "Pass") {
        return {
            ...bidding,
            currentPlayerIndex: nextIndex,
            passesSinceLastAction: bidding.passesSinceLastAction + 1,
            history: [...bidding.history, move]
        };
    }
    if (move.type === "Bid") {
        if (!canBid(move.amount))
            throw new Error("Bid amount out of range");
        if (!isHigherBid(move.amount, bidding.highestBid))
            throw new Error("Bid must be higher than current highest bid");
        return {
            ...bidding,
            currentPlayerIndex: nextIndex,
            highestBid: { amount: move.amount, trump: move.trump, bidderId: move.playerId },
            multiplier: 1, // new contract resets doubles
            passesSinceLastAction: 0,
            history: [...bidding.history, move]
        };
    }
    // Double (or redouble)
    if (bidding.multiplier === 1) {
        if (!canDouble(players, bidding, move.playerId))
            throw new Error("Double not allowed");
        return {
            ...bidding,
            currentPlayerIndex: nextIndex,
            multiplier: 2,
            passesSinceLastAction: 0,
            history: [...bidding.history, move]
        };
    }
    if (bidding.multiplier === 2) {
        if (!canRedouble(players, bidding, move.playerId))
            throw new Error("Redouble not allowed");
        return {
            ...bidding,
            currentPlayerIndex: nextIndex,
            multiplier: 4,
            passesSinceLastAction: 0,
            history: [...bidding.history, move]
        };
    }
    throw new Error("Cannot double again");
}
export function isBiddingComplete(bidding) {
    return bidding.highestBid !== null && bidding.passesSinceLastAction >= 3;
}
