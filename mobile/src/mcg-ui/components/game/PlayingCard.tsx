import React, { useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import type { Card as CardT, Suit } from "../../../../../shared/src/index.js";
import { gameTheme } from "../../theme";

const SUIT_SYMBOL: Record<Suit, string> = { S: "♠", H: "♥", D: "♦", C: "♣" };
const SUIT_COLOR: Record<Suit, string> = {
  S: "#111",
  H: "#ef4444",
  D: "#ef4444",
  C: "#111"
};

export function PlayingCard(props: {
  card: CardT;
  onPress?: () => void;
  isSelected?: boolean;
  isPlayable?: boolean;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}) {
  const { card, onPress, isSelected = false, isPlayable = true, size = "md", disabled = false } = props;
  const press = useRef(new Animated.Value(0)).current;
  const suitColor = SUIT_COLOR[card.suit];
  const sym = SUIT_SYMBOL[card.suit];

  const dim = size === "sm" ? { w: 44, h: 62, rank: 16, suit: 22 } : size === "lg" ? { w: 72, h: 100, rank: 26, suit: 30 } : { w: 58, h: 80, rank: 22, suit: 26 };

  const translateY = press.interpolate({
    inputRange: [0, 1],
    outputRange: [isSelected ? -12 : 0, isSelected ? -20 : -8]
  });

  return (
    <Pressable
      disabled={disabled || !isPlayable}
      onPress={onPress}
      onPressIn={() => Animated.spring(press, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 5 }).start()}
      onPressOut={() => Animated.spring(press, { toValue: 0, useNativeDriver: true, speed: 20, bounciness: 5 }).start()}
    >
      <Animated.View
        style={{
          width: dim.w,
          height: dim.h,
          borderRadius: 14,
          backgroundColor: "#fff",
          alignItems: "center",
          justifyContent: "center",
          opacity: isPlayable ? 1 : 0.45,
          transform: [{ translateY }],
          borderWidth: isSelected ? 4 : 0,
          borderColor: gameTheme.brandOrange,
          shadowColor: isSelected ? gameTheme.brandOrange : "#000",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: isSelected ? 0.45 : 0.2,
          shadowRadius: isSelected ? 14 : 8,
          elevation: 6
        }}
      >
        <View style={{ alignItems: "center", marginTop: -4 }}>
          <Text style={{ fontSize: dim.rank, fontWeight: "700", color: suitColor }}>{card.rank}</Text>
          <Text style={{ fontSize: dim.suit, color: suitColor, marginTop: -6 }}>{sym}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}
