// Animated "56" logotype with glitch and glow effects for the LobbyScreen hero; purely decorative.
import { motion } from "motion/react";

export function CyberLogo56() {
  return (
    <div className="relative inline-block">
      {/* Outer glow rings */}
      <motion.div
        className="absolute inset-0 -m-8"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <svg className="w-full h-full" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="url(#orangeGradient)"
            strokeWidth="0.5"
            opacity="0.3"
            strokeDasharray="5 10"
          />
          <defs>
            <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--brand-orange)" />
              <stop offset="100%" stopColor="var(--brand-amber)" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      <motion.div
        className="absolute inset-0 -m-6"
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <svg className="w-full h-full" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="var(--brand-green)"
            strokeWidth="0.5"
            opacity="0.2"
            strokeDasharray="3 15"
          />
        </svg>
      </motion.div>

      {/* Main logo container */}
      <div className="relative">
        {/* Background hexagon */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg width="180" height="180" viewBox="0 0 180 180">
            <defs>
              <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--brand-orange)" stopOpacity="0.1" />
                <stop offset="50%" stopColor="var(--brand-green)" stopOpacity="0.05" />
                <stop offset="100%" stopColor="var(--brand-amber)" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <polygon
              points="90,20 155,57.5 155,122.5 90,160 25,122.5 25,57.5"
              fill="url(#hexGradient)"
              stroke="url(#orangeGradient)"
              strokeWidth="1"
              opacity="0.6"
            />
          </svg>
        </motion.div>

        {/* Glitch effect layers */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Main 56 text */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{
              textShadow: [
                "0 0 20px var(--brand-orange), 0 0 40px var(--brand-orange)",
                "0 0 30px var(--brand-green), 0 0 60px var(--brand-green)",
                "0 0 20px var(--brand-orange), 0 0 40px var(--brand-orange)",
              ],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span
              className="text-8xl font-black tracking-tighter"
              style={{
                background: "linear-gradient(135deg, var(--brand-orange) 0%, var(--brand-green) 50%, var(--brand-amber) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              56
            </span>
          </motion.div>

          {/* Glitch layer 1 - Red channel */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center opacity-70"
            animate={{
              x: [-2, 2, -2],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: 0.2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          >
            <span
              className="text-8xl font-black tracking-tighter text-[var(--brand-orange)]"
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              56
            </span>
          </motion.div>

          {/* Glitch layer 2 - Green channel */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center opacity-70"
            animate={{
              x: [2, -2, 2],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: 0.2,
              repeat: Infinity,
              repeatDelay: 3,
              delay: 0.1,
            }}
          >
            <span
              className="text-8xl font-black tracking-tighter text-[var(--brand-green)]"
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              56
            </span>
          </motion.div>

          {/* Corner brackets */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 180 180">
            <motion.g
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Top-left bracket */}
              <path
                d="M 30 30 L 30 50 M 30 30 L 50 30"
                stroke="var(--brand-orange)"
                strokeWidth="2"
                fill="none"
              />
              {/* Top-right bracket */}
              <path
                d="M 150 30 L 150 50 M 150 30 L 130 30"
                stroke="var(--brand-orange)"
                strokeWidth="2"
                fill="none"
              />
              {/* Bottom-left bracket */}
              <path
                d="M 30 150 L 30 130 M 30 150 L 50 150"
                stroke="var(--brand-green)"
                strokeWidth="2"
                fill="none"
              />
              {/* Bottom-right bracket */}
              <path
                d="M 150 150 L 150 130 M 150 150 L 130 150"
                stroke="var(--brand-green)"
                strokeWidth="2"
                fill="none"
              />
            </motion.g>
          </svg>

          {/* Scanning line */}
          <motion.div
            className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--brand-orange)] to-transparent"
            animate={{
              top: ["0%", "100%"],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 1,
            }}
          />
        </div>

        {/* Bottom data readout */}
        <motion.div
          className="absolute -bottom-8 left-0 right-0 text-center"
          animate={{
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="text-[var(--brand-green)] text-xs font-mono tracking-widest">
            [SYSTEM: ACTIVE]
          </div>
        </motion.div>
      </div>
    </div>
  );
}
