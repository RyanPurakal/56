export const space = {
  0: 0,
  4: 4,
  8: 8,
  12: 12,
  16: 16,
  20: 20,
  24: 24,
  32: 32,
  40: 40,
  48: 48
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24
} as const;

export const colors = {
  // Base (Figma Make — Real-time Multiplayer Card Game UI)
  bg0: "#000000",
  bg1: "#0A0A0A",
  bg2: "#121212",
  bg3: "#1A1A1A",

  // Text
  text: "#FFFFFF",
  textMuted: "rgba(255, 255, 255, 0.60)",
  textFaint: "rgba(255, 255, 255, 0.40)",

  // Lines
  stroke: "rgba(255, 255, 255, 0.10)",
  strokeStrong: "rgba(255, 255, 255, 0.18)",

  // Brand (theme.css game tokens)
  brandOrange: "#FF6B35",
  brandAmber: "#FFA726",
  brandGreen: "#00FF88",
  brandGold: "#FFB74D",

  // Accents (mapped to brand for CTAs)
  primary: "#FF6B35",
  accent: "#FFA726",
  success: "#00FF88",
  danger: "#EF4444",
  warn: "#FFA726",

  // Neon glow
  glowPrimary: "rgba(255, 107, 53, 0.35)",
  glowSuccess: "rgba(0, 255, 136, 0.30)",
  glowDanger: "rgba(239, 68, 68, 0.25)",

  // Glass overlay (Figma GlassPanel)
  glassBg: "rgba(255, 255, 255, 0.05)",
  glassStroke: "rgba(255, 255, 255, 0.10)"
} as const;

export const shadow = {
  soft: {
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 } as const
  },
  glowPrimary: {
    shadowColor: colors.primary,
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 } as const
  }
} as const;

