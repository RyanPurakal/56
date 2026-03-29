import React, { useEffect, useRef } from "react";
import { Animated, Easing, Text, View } from "react-native";
import { gameTheme } from "../../theme";

export function InvalidActionFeedback(props: { message: string }) {
  const { message } = props;
  const shake = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    shake.setValue(0);
    Animated.sequence([
      Animated.timing(shake, { toValue: 1, duration: 80, easing: Easing.linear, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -1, duration: 80, easing: Easing.linear, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 1, duration: 80, easing: Easing.linear, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 80, easing: Easing.linear, useNativeDriver: true })
    ]).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 600, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
        Animated.timing(glow, { toValue: 0, duration: 600, easing: Easing.inOut(Easing.quad), useNativeDriver: false })
      ])
    ).start();
  }, [message, shake, glow]);

  const tx = shake.interpolate({ inputRange: [-1, 0, 1], outputRange: [-10, 0, 10] });
  const shadow = glow.interpolate({ inputRange: [0, 1], outputRange: [12, 22] });

  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 88,
        left: 16,
        right: 16,
        alignItems: "center",
        zIndex: 160
      }}
    >
      <Animated.View
        style={{
          transform: [{ translateX: tx }],
          paddingHorizontal: 22,
          paddingVertical: 12,
          borderRadius: 16,
          borderWidth: 2,
          borderColor: "rgba(239,68,68,0.85)",
          backgroundColor: "rgba(239,68,68,0.18)",
          shadowColor: gameTheme.brandOrange,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.55,
          shadowRadius: shadow as unknown as number
        }}
      >
        <Text style={{ color: "#fca5a5", fontWeight: "700", fontSize: 14, textAlign: "center" }}>{message}</Text>
      </Animated.View>
    </View>
  );
}
