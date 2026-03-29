import React from "react";
import { Pressable, Text, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { gameTheme } from "../../theme";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

export function GameButton(props: {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}) {
  const { variant = "primary", size = "md", disabled = false, fullWidth = false, onPress, children, style } = props;

  const pad =
    size === "sm" ? { px: 16, py: 10, fs: 14 } : size === "lg" ? { px: 28, py: 16, fs: 18 } : { px: 22, py: 12, fs: 16 };

  if (variant === "primary") {
    return (
      <Pressable
        onPress={disabled ? undefined : onPress}
        style={({ pressed }) => [
          { borderRadius: 16, overflow: "hidden", opacity: disabled ? 0.35 : 1, transform: [{ scale: pressed && !disabled ? 0.98 : 1 }] },
          fullWidth ? { alignSelf: "stretch" } : null,
          style
        ]}
      >
        <LinearGradient
          colors={[gameTheme.brandOrange, gameTheme.brandAmber]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{
            paddingHorizontal: pad.px,
            paddingVertical: pad.py,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: gameTheme.brandOrange,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.25,
            shadowRadius: 12
          }}
        >
          {typeof children === "string" ? (
            <Text style={{ fontWeight: "700", fontSize: pad.fs, color: "#fff" }}>{children}</Text>
          ) : (
            children
          )}
        </LinearGradient>
      </Pressable>
    );
  }

  if (variant === "secondary") {
    return (
      <Pressable
        onPress={disabled ? undefined : onPress}
        style={({ pressed }) => [
          {
            borderRadius: 16,
            borderWidth: 1,
            borderColor: gameTheme.glassBorder,
            backgroundColor: "rgba(255,255,255,0.1)",
            paddingHorizontal: pad.px,
            paddingVertical: pad.py,
            alignItems: "center",
            justifyContent: "center",
            opacity: disabled ? 0.35 : 1,
            transform: [{ scale: pressed && !disabled ? 0.98 : 1 }]
          },
          fullWidth ? { alignSelf: "stretch" } : null,
          style
        ]}
      >
        {typeof children === "string" ? (
          <Text style={{ fontWeight: "700", fontSize: pad.fs, color: "#fff" }}>{children}</Text>
        ) : (
          children
        )}
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        {
          borderRadius: 16,
          paddingHorizontal: pad.px,
          paddingVertical: pad.py,
          alignItems: "center",
          justifyContent: "center",
          opacity: disabled ? 0.35 : 1,
          backgroundColor: pressed ? "rgba(255,255,255,0.06)" : "transparent"
        },
        fullWidth ? { alignSelf: "stretch" } : null,
        style
      ]}
    >
      {typeof children === "string" ? (
        <Text style={{ fontWeight: "700", fontSize: pad.fs, color: "rgba(255,255,255,0.65)" }}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
