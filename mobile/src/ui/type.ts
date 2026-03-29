import type { FontVariant } from "react-native";
import { colors } from "./tokens";

export const type = {
  title: {
    fontSize: 28,
    fontWeight: "900" as const,
    letterSpacing: -0.4,
    color: colors.text
  },
  h1: {
    fontSize: 22,
    fontWeight: "900" as const,
    letterSpacing: -0.2,
    color: colors.text
  },
  h2: {
    fontSize: 18,
    fontWeight: "800" as const,
    letterSpacing: -0.1,
    color: colors.text
  },
  body: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: colors.text
  },
  small: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: colors.textMuted
  },
  mono: {
    fontSize: 12,
    fontWeight: "700" as const,
    fontVariant: ["tabular-nums"] as FontVariant[],
    color: colors.textMuted
  }
};

