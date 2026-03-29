import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { gameTheme } from "../../theme";

export function ReconnectingOverlay(props: { visible: boolean; isReconnecting?: boolean }) {
  const { visible, isReconnecting = true } = props;
  const spin = useRef(new Animated.Value(0)).current;
  const sweep = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;
    Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 2000, easing: Easing.linear, useNativeDriver: true })
    ).start();
    Animated.loop(
      Animated.timing(sweep, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.quad), useNativeDriver: true })
    ).start();
  }, [visible, spin, sweep]);

  if (!visible) return null;

  const rot = spin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });
  const barX = sweep.interpolate({ inputRange: [0, 1], outputRange: [-120, 120] });

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 200, backgroundColor: "rgba(0,0,0,0.82)", alignItems: "center", justifyContent: "center" }]}>
      <View
        style={{
          marginHorizontal: 24,
          maxWidth: 340,
          width: "100%",
          borderRadius: 24,
          borderWidth: 2,
          borderColor: gameTheme.brandOrange,
          backgroundColor: "rgba(0,0,0,0.92)",
          padding: 28
        }}
      >
        <View style={{ alignItems: "center" }}>
          {isReconnecting ? (
            <>
              <Animated.Text style={{ fontSize: 44, marginBottom: 12, transform: [{ rotate: rot }] }}>📶</Animated.Text>
              <Text style={{ fontSize: 22, fontWeight: "800", color: "#fff", marginBottom: 8 }}>Reconnecting…</Text>
              <Text style={{ fontSize: 14, color: gameTheme.textMuted, textAlign: "center" }}>Getting you back to the game</Text>
              <View style={{ marginTop: 20, height: 4, width: "100%", borderRadius: 2, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.1)" }}>
                <Animated.View style={{ width: "34%", height: "100%", transform: [{ translateX: barX }] }}>
                  <LinearGradient
                    colors={["transparent", gameTheme.brandAmber, "transparent"]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={{ flex: 1 }}
                  />
                </Animated.View>
              </View>
            </>
          ) : (
            <>
              <Text style={{ fontSize: 48, marginBottom: 12 }}>📵</Text>
              <Text style={{ fontSize: 22, fontWeight: "800", color: "#fff", marginBottom: 8 }}>Connection Lost</Text>
              <Text style={{ fontSize: 14, color: gameTheme.textMuted, textAlign: "center" }}>Attempting to reconnect…</Text>
            </>
          )}
        </View>
      </View>
    </View>
  );
}
