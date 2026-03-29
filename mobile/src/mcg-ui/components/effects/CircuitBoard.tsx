import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Defs, Line, LinearGradient, Stop } from "react-native-svg";
import { gameTheme } from "../../theme";

export function CircuitBoard() {
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: 0.12 }]}>
      <Svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
        <Defs>
          <LinearGradient id="c1" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={gameTheme.brandOrange} stopOpacity="0" />
            <Stop offset="0.5" stopColor={gameTheme.brandOrange} stopOpacity="0.9" />
            <Stop offset="1" stopColor={gameTheme.brandOrange} stopOpacity="0" />
          </LinearGradient>
          <LinearGradient id="c2" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={gameTheme.brandGreen} stopOpacity="0" />
            <Stop offset="0.5" stopColor={gameTheme.brandGreen} stopOpacity="0.8" />
            <Stop offset="1" stopColor={gameTheme.brandGreen} stopOpacity="0" />
          </LinearGradient>
        </Defs>
        <Line x1="0" y1="200" x2="1000" y2="200" stroke="url(#c1)" strokeWidth="2" />
        <Line x1="0" y1="400" x2="1000" y2="400" stroke="url(#c2)" strokeWidth="2" />
        <Line x1="0" y1="600" x2="1000" y2="600" stroke="url(#c1)" strokeWidth="1.5" />
        <Line x1="200" y1="0" x2="200" y2="1000" stroke="url(#c2)" strokeWidth="1.5" />
        <Line x1="600" y1="0" x2="600" y2="1000" stroke="url(#c1)" strokeWidth="1.5" />
      </Svg>
    </View>
  );
}
