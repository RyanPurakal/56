import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Pressable, Text, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import { startGame, joinRoom } from "../../network/socket";
import { useGameStore } from "../../state/gameStore";
import type { RoomSeatSummary } from "../../../../shared/src/index.js";
import { Banner } from "../../components/game/Banner";
import { FloatingParticles } from "../components/effects/FloatingParticles";
import { GameButton } from "../components/game/GameButton";
import { GlassPanel } from "../components/game/GlassPanel";
import { PlayerSeat, type PlayerData } from "../components/game/PlayerSeat";
import { gameTheme } from "../theme";

export function RoomScreen() {
  const roomSummary = useGameStore((s) => s.roomSummary);
  const currentRoomId = useGameStore((s) => s.currentRoomId);
  const playerId = useGameStore((s) => s.playerId);
  const playerName = useGameStore((s) => s.playerName);
  const connectionStatus = useGameStore((s) => s.connectionStatus);
  const invalid = useGameStore((s) => s.invalidMoveMessage);
  const serverPhase = useGameStore((s) => s.serverPhase);
  const hasGameState = useGameStore((s) => Boolean(s.gameState));
  const resetToLobby = useGameStore((s) => s.resetToLobby);

  const [copied, setCopied] = useState(false);
  const glow = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 6000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 6000, easing: Easing.inOut(Easing.quad), useNativeDriver: true })
      ])
    ).start();
  }, [glow]);
  const glowOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0.18, 0.32] });

  if (!currentRoomId) return null;

  const bySeat: (RoomSeatSummary | null)[] = [null, null, null, null];
  for (const p of roomSummary?.players ?? []) {
    if (p && p.seat >= 0 && p.seat < 4) bySeat[p.seat] = p;
  }

  const toPlayerData = (s: NonNullable<RoomSeatSummary>): PlayerData => ({
    id: s.playerId,
    name: s.name,
    isReady: true
  });

  const seatedCount = bySeat.filter(Boolean).length;
  const isFull = Boolean(roomSummary?.isFull);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(currentRoomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={{ flex: 1, backgroundColor: gameTheme.gameBgDark, paddingHorizontal: 16, paddingTop: 12, justifyContent: "center" }}>
      <FloatingParticles count={15} />
      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: "22%",
          left: "8%",
          right: "8%",
          height: 340,
          borderRadius: 200,
          opacity: glowOpacity,
          overflow: "hidden"
        }}
      >
        <LinearGradient colors={["rgba(255,107,53,0.45)", "transparent"]} style={{ flex: 1 }} />
      </Animated.View>

      <View style={{ zIndex: 10 }}>
        <Pressable onPress={resetToLobby} style={{ flexDirection: "row", alignItems: "center", marginBottom: 16, gap: 8 }}>
          <Text style={{ color: gameTheme.textMuted, fontSize: 16 }}>←</Text>
          <Text style={{ color: gameTheme.textMuted, fontSize: 15, fontWeight: "600" }}>Back to Lobby</Text>
        </Pressable>

        <Text style={{ textAlign: "center", color: gameTheme.textMuted, fontSize: 20, marginBottom: 8 }}>Room Code</Text>
        <Pressable onPress={handleCopy} style={{ alignSelf: "center", marginBottom: 20 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              paddingHorizontal: 22,
              paddingVertical: 14,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.2)",
              backgroundColor: "rgba(255,255,255,0.1)"
            }}
          >
            <Text
              style={{
                fontSize: 32,
                fontWeight: "900",
                letterSpacing: 6,
                color: gameTheme.brandOrange
              }}
            >
              {currentRoomId}
            </Text>
            <Text style={{ fontSize: 22, color: copied ? gameTheme.brandGreen : gameTheme.textMuted }}>{copied ? "✓" : "⎘"}</Text>
          </View>
        </Pressable>

        <Text style={{ textAlign: "center", fontSize: 12, color: gameTheme.textFaint, marginBottom: 8 }}>{connectionStatus}</Text>

        {connectionStatus !== "connected" ? <Banner tone="warn" message="Reconnecting…" /> : null}
        {invalid ? <Banner tone="error" message={invalid} /> : null}
        {serverPhase === "IN_GAME" && !hasGameState ? <Banner tone="info" message="Starting game… loading state" /> : null}

        <GlassPanel style={{ padding: 26, marginBottom: 16, minHeight: 380 }}>
          <View style={{ position: "relative", height: 360 }}>
            <View style={{ position: "absolute", top: 0, left: 0, right: 0, alignItems: "center" }}>
              {bySeat[2] ? (
                <PlayerSeat player={toPlayerData(bySeat[2])} position="top" isEmpty={false} />
              ) : (
                <PlayerSeat position="top" isEmpty />
              )}
            </View>
            <View style={{ position: "absolute", left: 0, top: "38%" }}>
              {bySeat[1] ? (
                <PlayerSeat player={toPlayerData(bySeat[1])} position="left" isEmpty={false} />
              ) : (
                <PlayerSeat position="left" isEmpty />
              )}
            </View>
            <View style={{ position: "absolute", right: 0, top: "38%" }}>
              {bySeat[3] ? (
                <PlayerSeat player={toPlayerData(bySeat[3])} position="right" isEmpty={false} />
              ) : (
                <PlayerSeat position="right" isEmpty />
              )}
            </View>
            <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, alignItems: "center" }}>
              {bySeat[0] ? (
                <PlayerSeat player={toPlayerData(bySeat[0])} position="bottom" isEmpty={false} />
              ) : (
                <PlayerSeat position="bottom" isEmpty />
              )}
            </View>

            <View
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 140,
                height: 140,
                marginLeft: -70,
                marginTop: -70,
                borderRadius: 70,
                borderWidth: 2,
                borderColor: "rgba(255,255,255,0.1)",
                overflow: "hidden",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <LinearGradient
                colors={["rgba(255,107,53,0.14)", "rgba(0,255,136,0.12)"]}
                style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
              />
              <Text style={{ fontSize: 36, fontWeight: "900", color: "rgba(255,255,255,0.22)" }}>{seatedCount}</Text>
              <Text style={{ fontSize: 12, color: gameTheme.textFaint, fontWeight: "800" }}>/4 Players</Text>
            </View>
          </View>
        </GlassPanel>

        <Text style={{ textAlign: "center", color: gameTheme.textMuted, marginBottom: 14, fontSize: 15 }}>
          {isFull ? "All players ready!" : `Waiting for ${4 - seatedCount} more player${4 - seatedCount === 1 ? "" : "s"}…`}
        </Text>

        <GameButton variant="primary" size="lg" fullWidth disabled={!isFull} onPress={() => startGame(currentRoomId)}>
          {isFull ? "Start Game" : `Waiting… (${seatedCount}/4)`}
        </GameButton>

        {playerId ? (
          <View style={{ marginTop: 12 }}>
            <GameButton variant="ghost" size="md" fullWidth onPress={() => joinRoom(currentRoomId, playerName || "Player", playerId)}>
              Rejoin with saved identity
            </GameButton>
          </View>
        ) : null}
      </View>
    </View>
  );
}
