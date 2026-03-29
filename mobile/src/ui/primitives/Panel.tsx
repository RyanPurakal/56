import React from "react";
import { View, type ViewProps, type ViewStyle } from "react-native";
import { colors, radius, shadow, space } from "../tokens";

export function Panel(
  props: ViewProps & {
    variant?: "solid" | "glass";
    pad?: keyof typeof space;
    style?: ViewStyle | ViewStyle[];
  }
) {
  const variant = props.variant ?? "solid";
  const pad = props.pad ?? 16;

  const base: ViewStyle = {
    borderRadius: radius.lg,
    padding: space[pad],
    borderWidth: 1,
    borderColor: variant === "glass" ? colors.glassStroke : colors.stroke,
    backgroundColor: variant === "glass" ? colors.glassBg : colors.bg2,
    ...shadow.soft
  };

  return <View {...props} style={[base, props.style]} />;
}

