import React, { useEffect, useRef } from "react";
import { Animated, Easing, Text, View } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient as SvgLinearGradient,
  Path,
  Polygon,
  Stop
} from "react-native-svg";
import { gameTheme } from "../../theme";

export function CyberLogo56() {
  const rot1 = useRef(new Animated.Value(0)).current;
  const rot2 = useRef(new Animated.Value(0)).current;
  const scan = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(Animated.timing(rot1, { toValue: 1, duration: 20000, easing: Easing.linear, useNativeDriver: true })).start();
    Animated.loop(Animated.timing(rot2, { toValue: 1, duration: 15000, easing: Easing.linear, useNativeDriver: true })).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(scan, { toValue: 1, duration: 2000, easing: Easing.linear, useNativeDriver: true }),
        Animated.delay(1000),
        Animated.timing(scan, { toValue: 0, duration: 0, useNativeDriver: true })
      ])
    ).start();
  }, [rot1, rot2, scan]);

  const r1 = rot1.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });
  const r2 = rot2.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "-360deg"] });
  const scanTop = scan.interpolate({ inputRange: [0, 1], outputRange: [0, 160] });

  return (
    <View style={{ alignItems: "center", justifyContent: "center", height: 220, width: 220 }}>
      <Animated.View style={{ position: "absolute", width: 200, height: 200, transform: [{ rotate: r1 }] }}>
        <Svg width={200} height={200} viewBox="0 0 200 200">
          <Defs>
            <SvgLinearGradient id="og" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={gameTheme.brandOrange} />
              <Stop offset="1" stopColor={gameTheme.brandAmber} />
            </SvgLinearGradient>
          </Defs>
          <Circle cx={100} cy={100} r={90} fill="none" stroke="url(#og)" strokeWidth={0.5} opacity={0.35} strokeDasharray="5 10" />
        </Svg>
      </Animated.View>
      <Animated.View style={{ position: "absolute", width: 200, height: 200, transform: [{ rotate: r2 }] }}>
        <Svg width={200} height={200} viewBox="0 0 200 200">
          <Circle cx={100} cy={100} r={80} fill="none" stroke={gameTheme.brandGreen} strokeWidth={0.5} opacity={0.22} strokeDasharray="3 15" />
        </Svg>
      </Animated.View>

      <Svg width={180} height={180} viewBox="0 0 180 180" style={{ position: "absolute" }}>
        <Defs>
          <SvgLinearGradient id="hexG" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={gameTheme.brandOrange} stopOpacity={0.12} />
            <Stop offset="0.5" stopColor={gameTheme.brandGreen} stopOpacity={0.06} />
            <Stop offset="1" stopColor={gameTheme.brandAmber} stopOpacity={0.12} />
          </SvgLinearGradient>
          <SvgLinearGradient id="og2" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={gameTheme.brandOrange} />
            <Stop offset="1" stopColor={gameTheme.brandAmber} />
          </SvgLinearGradient>
        </Defs>
        <Polygon
          points="90,20 155,57.5 155,122.5 90,160 25,122.5 25,57.5"
          fill="url(#hexG)"
          stroke="url(#og2)"
          strokeWidth={1}
          opacity={0.65}
        />
        <G opacity={0.85}>
          <Path d="M 30 30 L 30 50 M 30 30 L 50 30" stroke={gameTheme.brandOrange} strokeWidth={2} fill="none" />
          <Path d="M 150 30 L 150 50 M 150 30 L 130 30" stroke={gameTheme.brandOrange} strokeWidth={2} fill="none" />
          <Path d="M 30 150 L 30 130 M 30 150 L 50 150" stroke={gameTheme.brandGreen} strokeWidth={2} fill="none" />
          <Path d="M 150 150 L 150 130 M 150 150 L 130 150" stroke={gameTheme.brandGreen} strokeWidth={2} fill="none" />
        </G>
      </Svg>

      <View style={{ width: 180, height: 180, alignItems: "center", justifyContent: "center" }}>
        <MaskedView style={{ height: 88, width: 120 }} maskElement={<Text style={{ fontSize: 72, fontWeight: "900", textAlign: "center", color: "#000" }}>56</Text>}>
          <LinearGradient
            colors={[gameTheme.brandOrange, gameTheme.brandGreen, gameTheme.brandAmber]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
          />
        </MaskedView>
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 3,
            top: scanTop,
            opacity: 0.85
          }}
        >
          <LinearGradient
            colors={["transparent", gameTheme.brandOrange, "transparent"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{ flex: 1 }}
          />
        </Animated.View>
      </View>

      <Text
        style={{
          position: "absolute",
          bottom: -4,
          fontSize: 10,
          fontFamily: "Courier",
          letterSpacing: 3,
          color: gameTheme.brandGreen,
          opacity: 0.85
        }}
      >
        [SYSTEM: ACTIVE]
      </Text>
    </View>
  );
}
