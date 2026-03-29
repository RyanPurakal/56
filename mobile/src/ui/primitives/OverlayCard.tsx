import React from "react";
import { View, type ViewProps, type ViewStyle } from "react-native";
import { colors, radius } from "../tokens";

export function OverlayCard(props: ViewProps & { style?: ViewStyle | ViewStyle[] }) {
  return (
    <View
      {...props}
      style={[
        {
          borderRadius: radius.xl,
          borderWidth: 1,
          borderColor: colors.glassStroke,
          backgroundColor: colors.glassBg,
          overflow: "hidden"
        },
        props.style
      ]}
    />
  );
}

