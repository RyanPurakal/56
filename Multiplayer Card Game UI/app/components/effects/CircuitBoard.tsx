import { motion } from "motion/react";

export function CircuitBoard() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
      <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="circuit1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--brand-orange)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--brand-orange)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--brand-orange)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="circuit2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--brand-green)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--brand-green)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--brand-green)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Horizontal lines */}
        <motion.line
          x1="0"
          y1="200"
          x2="1000"
          y2="200"
          stroke="url(#circuit1)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.line
          x1="0"
          y1="400"
          x2="1000"
          y2="400"
          stroke="url(#circuit2)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.line
          x1="0"
          y1="600"
          x2="1000"
          y2="600"
          stroke="url(#circuit1)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.line
          x1="0"
          y1="800"
          x2="1000"
          y2="800"
          stroke="url(#circuit2)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />

        {/* Vertical lines */}
        <motion.line
          x1="300"
          y1="0"
          x2="300"
          y2="1000"
          stroke="url(#circuit1)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
        <motion.line
          x1="700"
          y1="0"
          x2="700"
          y2="1000"
          stroke="url(#circuit2)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
        />

        {/* Circuit nodes */}
        <motion.circle
          cx="300"
          cy="200"
          r="4"
          fill="var(--brand-orange)"
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx="700"
          cy="400"
          r="4"
          fill="var(--brand-green)"
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.circle
          cx="300"
          cy="600"
          r="4"
          fill="var(--brand-orange)"
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.circle
          cx="700"
          cy="800"
          r="4"
          fill="var(--brand-green)"
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
      </svg>
    </div>
  );
}
