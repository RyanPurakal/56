import React from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { LobbyScreen } from "./src/mcg-ui/screens/LobbyScreen";
import { RoomScreen } from "./src/mcg-ui/screens/RoomScreen";
import { GameScreen } from "./src/mcg-ui/screens/GameScreen";
import { useGameStore } from "./src/state/gameStore";
import { gameTheme } from "./src/mcg-ui/theme";

type Screen = "Lobby" | "Room" | "Game";

export default function App() {
  const currentRoomId = useGameStore((s) => s.currentRoomId);
  const serverPhase = useGameStore((s) => s.serverPhase);
  const hasGameState = useGameStore((s) => Boolean(s.gameState));

  // Avoid a blank screen between room_update(IN_GAME) and the first game_state_update.
  const screen: Screen = !currentRoomId ? "Lobby" : serverPhase === "IN_GAME" && hasGameState ? "Game" : "Room";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: gameTheme.gameBgDark }}>
      <StatusBar barStyle="light-content" />
      {screen === "Lobby" && <LobbyScreen />}
      {screen === "Room" && <RoomScreen />}
      {screen === "Game" && <GameScreen />}
    </SafeAreaView>
  );
}

