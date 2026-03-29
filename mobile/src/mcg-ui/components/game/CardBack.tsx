import React, { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { gameTheme } from "../../theme";

export function CardBack({ size = "md", animate = true }: { size?: "sm" | "md" | "lg"; animate?: boolean }) {
  const dim = size === "sm" ? { w: 44, h: 62 } : size === "lg" ? { w: 72, h: 100 } : { w: 56, h: 78 };
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!animate) return;
    Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 20000, useNativeDriver: true })
    ).start();
  }, [animate, spin]);
  const rot = spin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  return (
    <View style={{ width: dim.w, height: dim.h, borderRadius: 14, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.35, shadowRadius: 8 }}>
      <LinearGradient colors={["#1a1a1a", "#2d2d2d"]} style={{ flex: 1 }}>
        <Animated.View
          style={{
            ...{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, opacity: 0.35 },
            transform: [{ rotate: rot }]
          }}
        >
          <LinearGradient
            colors={[gameTheme.brandOrange, gameTheme.brandAmber, gameTheme.brandGold]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
          />
        </Animated.View>
        <View style={{ position: "absolute", left: 6, top: 6, width: 10, height: 10, borderLeftWidth: 2, borderTopWidth: 2, borderColor: `${gameTheme.brandOrange}99` }} />
        <View style={{ position: "absolute", right: 6, top: 6, width: 10, height: 10, borderRightWidth: 2, borderTopWidth: 2, borderColor: `${gameTheme.brandAmber}99` }} />
        <View style={{ position: "absolute", left: 6, bottom: 6, width: 10, height: 10, borderLeftWidth: 2, borderBottomWidth: 2, borderColor: `${gameTheme.brandAmber}99` }} />
        <View style={{ position: "absolute", right: 6, bottom: 6, width: 10, height: 10, borderRightWidth: 2, borderBottomWidth: 2, borderColor: `${gameTheme.brandGold}99` }} />
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <MaskedView style={{ height: 28, width: 44 }} maskElement={<Text style={{ fontSize: 26, fontWeight: "900", color: "#000", textAlign: "center" }}>56</Text>}>
            <LinearGradient colors={[gameTheme.brandOrange, gameTheme.brandGold]} style={{ flex: 1 }} />
          </MaskedView>
        </View>
      </LinearGradient>
    </View>
  );
}
