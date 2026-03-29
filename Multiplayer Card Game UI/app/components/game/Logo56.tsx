import { motion } from "motion/react";

interface Logo56Props {
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
}

export function Logo56({ size = "md", animated = true }: Logo56Props) {
  const sizes = {
    sm: "text-4xl",
    md: "text-6xl",
    lg: "text-8xl",
    xl: "text-9xl",
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Glow effect behind */}
      {animated && (
        <motion.div
          className="absolute inset-0 blur-3xl opacity-50"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-full h-full bg-gradient-to-r from-[var(--brand-orange)] via-[var(--brand-amber)] to-[var(--brand-gold)]" />
        </motion.div>
      )}

      {/* Main logo */}
      <motion.div
        className="relative flex items-center"
        initial={animated ? { opacity: 0, scale: 0.8 } : {}}
        animate={animated ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, ease: "backOut" }}
      >
        {/* Number 5 */}
        <motion.span
          className={`${sizes[size]} font-black tracking-tight`}
          style={{
            background: "linear-gradient(135deg, #ff6b35 0%, #ffa726 50%, #ffb74d 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "0 0 40px rgba(255, 107, 53, 0.3)",
          }}
          animate={
            animated
              ? {
                  textShadow: [
                    "0 0 40px rgba(255, 107, 53, 0.3)",
                    "0 0 60px rgba(255, 167, 38, 0.4)",
                    "0 0 40px rgba(255, 107, 53, 0.3)",
                  ],
                }
              : {}
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          5
        </motion.span>

        {/* Number 6 */}
        <motion.span
          className={`${sizes[size]} font-black tracking-tight`}
          style={{
            background: "linear-gradient(135deg, #ffa726 0%, #ffb74d 50%, #ffc062 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "0 0 40px rgba(255, 167, 38, 0.3)",
          }}
          animate={
            animated
              ? {
                  textShadow: [
                    "0 0 40px rgba(255, 167, 38, 0.3)",
                    "0 0 60px rgba(255, 183, 77, 0.4)",
                    "0 0 40px rgba(255, 167, 38, 0.3)",
                  ],
                }
              : {}
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.1,
          }}
        >
          6
        </motion.span>

        {/* Decorative dots */}
        <div className="absolute -top-2 -right-2 flex gap-1">
          <motion.div
            className="w-2 h-2 rounded-full bg-[var(--brand-orange)]"
            animate={animated ? { scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            className="w-2 h-2 rounded-full bg-[var(--brand-amber)]"
            animate={animated ? { scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] } : {}}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
          />
        </div>
      </motion.div>
    </div>
  );
}
