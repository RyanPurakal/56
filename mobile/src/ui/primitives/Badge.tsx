import React from "react";
import { Text, View, type ViewStyle } from "react-native";
import { colors, radius, space } from "../tokens";
import { type } from "../type";

export function Badge(props: {
  label: string;
  tone?: "neutral" | "primary" | "success" | "danger" | "warn";
  style?: ViewStyle | ViewStyle[];
}) {
  const tone = props.tone ?? "neutral";
  const palette =
    tone === "primary"
      ? { bg: "rgba(79, 142, 247, 0.16)", stroke: "rgba(79, 142, 247, 0.35)", text: colors.text }
      : tone === "success"
        ? { bg: "rgba(139, 255, 176, 0.12)", stroke: "rgba(139, 255, 176, 0.30)", text: colors.text }
        : tone === "danger"
          ? { bg: "rgba(255, 107, 107, 0.12)", stroke: "rgba(255, 107, 107, 0.30)", text: colors.text }
          : tone === "warn"
            ? { bg: "rgba(255, 201, 107, 0.12)", stroke: "rgba(255, 201, 107, 0.30)", text: colors.text }
            : { bg: "rgba(234, 241, 255, 0.08)", stroke: colors.stroke, text: colors.textMuted };

  return (
    <View
      style={[
        {
          paddingHorizontal: space[8],
          paddingVertical: space[4],
          borderRadius: radius.xl,
          borderWidth: 1,
          borderColor: palette.stroke,
          backgroundColor: palette.bg
        },
        props.style
      ]}
    >
      <Text style={[type.small, { color: palette.text, fontWeight: "800" }]}>{props.label}</Text>
    </View>
  );
}

