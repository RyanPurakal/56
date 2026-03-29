import { motion, AnimatePresence } from "motion/react";
import { CardBack } from "./CardBack";

interface CardDealAnimationProps {
  onComplete: () => void;
  playerCount?: number;
}

export function CardDealAnimation({ onComplete, playerCount = 4 }: CardDealAnimationProps) {
  // Each player gets 13 cards, dealt one at a time in rotation
  const totalCards = playerCount * 13;
  const dealDelay = 0.03; // 30ms between each card
  const cardPositions = [
    { x: 0, y: 200 }, // bottom (you)
    { x: -300, y: 0 }, // left
    { x: 0, y: -200 }, // top
    { x: 300, y: 0 }, // right
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <AnimatePresence>
        {Array.from({ length: totalCards }).map((_, index) => {
          const playerIndex = index % playerCount;
          const position = cardPositions[playerIndex];
          const cardNumber = Math.floor(index / playerCount);

          return (
            <motion.div
              key={index}
              initial={{
                x: 0,
                y: 0,
                opacity: 0,
                scale: 0.5,
              }}
              animate={{
                x: position.x,
                y: position.y,
                opacity: [0, 1, 1, 0],
                scale: [0.5, 1, 1, 0.8],
              }}
              transition={{
                delay: index * dealDelay,
                duration: 0.5,
                ease: "easeOut",
              }}
              onAnimationComplete={() => {
                if (index === totalCards - 1) {
                  setTimeout(onComplete, 300);
                }
              }}
              className="absolute"
              style={{
                zIndex: index,
              }}
            >
              <CardBack size="sm" animate={false} />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Deck in center */}
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: [1, 0.95, 1] }}
        transition={{
          duration: 0.5,
          repeat: Math.ceil(totalCards / 4),
          repeatDelay: 0.1,
        }}
        className="relative"
      >
        <div className="w-20 h-28 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] shadow-2xl" />
      </motion.div>
    </div>
  );
}
