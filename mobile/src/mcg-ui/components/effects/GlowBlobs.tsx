import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Easing, View } from "react-native";
import { gameTheme } from "../../theme";

const { width: W, height: H } = Dimensions.get("window");

export function GlowBlobs() {
  const a = useRef(new Animated.Value(0)).current;
  const b = useRef(new Animated.Value(0)).current;
  const c = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const mk = (v: Animated.Value, d: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(v, { toValue: 1, duration: d, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
          Animated.timing(v, { toValue: 0, duration: d, easing: Easing.inOut(Easing.quad), useNativeDriver: true })
        ])
      );
    mk(a, 10000).start();
    mk(b, 12000).start();
    mk(c, 9000).start();
  }, [a, b, c]);

  const o1 = a.interpolate({ inputRange: [0, 1], outputRange: [0.1, 0.2] });
  const o2 = b.interpolate({ inputRange: [0, 1], outputRange: [0.15, 0.1] });
  const o3 = c.interpolate({ inputRange: [0, 1], outputRange: [0.08, 0.15] });

  return (
    <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, overflow: "hidden" }}>
      <Animated.View
        style={{
          position: "absolute",
          top: H * 0.2,
          left: W * 0.15,
          width: 220,
          height: 220,
          borderRadius: 110,
          backgroundColor: gameTheme.brandOrange,
          opacity: o1,
          transform: [{ scale: 1.2 }]
        }}
      />
      <Animated.View
        style={{
          position: "absolute",
          bottom: H * 0.2,
          right: W * 0.1,
          width: 220,
          height: 220,
          borderRadius: 110,
          backgroundColor: gameTheme.brandGreen,
          opacity: o2,
          transform: [{ scale: 1.15 }]
        }}
      />
      <Animated.View
        style={{
          position: "absolute",
          top: H * 0.45,
          right: W * 0.2,
          width: 160,
          height: 160,
          borderRadius: 80,
          backgroundColor: gameTheme.brandAmber,
          opacity: o3
        }}
      />
    </View>
  );
}
