import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Easing, Text, View } from "react-native";
import { gameTheme } from "../../theme";

const W = Dimensions.get("window").width;
const CHARS = "01アイウエオ";
const COL_COUNT = 8;

export function DataStream() {
  const anims = useRef(Array.from({ length: COL_COUNT }, () => new Animated.Value(0))).current;

  useEffect(() => {
    anims.forEach((av: Animated.Value, i: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 300),
          Animated.timing(av, {
            toValue: 1,
            duration: 3000 + Math.random() * 2000,
            easing: Easing.linear,
            useNativeDriver: true
          }),
          Animated.timing(av, { toValue: 0, duration: 0, useNativeDriver: true })
        ])
      ).start();
    });
  }, [anims]);

  return (
    <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, overflow: "hidden" }}>
      {anims.map((av: Animated.Value, i: number) => {
        const left = (W * (12 + i * 11)) / 100;
        const y = av.interpolate({ inputRange: [0, 1], outputRange: [-200, Dimensions.get("window").height + 200] });
        return (
          <Animated.View
            key={i}
            style={{
              position: "absolute",
              left,
              top: 0,
              transform: [{ translateY: y }]
            }}
          >
            {Array.from({ length: 14 }).map((_, j) => (
              <Text
                key={j}
                style={{
                  fontSize: 11,
                  fontFamily: "Courier",
                  color: gameTheme.brandGreen,
                  opacity: 0.35 + (j % 5) * 0.08
                }}
              >
                {CHARS[(i + j) % CHARS.length]}
              </Text>
            ))}
          </Animated.View>
        );
      })}
    </View>
  );
}
