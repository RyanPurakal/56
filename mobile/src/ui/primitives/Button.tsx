import React, { useMemo, useRef } from "react";
import { Animated, Easing, Pressable, Text, type ViewStyle } from "react-native";
import { colors, radius, space } from "../tokens";
import { type } from "../type";

export function Button(props: {
  label: string;
  onPress: () => void;
  tone?: "primary" | "neutral" | "danger";
  disabled?: boolean;
  fullWidth?: boolean;
  size?: "sm" | "md";
  style?: ViewStyle | ViewStyle[];
}) {
  const tone = props.tone ?? "neutral";
  const size = props.size ?? "md";
  const pressAnim = useRef(new Animated.Value(0)).current;

  const bg = tone === "primary" ? colors.primary : tone === "danger" ? colors.danger : colors.bg2;
  const border = tone === "primary" ? colors.primary : tone === "danger" ? colors.danger : colors.stroke;
  const textColor = tone === "neutral" ? colors.text : "#FFFFFF";

  const padY = size === "sm" ? 10 : 12;
  const padX = size === "sm" ? 12 : 14;

  const animatedStyle = useMemo(() => {
    const scale = pressAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.985] });
    return { transform: [{ scale }] };
  }, [pressAnim]);

  const disabled = Boolean(props.disabled);

  return (
    <Pressable
      disabled={disabled}
      onPress={props.onPress}
      onPressIn={() => {
        Animated.timing(pressAnim, { toValue: 1, duration: 90, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
      }}
      onPressOut={() => {
        Animated.timing(pressAnim, { toValue: 0, duration: 140, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
      }}
      style={[
        {
          alignSelf: props.fullWidth ? "stretch" : "flex-start",
          opacity: disabled ? 0.55 : 1
        },
        props.style
      ]}
    >
      <Animated.View
        style={[
          {
            borderRadius: radius.lg,
            borderWidth: 1,
            borderColor: border,
            backgroundColor: bg,
            paddingVertical: padY,
            paddingHorizontal: padX,
            alignItems: "center",
            justifyContent: "center"
          },
          animatedStyle
        ]}
      >
        <Text style={[type.body, { color: textColor, fontWeight: "900" }]}>{props.label}</Text>
      </Animated.View>
    </Pressable>
  );
}

