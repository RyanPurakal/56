/**
 * Public engine API: `getValidMoves` enumerates legal moves for a player in the current phase;
 * `applyMove` validates against that set and returns the next immutable GameState, advancing
 * phase from BIDDING → PLAY → SCORING automatically when phase-completion conditions are met.
 */
import type { Bid, Card, CompletedTrick, Double, GameState, Move, Pass, PlayCard, Player, PlayerId } from "../../shared/src/index.js";
import { applyBiddingMove, getValidBiddingMoves, isBiddingComplete } from "./Bidding.js";
import { calculateScoreSummary } from "./Scoring.js";
import { appendPlay, getTeamId as teamIdFromPlayers, getLeadSuit, nextTurnIndex, resolveTrickWinner, startNewTrick, validPlaysForFollowSuit } from "./Trick.js";
import { getPlayerIndex } from "./Game.js";

function currentPlayerId(players: ReadonlyArray<Player>, index: number): PlayerId {
  return players[index]!.id;
}

function removeCardFromHand(hand: ReadonlyArray<Card>, cardUid: string): ReadonlyArray<Card> {
  const idx = hand.findIndex((c) => c.uid === cardUid);
  if (idx === -1) throw new Error("Card not in hand");
  return [...hand.slice(0, idx), ...hand.slice(idx + 1)];
}

function findCardInHand(hand: ReadonlyArray<Card>, cardUid: string): Card {
  const card = hand.find((c) => c.uid === cardUid);
  if (!card) throw new Error("Card not in hand");
  return card;
}

export function getValidMoves(state: GameState, playerId: PlayerId): ReadonlyArray<Move> {
  if (!state.players.some((p) => p.id === playerId)) throw new Error(`Unknown playerId: ${playerId}`);

  if (state.phase === "BIDDING") {
    if (!state.bidding) throw new Error("Missing bidding state");
    const expected = currentPlayerId(state.players, state.bidding.currentPlayerIndex);
    if (playerId !== expected) return [];
    return getValidBiddingMoves(state.players, state.bidding);
  }

  if (state.phase === "PLAY") {
    if (!state.play) throw new Error("Missing play state");
    const expected = currentPlayerId(state.players, state.play.turnPlayerIndex);
    if (playerId !== expected) return [];
    const hand = state.handsByPlayerId[playerId] ?? [];
    const leadSuit = getLeadSuit(state.play.currentTrick);
    const validCards = validPlaysForFollowSuit(hand, leadSuit);
    return validCards.map((c) => ({ type: "PlayCard", playerId, cardUid: c.uid } satisfies PlayCard));
  }

  // DEAL / SCORING: no moves exposed in core engine
  return [];
}

export function applyMove(state: GameState, move: Move): GameState {
  const valid = getValidMoves(state, move.playerId);
  const isValid = valid.some((m) => {
    if (m.type !== move.type) return false;
    if (m.playerId !== move.playerId) return false;
    if (m.type === "Bid") return (move as Bid).amount === m.amount && (move as Bid).trump === m.trump;
    if (m.type === "PlayCard") return (move as PlayCard).cardUid === m.cardUid;
    return true; // Pass/Double
  });
  if (!isValid) throw new Error("Invalid move");

  if (state.phase === "BIDDING") {
    if (!state.bidding) throw new Error("Missing bidding state");
    const nextBidding = applyBiddingMove(state.players, state.bidding, move as Bid | Pass | Double);

    if (!isBiddingComplete(nextBidding)) {
      return { ...state, bidding: nextBidding };
    }

    const highest = nextBidding.highestBid;
    if (!highest) throw new Error("Bidding completed without a highest bid");

    const leaderId = highest.bidderId;
    const leaderIndex = getPlayerIndex(state.players, leaderId);

    return {
      ...state,
      phase: "PLAY",
      bidding: nextBidding,
      play: {
        trump: highest.trump,
        leaderId,
        turnPlayerIndex: leaderIndex,
        currentTrick: startNewTrick(leaderId),
        completedTricks: []
      },
      score: null
    };
  }

  if (state.phase === "PLAY") {
    if (!state.play) throw new Error("Missing play state");
    if (!state.bidding?.highestBid) throw new Error("Missing contract");

    const playMove = move as PlayCard;
    const playerId = playMove.playerId;

    const hand = state.handsByPlayerId[playerId] ?? [];
    const card = findCardInHand(hand, playMove.cardUid);

    const nextHandsByPlayerId = {
      ...state.handsByPlayerId,
      [playerId]: removeCardFromHand(hand, playMove.cardUid)
    };

    const nextTrick = appendPlay(state.play.currentTrick, { playerId, card });
    const nextTurn = nextTurnIndex(state.players, state.play.turnPlayerIndex);

    // Trick incomplete: just advance turn
    if (nextTrick.plays.length < 4) {
      return {
        ...state,
        handsByPlayerId: nextHandsByPlayerId,
        play: {
          ...state.play,
          currentTrick: nextTrick,
          turnPlayerIndex: nextTurn
        }
      };
    }

    // Resolve trick
    const resolved = resolveTrickWinner(nextTrick.plays, state.play.trump);
    const winnerId = resolved.winnerId;
    const winningTeamId = teamIdFromPlayers(state.players, winnerId);

    const completed: CompletedTrick = {
      leaderId: nextTrick.leaderId,
      plays: nextTrick.plays,
      winnerId,
      winningTeamId
    };

    const nextCompleted = [...state.play.completedTricks, completed];
    const winnerIndex = getPlayerIndex(state.players, winnerId);

    const allHandsEmpty = state.players.every((p) => (nextHandsByPlayerId[p.id]?.length ?? 0) === 0);

    if (!allHandsEmpty) {
      return {
        ...state,
        handsByPlayerId: nextHandsByPlayerId,
        play: {
          ...state.play,
          leaderId: winnerId,
          turnPlayerIndex: winnerIndex,
          currentTrick: startNewTrick(winnerId),
          completedTricks: nextCompleted
        }
      };
    }

    // Scoring
    const contract = state.bidding.highestBid;
    const summary = calculateScoreSummary({
      players: state.players,
      completedTricks: nextCompleted,
      contract: {
        bidderId: contract.bidderId,
        amount: contract.amount,
        multiplier: state.bidding.multiplier,
        trump: contract.trump
      }
    });

    return {
      ...state,
      handsByPlayerId: nextHandsByPlayerId,
      phase: "SCORING",
      play: { ...state.play, currentTrick: nextTrick, completedTricks: nextCompleted, turnPlayerIndex: winnerIndex, leaderId: winnerId },
      score: summary
    };
  }

  throw new Error(`Cannot apply moves in phase ${state.phase}`);
}

