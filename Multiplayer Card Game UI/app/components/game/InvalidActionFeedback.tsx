import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

interface InvalidActionFeedbackProps {
  message: string;
  onComplete?: () => void;
}

export function InvalidActionFeedback({
  message,
  onComplete,
}: InvalidActionFeedbackProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            x: [0, -10, 10, -10, 10, 0],
          }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{
            opacity: { duration: 0.2 },
            scale: { duration: 0.2 },
            x: { duration: 0.4, times: [0, 0.2, 0.4, 0.6, 0.8, 1] },
          }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-50"
        >
          <motion.div
            animate={{
              boxShadow: [
                "0 0 20px rgba(255, 107, 53, 0.5)",
                "0 0 30px rgba(255, 107, 53, 0.7)",
                "0 0 20px rgba(255, 107, 53, 0.5)",
              ],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
            }}
            className="bg-red-500/20 backdrop-blur-md border-2 border-red-500 rounded-2xl px-6 py-3"
          >
            <p className="text-red-400 font-medium text-sm">{message}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook for triggering invalid action feedback
export function useInvalidActionFeedback() {
  const [feedback, setFeedback] = useState<string | null>(null);

  const showFeedback = (message: string) => {
    setFeedback(message);
  };

  const clearFeedback = () => {
    setFeedback(null);
  };

  return {
    feedback,
    showFeedback,
    clearFeedback,
  };
}
