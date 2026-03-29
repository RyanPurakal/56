import { motion } from "motion/react";
import { User } from "lucide-react";

export interface PlayerData {
  id: string;
  name: string;
  avatar?: string;
  isReady?: boolean;
}

interface PlayerSeatProps {
  player?: PlayerData;
  position: "bottom" | "left" | "top" | "right";
  isActive?: boolean;
  isEmpty?: boolean;
}

export function PlayerSeat({ player, position, isActive = false, isEmpty = false }: PlayerSeatProps) {
  const positionStyles = {
    bottom: "flex-col items-center",
    left: "flex-row items-center",
    top: "flex-col-reverse items-center",
    right: "flex-row-reverse items-center",
  };

  if (isEmpty) {
    return (
      <div className={`flex ${positionStyles[position]} gap-2`}>
        <div className="w-12 h-12 rounded-full bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center">
          <User size={20} className="text-white/30" />
        </div>
        <span className="text-xs text-white/40">Waiting...</span>
      </div>
    );
  }

  return (
    <motion.div
      className={`flex ${positionStyles[position]} gap-2`}
      animate={{
        scale: isActive ? 1.1 : 1,
      }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[var(--brand-orange)] to-[var(--brand-green)] p-0.5"
        animate={{
          boxShadow: isActive
            ? ["0 0 20px rgba(255, 107, 53, 0.5)", "0 0 30px rgba(0, 255, 136, 0.5)", "0 0 20px rgba(255, 107, 53, 0.5)"]
            : "none",
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-full h-full rounded-full bg-[#1a1a1a] flex items-center justify-center text-xl font-bold">
          {player?.name.charAt(0).toUpperCase()}
        </div>

        {isActive && (
          <motion.div
            className="absolute -inset-1 rounded-full bg-[var(--brand-green)] opacity-30"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </motion.div>
      <div className="flex flex-col items-center">
        <span className="text-sm text-white font-medium">{player?.name || "Player"}</span>
        {player?.isReady && (
          <span className="text-xs text-[var(--neon-green)]">Ready</span>
        )}
      </div>
    </motion.div>
  );
}