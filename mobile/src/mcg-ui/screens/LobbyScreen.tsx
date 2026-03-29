import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Text, TextInput, View } from "react-native";
import { createRoom, joinRoom } from "../../network/socket";
import { useGameStore } from "../../state/gameStore";
import { Banner } from "../../components/game/Banner";
import { CircuitBoard } from "../components/effects/CircuitBoard";
import { DataStream } from "../components/effects/DataStream";
import { GlowBlobs } from "../components/effects/GlowBlobs";
import { HexagonGrid } from "../components/effects/HexagonGrid";
import { ScanlineOverlay } from "../components/effects/ScanlineOverlay";
import { CyberLogo56 } from "../components/game/CyberLogo56";
import { GameButton } from "../components/game/GameButton";
import { GlassPanel } from "../components/game/GlassPanel";
import { gameTheme } from "../theme";

export function LobbyScreen() {
  const [name, setName] = useState("Player");
  const [roomId, setRoomId] = useState("");
  const [showJoinInput, setShowJoinInput] = useState(false);
  const serverUrl = useGameStore((s) => s.serverUrl);
  const setServerUrl = useGameStore((s) => s.setServerUrl);
  const connectionStatus = useGameStore((s) => s.connectionStatus);
  const invalid = useGameStore((s) => s.invalidMoveMessage);

  const blink = useRef(new Animated.Value(0)).current;
  const blink2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blink, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(blink, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.quad), useNativeDriver: true })
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(blink2, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.quad), useNativeDriver: true, delay: 500 }),
        Animated.timing(blink2, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.quad), useNativeDriver: true })
      ])
    ).start();
  }, [blink, blink2]);

  const o1 = blink.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] });
  const o2 = blink2.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] });

  const canJoin = roomId.trim().length >= 4;
  const normalizedRoomId = useMemo(() => roomId.trim().toUpperCase(), [roomId]);

  return (
    <View style={{ flex: 1, backgroundColor: gameTheme.gameBgDark, paddingHorizontal: 16, justifyContent: "center" }}>
      <DataStream />
      <CircuitBoard />
      <HexagonGrid />
      <ScanlineOverlay />
      <GlowBlobs />

      <Animated.Text style={{ position: "absolute", top: 16, left: 16, opacity: o1, color: gameTheme.brandOrange, fontSize: 10, fontWeight: "800", fontFamily: "Courier" }}>
        [CONN: SECURE]
      </Animated.Text>
      <Animated.Text style={{ position: "absolute", top: 16, right: 16, opacity: o2, color: gameTheme.brandGreen, fontSize: 10, fontWeight: "800", fontFamily: "Courier" }}>
        [SYS: ONLINE]
      </Animated.Text>
      <Text style={{ position: "absolute", bottom: 20, left: 16, color: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "Courier" }}>v2.56.0</Text>

      <View style={{ alignItems: "center", zIndex: 10 }}>
        <View style={{ marginBottom: 20 }}>
          <CyberLogo56 />
        </View>
        <Text
          style={{
            color: gameTheme.textMuted,
            fontSize: 17,
            marginBottom: 8,
            textAlign: "center",
            textShadowColor: "rgba(255,107,53,0.35)",
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 16
          }}
        >
          The Ultimate Trick-Taking Game
        </Text>
        <Text style={{ fontSize: 11, color: gameTheme.textFaint, marginBottom: 12, fontWeight: "700" }}>{connectionStatus}</Text>
      </View>

      {connectionStatus !== "connected" ? (
        <View style={{ marginBottom: 8, zIndex: 10 }}>
          <Banner tone="warn" message="Reconnecting…" />
        </View>
      ) : null}
      {invalid ? (
        <View style={{ marginBottom: 8, zIndex: 10 }}>
          <Banner tone="error" message={invalid} />
        </View>
      ) : null}

      <GlassPanel style={{ padding: 28, zIndex: 10 }}>
        <View style={{ position: "absolute", top: 0, left: 0, width: 32, height: 32, borderTopWidth: 2, borderLeftWidth: 2, borderColor: "rgba(255,107,53,0.45)" }} />
        <View style={{ position: "absolute", top: 0, right: 0, width: 32, height: 32, borderTopWidth: 2, borderRightWidth: 2, borderColor: "rgba(255,107,53,0.45)" }} />
        <View style={{ position: "absolute", bottom: 0, left: 0, width: 32, height: 32, borderBottomWidth: 2, borderLeftWidth: 2, borderColor: "rgba(0,255,136,0.35)" }} />
        <View style={{ position: "absolute", bottom: 0, right: 0, width: 32, height: 32, borderBottomWidth: 2, borderRightWidth: 2, borderColor: "rgba(0,255,136,0.35)" }} />

        <Text style={{ color: gameTheme.textFaint, fontSize: 11, fontWeight: "800", marginBottom: 8, fontFamily: "Courier" }}>SERVER</Text>
        <View
          style={{
            borderRadius: 14,
            borderWidth: 2,
            borderColor: "rgba(255,107,53,0.28)",
            backgroundColor: "rgba(0,0,0,0.5)",
            paddingHorizontal: 14,
            paddingVertical: 12,
            marginBottom: 14
          }}
        >
          <TextInput
            value={serverUrl}
            onChangeText={setServerUrl}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="http://192.168.x.x:3000"
            placeholderTextColor={gameTheme.textFaint}
            style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}
          />
        </View>

        <Text style={{ color: gameTheme.textFaint, fontSize: 11, fontWeight: "800", marginBottom: 8, fontFamily: "Courier" }}>DISPLAY NAME</Text>
        <View
          style={{
            borderRadius: 14,
            borderWidth: 1,
            borderColor: gameTheme.glassBorder,
            backgroundColor: "rgba(0,0,0,0.35)",
            paddingHorizontal: 14,
            paddingVertical: 12,
            marginBottom: 20
          }}
        >
          <TextInput
            value={name}
            onChangeText={setName}
            autoCorrect={false}
            placeholder="Player"
            placeholderTextColor={gameTheme.textFaint}
            style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}
          />
        </View>

        <GameButton variant="primary" size="lg" fullWidth onPress={() => createRoom(name)}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Text style={{ fontSize: 22, color: "#fff", fontWeight: "800" }}>＋</Text>
            <Text style={{ fontSize: 18, color: "#fff", fontWeight: "800" }}>Create Room</Text>
          </View>
        </GameButton>

        <View style={{ height: 14 }} />

        {!showJoinInput ? (
          <GameButton variant="secondary" size="lg" fullWidth onPress={() => setShowJoinInput(true)}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Text style={{ fontSize: 18, color: "#fff", fontWeight: "800" }}>→</Text>
              <Text style={{ fontSize: 18, color: "#fff", fontWeight: "800" }}>Join Room</Text>
            </View>
          </GameButton>
        ) : (
          <View style={{ gap: 12 }}>
            <View style={{ position: "relative" }}>
              <TextInput
                value={roomId}
                onChangeText={(t) => setRoomId(t.toUpperCase())}
                placeholder="Enter room code"
                placeholderTextColor="rgba(255,255,255,0.35)"
                maxLength={8}
                style={{
                  borderRadius: 14,
                  borderWidth: 2,
                  borderColor: "rgba(255,107,53,0.35)",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  color: "#fff",
                  fontSize: 18,
                  letterSpacing: 4,
                  textAlign: "center",
                  fontWeight: "800"
                }}
              />
              <View
                style={{
                  position: "absolute",
                  right: 14,
                  top: "50%",
                  marginTop: -5,
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: gameTheme.brandGreen,
                  opacity: 0.85
                }}
              />
            </View>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <GameButton
                variant="ghost"
                size="md"
                fullWidth
                onPress={() => {
                  setShowJoinInput(false);
                  setRoomId("");
                }}
              >
                Cancel
              </GameButton>
              <GameButton variant="primary" size="md" fullWidth disabled={!canJoin} onPress={() => joinRoom(normalizedRoomId, name)}>
                Join
              </GameButton>
            </View>
          </View>
        )}
      </GlassPanel>

      <Text style={{ textAlign: "center", color: gameTheme.textFaint, fontSize: 13, marginTop: 24, zIndex: 10 }}>
        A partnership trick-taking game for 4 players
      </Text>
    </View>
  );
}
