import { motion } from "motion/react";
import { ReactNode } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
}

export function GlassPanel({ children, className = "" }: GlassPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        bg-white/5 
        backdrop-blur-sm 
        border border-white/5 
        rounded-3xl 
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}