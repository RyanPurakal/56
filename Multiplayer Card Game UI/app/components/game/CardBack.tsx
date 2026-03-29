import { motion } from "motion/react";

interface CardBackProps {
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

const sizeClasses = {
  sm: "w-12 h-16",
  md: "w-16 h-22",
  lg: "w-20 h-28",
};

export function CardBack({ size = "md", animate = true }: CardBackProps) {
  return (
    <motion.div
      className={`${sizeClasses[size]} rounded-2xl shadow-xl relative overflow-hidden`}
      style={{
        background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
      }}
      animate={animate ? { rotateY: [0, 5, 0, -5, 0] } : {}}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "linear-gradient(135deg, var(--brand-orange) 0%, var(--brand-amber) 50%, var(--brand-gold) 100%)",
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Pattern */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          className="opacity-20"
        >
          <pattern
            id="card-pattern"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="10" cy="10" r="1" fill="white" />
          </pattern>
          <rect width="100" height="100" fill="url(#card-pattern)" />
        </svg>
      </div>

      {/* "56" branding in center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-3xl font-black opacity-40"
          style={{
            background:
              "linear-gradient(135deg, var(--brand-orange), var(--brand-gold))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          56
        </span>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-[var(--brand-orange)] opacity-60" />
      <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-[var(--brand-amber)] opacity-60" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-[var(--brand-amber)] opacity-60" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-[var(--brand-gold)] opacity-60" />
    </motion.div>
  );
}