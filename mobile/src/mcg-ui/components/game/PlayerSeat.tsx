import React, { useEffect, useRef } from "react";
import { Animated, Easing, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { gameTheme } from "../../theme";

export interface PlayerData {
  id: string;
  name: string;
  avatar?: string;
  isReady?: boolean;
}

export function PlayerSeat(props: {
  player?: PlayerData;
  position: "bottom" | "left" | "top" | "right";
  isActive?: boolean;
  isEmpty?: boolean;
  cardCount?: number;
  /** Contract winner / declarer highlight (Figma crown affordance). */
  isDeclarer?: boolean;
}) {
  const { player, position, isActive = false, isEmpty = false, cardCount, isDeclarer = false } = props;
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!isActive) {
      pulse.setValue(0);
      return;
    }
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1000, easing: Easing.inOut(Easing.quad), useNativeDriver: true })
      ])
    ).start();
  }, [isActive, pulse]);

  const avatarBlock = (
    <View style={{ alignItems: "center" }}>
      {isDeclarer ? (
        <Text style={{ fontSize: 14, marginBottom: 2 }}>👑</Text>
      ) : null}
      {typeof cardCount === "number" && cardCount >= 0 ? (
        <Text style={{ fontSize: 10, color: gameTheme.textFaint, marginBottom: 4, fontWeight: "800" }}>{cardCount}</Text>
      ) : null}
      <View>
        <LinearGradient
          colors={[gameTheme.brandOrange, gameTheme.brandGreen]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ width: 52, height: 52, borderRadius: 26, padding: 2 }}
        >
          <View
            style={{
              flex: 1,
              borderRadius: 24,
              backgroundColor: "#1a1a1a",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "900", color: "#fff" }}>
              {(player?.name ?? "?").charAt(0).toUpperCase()}
            </Text>
          </View>
        </LinearGradient>
        {isActive ? (
          <Animated.View
            pointerEvents="none"
            style={{
              position: "absolute",
              left: -3,
              top: -3,
              width: 58,
              height: 58,
              borderRadius: 29,
              borderWidth: 2,
              borderColor: gameTheme.brandGreen,
              opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.55] }),
              transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] }) }]
            }}
          />
        ) : null}
      </View>
    </View>
  );

  const labelBlock = (
    <View style={{ alignItems: "center", maxWidth: 110 }}>
      <Text style={{ fontSize: 14, fontWeight: "600", color: "#fff" }} numberOfLines={1}>
        {player?.name ?? "Player"}
      </Text>
      {player?.isReady ? (
        <Text style={{ fontSize: 11, color: gameTheme.neonGreen, fontWeight: "700" }}>Ready</Text>
      ) : null}
    </View>
  );

  if (isEmpty) {
    return (
      <View style={{ alignItems: "center", gap: 8 }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            borderWidth: 2,
            borderStyle: "dashed",
            borderColor: "rgba(255,255,255,0.2)",
            backgroundColor: "rgba(255,255,255,0.05)",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Text style={{ color: "rgba(255,255,255,0.35)", fontSize: 16 }}>◇</Text>
        </View>
        <Text style={{ fontSize: 11, color: gameTheme.textFaint }}>Waiting...</Text>
      </View>
    );
  }

  const scale = isActive ? pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] }) : 1;

  if (position === "bottom") {
    return (
      <Animated.View style={{ alignItems: "center", gap: 8, transform: [{ scale }] }}>
        {avatarBlock}
        {labelBlock}
      </Animated.View>
    );
  }
  if (position === "top") {
    return (
      <Animated.View style={{ alignItems: "center", gap: 8, transform: [{ scale }] }}>
        {labelBlock}
        {avatarBlock}
      </Animated.View>
    );
  }
  if (position === "left") {
    return (
      <Animated.View style={{ flexDirection: "row", alignItems: "center", gap: 8, transform: [{ scale }] }}>
        {avatarBlock}
        {labelBlock}
      </Animated.View>
    );
  }
  return (
    <Animated.View style={{ flexDirection: "row", alignItems: "center", gap: 8, transform: [{ scale }] }}>
      {labelBlock}
      {avatarBlock}
    </Animated.View>
  );
}
