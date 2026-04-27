// One of four central table slots that displays a played card (or an empty placeholder) at a fixed
// position; highlights with a glow when its card is the current trick winner.
import { motion, AnimatePresence } from "motion/react";
import { PlayingCard } from "./PlayingCard";
import { Card } from "./types";

interface PlayedCardSlotProps {
  card: Card | null;
  position: "top" | "left" | "right" | "bottom";
  isWinning?: boolean;
  playerName?: string;
}

export function PlayedCardSlot({
  card,
  position,
  isWinning = false,
  playerName,
}: PlayedCardSlotProps) {
  const positionStyles = {
    bottom: { x: 0, y: 60 },
    left: { x: -80, y: 0 },
    top: { x: 0, y: -60 },
    right: { x: 80, y: 0 },
  };

  const offset = positionStyles[position];

  return (
    <div
      className="absolute top-1/2 left-1/2"
      style={{
        transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
      }}
    >
      <AnimatePresence mode="wait">
        {card && (
          <motion.div
            key={`${card.suit}-${card.rank}`}
            initial={{
              opacity: 0,
              scale: 0.5,
              x: position === "left" ? -200 : position === "right" ? 200 : 0,
              y: position === "top" ? -200 : position === "bottom" ? 200 : 0,
              rotate: Math.random() * 20 - 10,
            }}
            animate={{
              opacity: 1,
              scale: isWinning ? 1.1 : 1,
              x: 0,
              y: 0,
              rotate: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              x: position === "left" ? -100 : position === "right" ? 100 : 0,
              y: position === "top" ? -100 : position === "bottom" ? 100 : 0,
            }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 300,
            }}
            className="relative"
          >
            {isWinning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute -inset-2 rounded-2xl bg-[var(--brand-green)]/20 border-2 border-[var(--brand-green)] blur-sm"
              />
            )}
            
            <motion.div
              animate={
                isWinning
                  ? {
                      boxShadow: [
                        "0 0 20px rgba(0, 255, 136, 0.5)",
                        "0 0 40px rgba(0, 255, 136, 0.8)",
                        "0 0 20px rgba(0, 255, 136, 0.5)",
                      ],
                    }
                  : {}
              }
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative"
            >
              <PlayingCard card={card} size="md" isPlayable={false} />
            </motion.div>

            {playerName && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
              >
                <span className="text-xs text-white/60">{playerName}</span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
