import { motion } from "motion/react";
import { ReactNode } from "react";

interface GameButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  fullWidth?: boolean;
}

export function GameButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  fullWidth = false,
}: GameButtonProps) {
  const variants = {
    primary:
      "bg-gradient-to-r from-[var(--brand-orange)] to-[var(--brand-amber)] text-white shadow-lg shadow-[var(--brand-orange)]/20",
    secondary:
      "bg-white/10 backdrop-blur-sm border border-white/10 text-white hover:bg-white/15",
    ghost: "bg-transparent text-white/60 hover:text-white hover:bg-white/5",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        rounded-2xl
        font-semibold
        transition-all duration-200
        disabled:opacity-30 disabled:cursor-not-allowed
      `}
    >
      {children}
    </motion.button>
  );
}