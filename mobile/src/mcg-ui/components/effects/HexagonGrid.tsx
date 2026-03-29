import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Defs, LinearGradient, Polygon, Stop } from "react-native-svg";
import { gameTheme } from "../../theme";

const HEX = [
  { x: 10, y: 5 },
  { x: 35, y: 5 },
  { x: 60, y: 5 },
  { x: 85, y: 5 },
  { x: 22, y: 25 },
  { x: 47, y: 25 },
  { x: 72, y: 25 },
  { x: 10, y: 45 },
  { x: 35, y: 45 },
  { x: 60, y: 45 },
  { x: 85, y: 45 },
  { x: 47, y: 65 }
];

export function HexagonGrid() {
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: 0.22 }]}>
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <Defs>
          <LinearGradient id="hexStroke" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={gameTheme.brandOrange} />
            <Stop offset="1" stopColor={gameTheme.brandGreen} />
          </LinearGradient>
        </Defs>
        {HEX.map((h, i) => (
          <Polygon
            key={i}
            points="10,0 20,5 20,15 10,20 0,15 0,5"
            fill="none"
            stroke="url(#hexStroke)"
            strokeWidth={0.25}
            transform={`translate(${h.x}, ${h.y})`}
            opacity={0.45}
          />
        ))}
      </Svg>
    </View>
  );
}
