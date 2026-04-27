// Full-screen overlay shown while the WebSocket connection is being re-established; blocks all
// interaction until isVisible becomes false (controlled by GameScreen).
import { motion, AnimatePresence } from "motion/react";
import { Wifi, WifiOff } from "lucide-react";

interface ReconnectingOverlayProps {
  isVisible: boolean;
  isReconnecting?: boolean;
}

export function ReconnectingOverlay({
  isVisible,
  isReconnecting = true,
}: ReconnectingOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="bg-black/90 border-2 border-[var(--brand-orange)] rounded-3xl p-8 max-w-sm mx-4"
          >
            <div className="text-center">
              {isReconnecting ? (
                <>
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="inline-block mb-4"
                  >
                    <Wifi size={48} className="text-[var(--brand-amber)]" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Reconnecting...
                  </h3>
                  <p className="text-white/60">
                    Getting you back to the game
                  </p>

                  {/* Animated progress bar */}
                  <div className="mt-6 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      animate={{
                        x: ["-100%", "100%"],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="h-full w-1/3 bg-gradient-to-r from-transparent via-[var(--brand-amber)] to-transparent"
                    />
                  </div>
                </>
              ) : (
                <>
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                    className="mb-4"
                  >
                    <WifiOff size={48} className="text-red-500 mx-auto" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Connection Lost
                  </h3>
                  <p className="text-white/60">
                    Attempting to reconnect...
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
