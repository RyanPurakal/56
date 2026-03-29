import type { GameState, PlayerId, PublicGameState, VisibleHand } from "../../../shared/src/index.js";

export function filterStateForPlayer(state: GameState, viewerPlayerId: PlayerId): PublicGameState {
  const hands: Record<string, VisibleHand> = {};
  for (const p of state.players) {
    const hand = state.handsByPlayerId[p.id] ?? [];
    if (p.id === viewerPlayerId) {
      hands[p.id] = {
        kind: "visible",
        cards: hand.map((c) => ({ uid: c.uid, suit: c.suit, rank: c.rank }))
      };
    } else {
      hands[p.id] = { kind: "hidden", count: hand.length };
    }
  }
  return {
    players: state.players,
    dealerId: state.dealerId,
    phase: state.phase,
    deck: state.deck,
    handsByPlayerId: hands,
    bidding: state.bidding,
    play: state.play,
    score: state.score
  };
}

export function fullStateForSpectator(state: GameState): GameState {
  return state;
}

