import { motion, AnimatePresence } from "motion/react";
import { Spade, Heart, Diamond, Club } from "lucide-react";

interface BidDisplayProps {
  playerName: string;
  bidAmount: number;
  trumpSuit: string;
  position: "top" | "left" | "right" | "bottom";
}

export function BidDisplay({ playerName, bidAmount, trumpSuit, position }: BidDisplayProps) {
  const suitIcons = {
    spades: { icon: Spade, color: "text-white" },
    hearts: { icon: Heart, color: "text-red-500" },
    diamonds: { icon: Diamond, color: "text-red-500" },
    clubs: { icon: Club, color: "text-white" },
  };

  const suit = suitIcons[trumpSuit as keyof typeof suitIcons];
  const Icon = suit?.icon;

  const positionClasses = {
    top: "top-20 left-1/2 -translate-x-1/2",
    left: "left-20 top-1/2 -translate-y-1/2",
    right: "right-20 top-1/2 -translate-y-1/2",
    bottom: "bottom-20 left-1/2 -translate-x-1/2",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{
          type: "spring",
          damping: 15,
          stiffness: 300,
        }}
        className={`fixed ${positionClasses[position]} z-30`}
      >
        <motion.div
          animate={{
            boxShadow: [
              "0 0 20px rgba(255, 167, 38, 0.3)",
              "0 0 30px rgba(255, 167, 38, 0.5)",
              "0 0 20px rgba(255, 167, 38, 0.3)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="bg-black/90 backdrop-blur-md border-2 border-[var(--brand-amber)] rounded-2xl p-3 px-5"
        >
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className="text-xs text-white/60 mb-0.5">{playerName}</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-[var(--brand-amber)]">
                  {bidAmount}
                </span>
                {Icon && (
                  <Icon className={suit.color} size={24} fill="currentColor" />
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
