import React from "react";
import { Text, View } from "react-native";
import { gameTheme } from "../../theme";

export function TurnIndicator(props: { isYourTurn: boolean; currentPlayer?: string; visible: boolean }) {
  if (!props.visible) return null;
  const { isYourTurn, currentPlayer } = props;
  return (
    <View
      style={{
        position: "absolute",
        bottom: 128,
        left: 0,
        right: 0,
        alignItems: "center",
        zIndex: 40
      }}
    >
      {isYourTurn ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            paddingHorizontal: 22,
            paddingVertical: 12,
            borderRadius: 999,
            borderWidth: 2,
            borderColor: gameTheme.brandGreen,
            backgroundColor: "rgba(0,255,136,0.18)"
          }}
        >
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: gameTheme.brandGreen }} />
          <Text style={{ color: gameTheme.brandGreen, fontWeight: "800", fontSize: 17 }}>Your Turn</Text>
        </View>
      ) : currentPlayer ? (
        <View
          style={{
            paddingHorizontal: 18,
            paddingVertical: 10,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.2)",
            backgroundColor: "rgba(255,255,255,0.06)"
          }}
        >
          <Text style={{ color: gameTheme.textMuted, fontSize: 14 }}>Waiting for {currentPlayer}…</Text>
        </View>
      ) : null}
    </View>
  );
}
