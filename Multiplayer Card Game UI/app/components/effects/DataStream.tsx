// Animated vertical data-stream columns (Matrix-style) used as a background layer on the
// LobbyScreen; generates random characters on mount and cycles them at a fixed interval.
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export function DataStream() {
  const [streams, setStreams] = useState<Array<{ id: number; left: number; duration: number }>>([]);

  useEffect(() => {
    const newStreams = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: 3 + Math.random() * 4,
    }));
    setStreams(newStreams);
  }, []);

  const characters = "01アイウエオカキクケコ";

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {streams.map((stream) => (
        <motion.div
          key={stream.id}
          className="absolute top-0 flex flex-col gap-1 text-xs font-mono"
          style={{
            left: `${stream.left}%`,
          }}
          animate={{
            y: ["-100%", "100vh"],
          }}
          transition={{
            duration: stream.duration,
            repeat: Infinity,
            ease: "linear",
            delay: stream.id * 0.3,
          }}
        >
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.span
              key={i}
              className="text-[var(--brand-green)]"
              animate={{
                opacity: [1, 0.2, 1],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            >
              {characters[Math.floor(Math.random() * characters.length)]}
            </motion.span>
          ))}
        </motion.div>
      ))}
    </div>
  );
}
