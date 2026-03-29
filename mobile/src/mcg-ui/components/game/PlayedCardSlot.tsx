import React, { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import type { Card as CardT } from "../../../../../shared/src/index.js";
import { gameTheme } from "../../theme";
import { PlayingCard } from "./PlayingCard";

export function PlayedCardSlot(props: {
  card: CardT | null;
  position: "top" | "left" | "right" | "bottom";
  isWinning?: boolean;
  playerName?: string;
}) {
  const { card, position, isWinning = false, playerName } = props;
  const entry = useRef(new Animated.Value(card ? 1 : 0)).current;

  useEffect(() => {
    if (card) {
      entry.setValue(0);
      Animated.spring(entry, { toValue: 1, useNativeDriver: true, speed: 18, bounciness: 5 }).start();
    } else {
      entry.setValue(0);
    }
  }, [card?.uid, entry, card]);

  const offset =
    position === "bottom"
      ? { tx: 0, ty: 52 }
      : position === "left"
        ? { tx: -68, ty: 0 }
        : position === "top"
          ? { tx: 0, ty: -52 }
          : { tx: 68, ty: 0 };

  const scale = entry.interpolate({ inputRange: [0, 1], outputRange: [0.65, isWinning ? 1.08 : 1] });
  const opacity = entry;

  if (!card) return null;

  return (
    <View
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        marginLeft: -29,
        marginTop: -40,
        transform: [{ translateX: offset.tx }, { translateY: offset.ty }]
      }}
    >
      <Animated.View style={{ opacity, transform: [{ scale }] }}>
        {isWinning ? (
          <View
            style={{
              position: "absolute",
              left: -8,
              right: -8,
              top: -8,
              bottom: -8,
              borderRadius: 18,
              borderWidth: 2,
              borderColor: `${gameTheme.brandGreen}88`,
              backgroundColor: "rgba(0,255,136,0.12)"
            }}
          />
        ) : null}
        <PlayingCard card={card} size="md" isPlayable={false} />
        {playerName ? (
          <Text style={{ marginTop: 6, textAlign: "center", fontSize: 11, color: gameTheme.textFaint }} numberOfLines={1}>
            {playerName}
          </Text>
        ) : null}
      </Animated.View>
    </View>
  );
}
