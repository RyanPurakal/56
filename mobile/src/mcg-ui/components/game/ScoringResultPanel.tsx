import React, { useEffect, useRef } from "react";
import { Animated, Easing, ScrollView, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { Player, ScoreSummary } from "../../../../../shared/src/index.js";
import { gameTheme } from "../../theme";
import { AnimatedScore } from "./AnimatedScore";
import { GameButton } from "./GameButton";
import { GlassPanel } from "./GlassPanel";

const SUIT_SYMBOL: Record<string, string> = { S: "♠", H: "♥", D: "♦", C: "♣" };

export function ScoringResultPanel(props: {
  score: ScoreSummary;
  players: ReadonlyArray<Player>;
  myTeamId: number;
  onPlayAgain: () => void;
  onReturnToLobby: () => void;
}) {
  const { score, players, myTeamId, onPlayAgain, onReturnToLobby } = props;
  const oppTeamId = myTeamId === 0 ? 1 : 0;
  const myNames = players.filter((p) => p.teamId === myTeamId).map((p) => p.name);
  const oppNames = players.filter((p) => p.teamId === oppTeamId).map((p) => p.name);

  const bidderTeam = score.contract.bidderTeamId;
  const weWon = score.contractMet ? myTeamId === bidderTeam : myTeamId !== bidderTeam;

  const myBidLabel =
    myTeamId === bidderTeam
      ? `${score.contract.amount} ${SUIT_SYMBOL[score.contract.trump] ?? score.contract.trump}`
      : "Defense";
  const oppBidLabel =
    oppTeamId === bidderTeam
      ? `${score.contract.amount} ${SUIT_SYMBOL[score.contract.trump] ?? score.contract.trump}`
      : "Defense";

  const myScore = score.numericScoreByTeam[myTeamId as 0 | 1] ?? 0;
  const oppScore = score.numericScoreByTeam[oppTeamId as 0 | 1] ?? 0;

  const trophyWobble = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(trophyWobble, { toValue: 1, duration: 1000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(trophyWobble, { toValue: 0, duration: 1000, easing: Easing.inOut(Easing.quad), useNativeDriver: true })
      ])
    ).start();
  }, [trophyWobble]);
  const trophyRot = trophyWobble.interpolate({ inputRange: [0, 1], outputRange: ["-8deg", "8deg"] });

  const barMy = Math.min(100, Math.max(8, (myScore / 56) * 100));
  const barOpp = Math.min(100, Math.max(8, (oppScore / 56) * 100));

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 18, paddingVertical: 24 }} keyboardShouldPersistTaps="handled">
      <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, overflow: "hidden" }}>
        <LinearGradient
          colors={["rgba(0,255,136,0.2)", "transparent"]}
          style={{ position: "absolute", width: 280, height: 280, borderRadius: 140, top: "12%", left: "8%" }}
        />
        <LinearGradient
          colors={["rgba(255,107,53,0.18)", "transparent"]}
          style={{ position: "absolute", width: 300, height: 300, borderRadius: 150, bottom: "18%", right: "6%" }}
        />
      </View>

      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Animated.Text style={{ fontSize: 56, marginBottom: 8, transform: [{ rotate: trophyRot }] }}>🏆</Animated.Text>
        <Text
          style={{
            fontSize: 36,
            fontWeight: "900",
            color: weWon ? gameTheme.brandGreen : gameTheme.brandAmber,
            marginBottom: 6,
            textAlign: "center"
          }}
        >
          {weWon ? "Victory!" : "Defeat"}
        </Text>
        <Text style={{ fontSize: 17, color: gameTheme.textMuted, textAlign: "center" }}>
          {weWon ? "Your side takes the hand" : "Better luck next round"}
        </Text>
      </View>

      <GlassPanel style={{ padding: 22, marginBottom: 16 }}>
        <View style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
                <Text style={{ fontSize: 18, marginRight: 8 }}>🎖️</Text>
                <Text style={{ fontSize: 17, fontWeight: "800", color: "#fff" }}>Your Team</Text>
              </View>
              <Text style={{ fontSize: 13, color: gameTheme.textMuted }}>{myNames.join(" & ")}</Text>
              <Text style={{ fontSize: 12, color: gameTheme.textFaint, marginTop: 10 }}>Bid: {myBidLabel}</Text>
            </View>
            <AnimatedScore value={myScore} delay={200} style={{ fontSize: 42, fontWeight: "900", color: gameTheme.brandGreen }} />
          </View>
          <View style={{ height: 10, marginTop: 12, borderRadius: 6, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.08)" }}>
            <LinearGradient
              colors={[gameTheme.brandGreen, gameTheme.brandAmber]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={{ width: `${barMy}%`, height: "100%" }}
            />
          </View>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.15)" }} />
          <Text style={{ paddingHorizontal: 12, color: gameTheme.textFaint, fontSize: 12, fontWeight: "800" }}>VS</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.15)" }} />
        </View>

        <View>
          <Text style={{ fontSize: 17, fontWeight: "800", color: "#fff", marginBottom: 6 }}>Opponent Team</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={{ fontSize: 13, color: gameTheme.textMuted }}>{oppNames.join(" & ")}</Text>
              <Text style={{ fontSize: 12, color: gameTheme.textFaint, marginTop: 10 }}>Bid: {oppBidLabel}</Text>
            </View>
            <AnimatedScore value={oppScore} delay={350} style={{ fontSize: 42, fontWeight: "900", color: "rgba(255,255,255,0.55)" }} />
          </View>
          <View style={{ height: 10, marginTop: 12, borderRadius: 6, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.08)" }}>
            <View style={{ width: `${barOpp}%`, height: "100%", backgroundColor: "rgba(255,255,255,0.22)" }} />
          </View>
        </View>

        <View style={{ marginTop: 18, paddingTop: 18, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.1)", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 18, marginRight: 8 }}>📈</Text>
          <Text style={{ fontSize: 15, fontWeight: "700", color: score.contractMet ? gameTheme.brandGreen : "#fca5a5" }}>
            {score.contractMet ? "Contract Made!" : "Contract Failed"}
          </Text>
        </View>
        <Text style={{ fontSize: 11, color: gameTheme.textFaint, textAlign: "center", marginTop: 8 }}>
          ×{score.contract.multiplier} multiplier · Raw {score.rawPointsByTeam[myTeamId as 0 | 1]} / {score.rawPointsByTeam[oppTeamId as 0 | 1]}
        </Text>
      </GlassPanel>

      <GameButton variant="primary" size="lg" fullWidth onPress={onPlayAgain}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "800", marginRight: 8 }}>↻</Text>
          <Text style={{ color: "#fff", fontSize: 17, fontWeight: "800" }}>Play Again</Text>
        </View>
      </GameButton>
      <View style={{ height: 10 }} />
      <GameButton variant="secondary" size="lg" fullWidth onPress={onReturnToLobby}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "800", marginRight: 8 }}>⌂</Text>
          <Text style={{ color: "#fff", fontSize: 17, fontWeight: "800" }}>Return to Lobby</Text>
        </View>
      </GameButton>
    </ScrollView>
  );
}
