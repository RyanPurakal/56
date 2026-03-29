import { motion } from "motion/react";

interface FloatingParticlesProps {
  count?: number;
}

export function FloatingParticles({ count = 20 }: FloatingParticlesProps) {
  const particles = Array.from({ length: count }, (_, i) => {
    const rand = Math.random();
    let color;
    if (rand > 0.66) {
      color = "var(--brand-orange)";
    } else if (rand > 0.33) {
      color = "var(--brand-green)";
    } else {
      color = "var(--brand-amber)";
    }
    
    return {
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
      color,
    };
  });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px currentColor`,
          }}
          animate={{
            y: [-20, -40, -20],
            x: [-10, 10, -10],
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}