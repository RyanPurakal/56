/** Mirrors `Multiplayer Card Game UI/styles/theme.css` game tokens. */
export const gameTheme = {
  gameBgDark: "#000000",
  brandOrange: "#ff6b35",
  brandAmber: "#ffa726",
  brandGold: "#ffb74d",
  brandGreen: "#00ff88",
  brandTeal: "#00d4a1",
  brandLime: "#4ade80",
  glassBg: "rgba(255, 255, 255, 0.05)",
  glassBorder: "rgba(255, 255, 255, 0.1)",
  textMuted: "rgba(255, 255, 255, 0.6)",
  textFaint: "rgba(255, 255, 255, 0.4)",
  neonGreen: "#00ff88"
} as const;

export type GameTheme = typeof gameTheme;
