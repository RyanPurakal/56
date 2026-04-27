// Bidding UI panel: lets the local player choose a bid amount (28–56), trump suit, or pass/double;
// only visible when isVisible=true (i.e. it is this player's turn in the bidding phase).
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Spade, Heart, Diamond, Club } from "lucide-react";
import { GameButton } from "./GameButton";

interface BiddingPanelProps {
  isVisible: boolean;
  currentBid: number;
  onBid: (amount: number, suit?: string) => void;
  onPass: () => void;
  onDouble: () => void;
  canDouble?: boolean;
}

export function BiddingPanel({
  isVisible,
  currentBid,
  onBid,
  onPass,
  onDouble,
  canDouble = false,
}: BiddingPanelProps) {
  const [selectedSuit, setSelectedSuit] = useState<string | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const suits = [
    { name: "spades", icon: Spade, color: "text-white" },
    { name: "hearts", icon: Heart, color: "text-red-500" },
    { name: "diamonds", icon: Diamond, color: "text-red-500" },
    { name: "clubs", icon: Club, color: "text-white" },
  ];

  const bidAmounts = [28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56];
  const validBids = bidAmounts.filter((bid) => bid > currentBid);

  const handleConfirmBid = () => {
    if (selectedAmount && selectedSuit) {
      onBid(selectedAmount, selectedSuit);
      setSelectedAmount(null);
      setSelectedSuit(null);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onPass}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t-2 border-[var(--brand-orange)] p-6 rounded-t-3xl"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--brand-orange)] via-[var(--brand-amber)] to-[var(--brand-green)]"
            />

            <div className="max-w-2xl mx-auto">
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-xl font-bold text-white mb-4 text-center"
              >
                Place Your Bid
              </motion.h3>

              {/* Current highest bid */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-6"
              >
                <span className="text-white/60 text-sm">Current Bid: </span>
                <span className="text-2xl font-bold text-[var(--brand-amber)] ml-2">
                  {currentBid || "None"}
                </span>
              </motion.div>

              {/* Bid amounts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mb-4"
              >
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {validBids.map((amount, index) => (
                    <motion.button
                      key={amount}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.02 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedAmount(amount)}
                      className={`
                        px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all
                        ${
                          selectedAmount === amount
                            ? "bg-[var(--brand-amber)] text-black scale-105"
                            : "bg-white/10 text-white hover:bg-white/20"
                        }
                      `}
                    >
                      {amount}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Trump suits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-4 gap-3 mb-6"
              >
                {suits.map((suit, index) => {
                  const Icon = suit.icon;
                  return (
                    <motion.button
                      key={suit.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.35 + index * 0.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSuit(suit.name)}
                      className={`
                        p-4 rounded-xl border-2 transition-all
                        ${
                          selectedSuit === suit.name
                            ? "bg-[var(--brand-green)]/20 border-[var(--brand-green)] scale-105"
                            : "bg-white/5 border-white/20 hover:border-white/40"
                        }
                      `}
                    >
                      <Icon className={suit.color} size={32} fill="currentColor" />
                    </motion.button>
                  );
                })}
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex gap-3"
              >
                <GameButton
                  variant="ghost"
                  size="lg"
                  fullWidth
                  onClick={onPass}
                >
                  Pass
                </GameButton>

                {canDouble && (
                  <GameButton
                    variant="secondary"
                    size="lg"
                    fullWidth
                    onClick={onDouble}
                  >
                    Double
                  </GameButton>
                )}

                <GameButton
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleConfirmBid}
                  disabled={!selectedAmount || !selectedSuit}
                >
                  Confirm Bid
                </GameButton>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
