// Small label+value badge displayed in the top bar of GameScreen (room code, trump suit, tricks);
// supports a "highlight" variant for important values.
import { motion } from "motion/react";
import { ReactNode } from "react";

interface InfoBadgeProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  variant?: "default" | "highlight";
}

export function InfoBadge({ label, value, icon, variant = "default" }: InfoBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        px-3 py-2 rounded-xl
        backdrop-blur-md
        border
        ${
          variant === "highlight"
            ? "bg-gradient-to-r from-[var(--brand-orange)]/20 to-[var(--brand-amber)]/20 border-[var(--brand-orange)]/40"
            : "bg-white/5 border-white/10"
        }
      `}
    >
      <div className="flex items-center gap-2">
        {icon && <span className="text-white/80">{icon}</span>}
        <div className="flex flex-col">
          <span className="text-xs text-white/60">{label}</span>
          <span className="text-sm font-semibold text-white">{value}</span>
        </div>
      </div>
    </motion.div>
  );
}