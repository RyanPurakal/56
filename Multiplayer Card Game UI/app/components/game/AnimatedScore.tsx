// Animates a numeric score from 0 to its target value on mount using Framer Motion's animate;
// used on the ResultScreen to give scores a counting-up effect.
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect } from "react";

interface AnimatedScoreProps {
  value: number;
  duration?: number;
  delay?: number;
  className?: string;
}

export function AnimatedScore({
  value,
  duration = 1,
  delay = 0,
  className = "",
}: AnimatedScoreProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, value, {
      duration,
      delay,
      ease: "easeOut",
    });

    return controls.stop;
  }, [count, value, duration, delay]);

  return <motion.span className={className}>{rounded}</motion.span>;
}
