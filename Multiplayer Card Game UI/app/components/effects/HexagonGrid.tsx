// Decorative hexagonal grid overlay for the LobbyScreen background; each hex pulses independently
// via Framer Motion to create a living-grid effect.
import { motion } from "motion/react";

export function HexagonGrid() {
  const hexagons = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: (i % 4) * 25,
    y: Math.floor(i / 4) * 30,
    delay: i * 0.5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="hexStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--brand-orange)" />
            <stop offset="100%" stopColor="var(--brand-green)" />
          </linearGradient>
        </defs>
        {hexagons.map((hex) => (
          <motion.polygon
            key={hex.id}
            points="10,0 20,5 20,15 10,20 0,15 0,5"
            transform={`translate(${hex.x}, ${hex.y})`}
            fill="none"
            stroke="url(#hexStroke)"
            strokeWidth="0.2"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: hex.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
    </div>
  );
}
