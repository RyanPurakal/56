// Wraps a screen's content in a Framer Motion fade+slide transition; apply around any screen
// component to get consistent route-change animations.
import { motion } from "motion/react";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  type?: "fade" | "slide" | "scale";
}

export function PageTransition({ children, type = "fade" }: PageTransitionProps) {
  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.3 },
    },
    slide: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 },
      transition: { duration: 0.4, ease: "easeInOut" },
    },
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.05 },
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const config = variants[type];

  return (
    <motion.div
      initial={config.initial}
      animate={config.animate}
      exit={config.exit}
      transition={config.transition}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}
