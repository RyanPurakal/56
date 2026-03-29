import React from "react";
import { Text, View } from "react-native";
import type { Suit } from "../../../../../shared/src/index.js";
import { gameTheme } from "../../theme";

const SYM: Record<Suit, string> = { S: "♠", H: "♥", D: "♦", C: "♣" };
const RED: Record<Suit, boolean> = { S: false, H: true, D: true, C: false };

export function BidDisplay(props: { playerName: string; bidAmount: number; trumpSuit: Suit; visible: boolean }) {
  if (!props.visible) return null;
  const { playerName, bidAmount, trumpSuit } = props;
  return (
    <View
      style={{
        position: "absolute",
        top: 72,
        left: 0,
        right: 0,
        alignItems: "center",
        zIndex: 25
      }}
    >
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderRadius: 16,
          borderWidth: 2,
          borderColor: gameTheme.brandAmber,
          backgroundColor: "rgba(0,0,0,0.88)",
          shadowColor: gameTheme.brandAmber,
          shadowOpacity: 0.35,
          shadowRadius: 16
        }}
      >
        <Text style={{ fontSize: 11, color: gameTheme.textMuted, textAlign: "center" }}>{playerName}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 4, gap: 8 }}>
          <Text style={{ fontSize: 26, fontWeight: "900", color: gameTheme.brandAmber }}>{bidAmount}</Text>
          <Text style={{ fontSize: 24, color: RED[trumpSuit] ? "#ef4444" : "#fff" }}>{SYM[trumpSuit]}</Text>
        </View>
      </View>
    </View>
  );
}
