// Renders a single playing card face-up with suit icon, rank label, and hover/selection animations;
// exports CardData, Suit, and Rank types used throughout the game layer.
import { motion } from "motion/react";
import { Heart, Diamond, Club, Spade } from "lucide-react";

export type Suit = "hearts" | "diamonds" | "clubs" | "spades";
export type Rank = "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A";

export interface CardData {
  suit: Suit;
  rank: Rank;
  id: string;
}

interface PlayingCardProps {
  card: CardData;
  onClick?: () => void;
  isSelected?: boolean;
  isPlayable?: boolean;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

const suitIcons = {
  hearts: Heart,
  diamonds: Diamond,
  clubs: Club,
  spades: Spade,
};

const suitColors = {
  hearts: "#ef4444",
  diamonds: "#ef4444",
  clubs: "#000000",
  spades: "#000000",
};

export function PlayingCard({
  card,
  onClick,
  isSelected = false,
  isPlayable = true,
  size = "md",
  disabled = false,
}: PlayingCardProps) {
  const SuitIcon = suitIcons[card.suit];
  const suitColor = suitColors[card.suit];

  const sizeClasses = {
    sm: "w-12 h-16",
    md: "w-16 h-22",
    lg: "w-20 h-28",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const iconSizes = {
    sm: 12,
    md: 18,
    lg: 24,
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || !isPlayable}
      whileHover={isPlayable ? { y: -8, scale: 1.05 } : {}}
      whileTap={isPlayable ? { scale: 0.95 } : {}}
      animate={{
        y: isSelected ? -12 : 0,
      }}
      className={`
        ${sizeClasses[size]} 
        rounded-2xl
        bg-white
        shadow-xl
        flex flex-col items-center justify-center
        transition-all duration-200
        ${isPlayable ? "cursor-pointer" : "cursor-not-allowed opacity-50"}
        ${isSelected ? "ring-4 ring-[var(--brand-orange)] shadow-[0_0_30px_rgba(255,107,53,0.5)]" : ""}
        relative overflow-hidden
      `}
    >
      {/* Shimmer effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        animate={{
          x: ["-200%", "200%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
        }}
      />
      
      {/* Simple centered layout - rank on top, suit below */}
      <div className="relative flex flex-col items-center justify-center gap-0 -mt-1">
        <span className={`${textSizes[size]} font-semibold leading-none`} style={{ color: suitColor }}>
          {card.rank}
        </span>
        <SuitIcon size={iconSizes[size]} color={suitColor} fill={suitColor} strokeWidth={2} />
      </div>
    </motion.button>
  );
}