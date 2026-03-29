import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Crown, Trophy } from "lucide-react";
import { PlayingCard, CardData, Suit } from "../components/game/PlayingCard";
import { PlayerSeat } from "../components/game/PlayerSeat";
import { GameButton } from "../components/game/GameButton";
import { InfoBadge } from "../components/game/InfoBadge";
import { CardDealAnimation } from "../components/game/CardDealAnimation";
import { TurnIndicator } from "../components/game/TurnIndicator";
import { BiddingPanel } from "../components/game/BiddingPanel";
import { BidDisplay } from "../components/game/BidDisplay";
import { PlayedCardSlot } from "../components/game/PlayedCardSlot";
import { ReconnectingOverlay } from "../components/game/ReconnectingOverlay";
import {
  InvalidActionFeedback,
  useInvalidActionFeedback,
} from "../components/game/InvalidActionFeedback";

// Mock game data
const mockHand: CardData[] = [
  { suit: "hearts", rank: "A", id: "h-a" },
  { suit: "hearts", rank: "K", id: "h-k" },
  { suit: "diamonds", rank: "Q", id: "d-q" },
  { suit: "clubs", rank: "10", id: "c-10" },
  { suit: "spades", rank: "9", id: "s-9" },
  { suit: "hearts", rank: "7", id: "h-7" },
  { suit: "diamonds", rank: "8", id: "d-8" },
  { suit: "clubs", rank: "J", id: "c-j" },
  { suit: "spades", rank: "A", id: "s-a" },
  { suit: "spades", rank: "K", id: "s-k" },
  { suit: "diamonds", rank: "A", id: "d-a" },
  { suit: "clubs", rank: "A", id: "c-a" },
  { suit: "hearts", rank: "10", id: "h-10" },
];

const players = [
  { id: "1", name: "You" },
  { id: "2", name: "Alex" },
  { id: "3", name: "Maria" },
  { id: "4", name: "John" },
];

type GamePhase =
  | "dealing"
  | "bidding"
  | "playing"
  | "trick-complete"
  | "collecting-trick";

export function GameScreen() {
  const navigate = useNavigate();
  const { roomCode } = useParams();
  const { feedback, showFeedback, clearFeedback } = useInvalidActionFeedback();

  const [phase, setPhase] = useState<GamePhase>("dealing");
  const [hand, setHand] = useState<CardData[]>([]);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [playedCards, setPlayedCards] = useState<(CardData | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [leadSuit, setLeadSuit] = useState<Suit | null>(null);
  const [currentBid, setCurrentBid] = useState<number>(0);
  const [trumpSuit, setTrumpSuit] = useState<Suit>("hearts");
  const [winningBidder, setWinningBidder] = useState<number | null>(null);
  const [teamScore, setTeamScore] = useState({ us: 0, them: 0 });
  const [tricksWon, setTricksWon] = useState({ us: 0, them: 0 });
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [winningCardIndex, setWinningCardIndex] = useState<number | null>(null);

  // Phase: Dealing
  useEffect(() => {
    if (phase === "dealing") {
      // Cards will be dealt via animation
    }
  }, [phase]);

  const handleDealComplete = () => {
    setHand(mockHand);
    setPhase("bidding");
    setCurrentTurn(0);
  };

  // Phase: Bidding
  const handleBid = (amount: number, suit?: string) => {
    setCurrentBid(amount);
    if (suit) {
      setTrumpSuit(suit as Suit);
    }
    setWinningBidder(currentTurn);

    // Move to next player
    const nextTurn = (currentTurn + 1) % 4;
    setCurrentTurn(nextTurn);

    // Simulate AI passing after 2 more rounds
    if (nextTurn === 0) {
      setTimeout(() => {
        setPhase("playing");
        setCurrentTurn(winningBidder || 0);
        setLeadSuit(null);
      }, 1000);
    }
  };

  const handlePass = () => {
    const nextTurn = (currentTurn + 1) % 4;
    setCurrentTurn(nextTurn);

    // If everyone passed, first player must bid
    if (nextTurn === 0 && currentBid === 0) {
      showFeedback("You must make the opening bid");
      return;
    }
  };

  const handleDouble = () => {
    // Handle doubling logic
    setPhase("playing");
    setCurrentTurn(winningBidder || 0);
  };

  // Phase: Playing
  const handleCardClick = (card: CardData) => {
    if (phase !== "playing") {
      showFeedback("Wait for the bidding to complete");
      return;
    }

    if (currentTurn !== 0) {
      showFeedback("It's not your turn");
      return;
    }

    // Validate play
    if (leadSuit && card.suit !== leadSuit) {
      const hasLeadSuit = hand.some((c) => c.suit === leadSuit);
      if (hasLeadSuit) {
        showFeedback(`You must follow suit: ${leadSuit}`);
        return;
      }
    }

    setSelectedCard(card.id);
  };

  const handlePlayCard = () => {
    if (!selectedCard || currentTurn !== 0) return;

    const card = hand.find((c) => c.id === selectedCard);
    if (!card) return;

    // Play the card
    const newPlayedCards = [...playedCards];
    newPlayedCards[0] = card;
    setPlayedCards(newPlayedCards);

    // Set lead suit if first card
    if (!leadSuit) {
      setLeadSuit(card.suit);
    }

    // Remove from hand
    setHand(hand.filter((c) => c.id !== selectedCard));
    setSelectedCard(null);

    // Move to next player
    const nextTurn = (currentTurn + 1) % 4;
    setCurrentTurn(nextTurn);

    // Simulate AI plays
    simulateAIPlay(nextTurn, newPlayedCards);
  };

  const simulateAIPlay = (turn: number, currentPlayed: (CardData | null)[]) => {
    if (turn === 0 || currentPlayed.every((c) => c !== null)) return;

    setTimeout(() => {
      // Simulate AI playing a card
      const mockCard: CardData = {
        suit: leadSuit || "hearts",
        rank: ["9", "10", "J", "Q", "K", "A"][Math.floor(Math.random() * 6)],
        id: `ai-${turn}-${Date.now()}`,
      };

      const newPlayedCards = [...currentPlayed];
      newPlayedCards[turn] = mockCard;
      setPlayedCards(newPlayedCards);

      if (!leadSuit && turn === 1) {
        setLeadSuit(mockCard.suit);
      }

      // Check if trick is complete
      if (newPlayedCards.every((c) => c !== null)) {
        // Determine winner
        const winner = determineWinner(newPlayedCards as CardData[]);
        setWinningCardIndex(winner);
        setPhase("trick-complete");

        setTimeout(() => {
          collectTrick(winner);
        }, 2000);
      } else {
        const nextTurn = (turn + 1) % 4;
        setCurrentTurn(nextTurn);
        if (nextTurn !== 0) {
          simulateAIPlay(nextTurn, newPlayedCards);
        }
      }
    }, 1000);
  };

  const determineWinner = (cards: CardData[]): number => {
    // Simple winner determination (trump > lead suit > other)
    let winningIndex = 0;
    let winningCard = cards[0];

    for (let i = 1; i < cards.length; i++) {
      const card = cards[i];
      if (card.suit === trumpSuit && winningCard.suit !== trumpSuit) {
        winningIndex = i;
        winningCard = card;
      } else if (
        card.suit === leadSuit &&
        winningCard.suit !== trumpSuit &&
        card.rank > winningCard.rank
      ) {
        winningIndex = i;
        winningCard = card;
      }
    }

    return winningIndex;
  };

  const collectTrick = (winner: number) => {
    setPhase("collecting-trick");

    // Animate cards to winner
    setTimeout(() => {
      // Update tricks won
      const team = winner % 2 === 0 ? "us" : "them";
      setTricksWon((prev) => ({ ...prev, [team]: prev[team] + 1 }));

      // Clear table
      setPlayedCards([null, null, null, null]);
      setWinningCardIndex(null);
      setLeadSuit(null);

      // Check if hand is complete
      if (hand.length === 0) {
        // Navigate to results
        setTimeout(() => {
          navigate(`/result/${roomCode}`);
        }, 1000);
      } else {
        // Start next trick
        setPhase("playing");
        setCurrentTurn(winner);

        if (winner !== 0) {
          simulateAIPlay(winner, [null, null, null, null]);
        }
      }
    }, 1500);
  };

  // Simulate reconnection
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReconnecting(true);
      setTimeout(() => setIsReconnecting(false), 2000);
    }, 30000); // Test after 30s

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden dark">
      {/* Reconnecting overlay */}
      <ReconnectingOverlay isVisible={isReconnecting} />

      {/* Invalid action feedback */}
      {feedback && (
        <InvalidActionFeedback message={feedback} onComplete={clearFeedback} />
      )}

      {/* Dealing animation */}
      <AnimatePresence>
        {phase === "dealing" && (
          <CardDealAnimation onComplete={handleDealComplete} />
        )}
      </AnimatePresence>

      {/* Subtle background animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, var(--brand-green) 0%, transparent 70%)",
            opacity: 0.05,
          }}
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Top info bar */}
      <div className="absolute top-4 left-0 right-0 flex justify-between items-center px-4 z-20">
        <div className="flex gap-2">
          <InfoBadge
            label="Room"
            value={roomCode}
            variant="default"
          />
          <InfoBadge
            label="Trump"
            value={trumpSuit}
            variant="highlight"
          />
        </div>
        <div className="flex gap-2">
          <InfoBadge
            label="Your Team"
            value={`${tricksWon.us} tricks`}
            icon={<Trophy size={16} />}
            variant="highlight"
          />
          <InfoBadge
            label="Opponents"
            value={`${tricksWon.them} tricks`}
          />
        </div>
      </div>

      {/* Bid display */}
      {winningBidder !== null && phase !== "dealing" && (
        <BidDisplay
          playerName={players[winningBidder].name}
          bidAmount={currentBid}
          trumpSuit={trumpSuit}
          position="top"
        />
      )}

      {/* Turn indicator */}
      {phase === "playing" && (
        <TurnIndicator
          isYourTurn={currentTurn === 0}
          currentPlayer={currentTurn !== 0 ? players[currentTurn].name : undefined}
        />
      )}

      {/* Game table */}
      <div className="relative w-full max-w-4xl h-[600px]">
        {/* Player seats */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          <PlayerSeat
            player={{ id: "3", name: players[2].name, isReady: true }}
            position="top"
            isActive={currentTurn === 2}
            cardCount={13 - (playedCards[2] ? 1 : 0)}
          />
        </div>
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <PlayerSeat
            player={{ id: "2", name: players[1].name, isReady: true }}
            position="left"
            isActive={currentTurn === 1}
            cardCount={13 - (playedCards[1] ? 1 : 0)}
          />
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <PlayerSeat
            player={{ id: "4", name: players[3].name, isReady: true }}
            position="right"
            isActive={currentTurn === 3}
            cardCount={13 - (playedCards[3] ? 1 : 0)}
          />
        </div>

        {/* Center table - played cards */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--brand-orange)]/5 to-[var(--brand-green)]/5 border border-white/10" />

          {/* Played card slots */}
          <PlayedCardSlot
            card={playedCards[0]}
            position="bottom"
            isWinning={winningCardIndex === 0}
          />
          <PlayedCardSlot
            card={playedCards[1]}
            position="left"
            isWinning={winningCardIndex === 1}
          />
          <PlayedCardSlot
            card={playedCards[2]}
            position="top"
            isWinning={winningCardIndex === 2}
          />
          <PlayedCardSlot
            card={playedCards[3]}
            position="right"
            isWinning={winningCardIndex === 3}
          />
        </div>

        {/* Your hand */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: phase === "dealing" ? 3 : 0, duration: 0.5 }}
            className="flex gap-2"
          >
            {hand.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <PlayingCard
                  card={card}
                  size="md"
                  isPlayable={phase === "playing" && currentTurn === 0}
                  isSelected={selectedCard === card.id}
                  onClick={() => handleCardClick(card)}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Play card button */}
          <AnimatePresence>
            {selectedCard && currentTurn === 0 && phase === "playing" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-4 flex justify-center"
              >
                <GameButton
                  variant="primary"
                  size="lg"
                  onClick={handlePlayCard}
                >
                  Play Card
                </GameButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bidding panel */}
      <BiddingPanel
        isVisible={phase === "bidding" && currentTurn === 0}
        currentBid={currentBid}
        onBid={handleBid}
        onPass={handlePass}
        onDouble={handleDouble}
        canDouble={currentBid > 0 && winningBidder !== 0}
      />
    </div>
  );
}
