import React, { useEffect, useRef } from "react";
import { Animated, Easing, Text, View } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { gameTheme } from "../../theme";

const sizes = { sm: 36, md: 52, lg: 72, xl: 80 };

export function Logo56({ size = "md", animated = true }: { size?: keyof typeof sizes; animated?: boolean }) {
  const fs = sizes[size];
  const glow = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!animated) return;
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.quad), useNativeDriver: true })
      ])
    ).start();
  }, [animated, glow]);
  const g = glow.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.55] });

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      {animated ? (
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            width: fs * 3,
            height: fs * 2,
            borderRadius: fs,
            opacity: g,
            backgroundColor: gameTheme.brandOrange,
            transform: [{ scale: 1.2 }]
          }}
        />
      ) : null}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <MaskedView
          style={{ height: fs + 8, width: fs * 0.65 }}
          maskElement={
            <Text style={{ fontSize: fs, fontWeight: "900", color: "#000", lineHeight: fs + 4 }}>5</Text>
          }
        >
          <LinearGradient colors={["#ff6b35", "#ffa726", "#ffb74d"]} style={{ flex: 1 }} />
        </MaskedView>
        <MaskedView
          style={{ height: fs + 8, width: fs * 0.65, marginLeft: -4 }}
          maskElement={
            <Text style={{ fontSize: fs, fontWeight: "900", color: "#000", lineHeight: fs + 4 }}>6</Text>
          }
        >
          <LinearGradient colors={["#ffa726", "#ffb74d", "#ffc062"]} style={{ flex: 1 }} />
        </MaskedView>
      </View>
      <View style={{ position: "absolute", top: -6, right: -4, flexDirection: "row", gap: 4 }}>
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: gameTheme.brandOrange, opacity: 0.8 }} />
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: gameTheme.brandAmber, opacity: 0.8 }} />
      </View>
    </View>
  );
}
