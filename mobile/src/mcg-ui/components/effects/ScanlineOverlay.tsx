import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { gameTheme } from "../../theme";

export function ScanlineOverlay() {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(v, { toValue: 1, duration: 8000, easing: Easing.linear, useNativeDriver: true })
    ).start();
  }, [v]);
  const translateY = v.interpolate({ inputRange: [0, 1], outputRange: [0, 120] });

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          opacity: 0.35,
          backgroundColor: "transparent"
        }}
      />
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          opacity: 0.25
        }}
      >
        {Array.from({ length: 80 }).map((_, i) => (
          <View
            key={i}
            style={{
              height: 3,
              marginBottom: 3,
              backgroundColor: i % 2 === 0 ? "transparent" : `${gameTheme.brandOrange}18`
            }}
          />
        ))}
      </View>
      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: 120,
          opacity: 0.12,
          transform: [{ translateY }],
          backgroundColor: gameTheme.brandOrange
        }}
      />
    </View>
  );
}
