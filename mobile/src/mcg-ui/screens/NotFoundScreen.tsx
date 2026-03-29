import React from "react";
import { Text, View } from "react-native";
import { gameTheme } from "../theme";
import { GameButton } from "../components/game/GameButton";

/** Parity with Figma `NotFoundScreen` — use if you add deep linking or unknown routes. */
export function NotFoundScreen(props: { onBackToLobby: () => void }) {
  return (
    <View style={{ flex: 1, backgroundColor: gameTheme.gameBgDark, alignItems: "center", justifyContent: "center", padding: 24 }}>
      <Text style={{ fontSize: 52, marginBottom: 12 }}>⚠️</Text>
      <Text
        style={{
          fontSize: 52,
          fontWeight: "900",
          color: gameTheme.brandOrange,
          marginBottom: 12
        }}
      >
        404
      </Text>
      <Text style={{ color: gameTheme.textMuted, marginBottom: 28, fontSize: 16 }}>Page not found</Text>
      <GameButton variant="primary" size="lg" onPress={props.onBackToLobby}>
        <Text style={{ color: "#fff", fontWeight: "800", fontSize: 17 }}>Back to Lobby</Text>
      </GameButton>
    </View>
  );
}
