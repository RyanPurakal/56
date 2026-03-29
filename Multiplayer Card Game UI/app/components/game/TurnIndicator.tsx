import { motion, AnimatePresence } from "motion/react";

interface TurnIndicatorProps {
  isYourTurn: boolean;
  currentPlayer?: string;
}

export function TurnIndicator({ isYourTurn, currentPlayer }: TurnIndicatorProps) {
  return (
    <AnimatePresence mode="wait">
      {isYourTurn ? (
        <motion.div
          key="your-turn"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "backOut" }}
          className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50"
        >
          <motion.div
            animate={{
              boxShadow: [
                "0 0 20px rgba(0, 255, 136, 0.3)",
                "0 0 40px rgba(0, 255, 136, 0.6)",
                "0 0 20px rgba(0, 255, 136, 0.3)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="px-6 py-3 bg-[var(--brand-green)]/20 border-2 border-[var(--brand-green)] rounded-full backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-[var(--brand-green)]"
              />
              <span className="text-[var(--brand-green)] font-bold text-lg">
                Your Turn
              </span>
            </div>
          </motion.div>
        </motion.div>
      ) : currentPlayer ? (
        <motion.div
          key="waiting"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="px-4 py-2 bg-white/5 border border-white/20 rounded-full backdrop-blur-md">
            <span className="text-white/60 text-sm">
              Waiting for {currentPlayer}...
            </span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
