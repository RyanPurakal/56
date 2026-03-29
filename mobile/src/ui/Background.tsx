import React, { useEffect, useRef } from "react";
import { Animated, Easing, View, type ViewProps } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "./tokens";

export function Background(props: ViewProps) {
  const { style, children, ...rest } = props;
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(a, { toValue: 1, duration: 8000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(a, { toValue: 0, duration: 8000, easing: Easing.inOut(Easing.quad), useNativeDriver: true })
      ])
    ).start();
  }, [a]);

  const o1 = a.interpolate({ inputRange: [0, 1], outputRange: [0.08, 0.16] });
  const o2 = a.interpolate({ inputRange: [0, 1], outputRange: [0.12, 0.06] });

  return (
    <View {...rest} style={[{ flex: 1, backgroundColor: colors.bg0 }, style]}>
      <LinearGradient
        colors={[colors.bg0, colors.bg0, "#0A0F0C"]}
        locations={[0, 0.5, 1]}
        style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
      />
      <Animated.View
        style={{
          position: "absolute",
          top: "18%",
          left: "8%",
          width: 220,
          height: 220,
          borderRadius: 110,
          opacity: o1,
          overflow: "hidden"
        }}
      >
        <LinearGradient colors={["rgba(255, 107, 53, 0.45)", "transparent"]} style={{ flex: 1 }} />
      </Animated.View>
      <Animated.View
        style={{
          position: "absolute",
          bottom: "22%",
          right: "6%",
          width: 260,
          height: 260,
          borderRadius: 130,
          opacity: o2,
          overflow: "hidden"
        }}
      >
        <LinearGradient colors={["rgba(0, 255, 136, 0.35)", "transparent"]} style={{ flex: 1 }} />
      </Animated.View>
      {children}
    </View>
  );
}
