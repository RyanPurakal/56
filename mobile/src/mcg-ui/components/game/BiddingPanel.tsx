import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { Suit } from "../../../../../shared/src/index.js";
import { gameTheme } from "../../theme";
import { GameButton } from "./GameButton";

const SUITS: { key: Suit; sym: string; red: boolean }[] = [
  { key: "S", sym: "♠", red: false },
  { key: "H", sym: "♥", red: true },
  { key: "D", sym: "♦", red: true },
  { key: "C", sym: "♣", red: false }
];

const BID_AMOUNTS = [28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56];

export function BiddingPanel(props: {
  currentBid: number;
  minBid: number;
  onBid: (amount: number, trump: Suit) => void;
  onPass: () => void;
  onDouble: () => void;
  canDouble?: boolean;
}) {
  const { currentBid, minBid, onBid, onPass, onDouble, canDouble = false } = props;
  const [selectedSuit, setSelectedSuit] = useState<Suit | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const validBids = useMemo(() => BID_AMOUNTS.filter((b) => b >= minBid && b <= 56), [minBid]);

  const confirm = () => {
    if (selectedAmount != null && selectedSuit) {
      onBid(selectedAmount, selectedSuit);
      setSelectedAmount(null);
      setSelectedSuit(null);
    }
  };

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0,0,0,0.5)" }]} onPress={onPass} />

      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <View
          style={{
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            borderTopWidth: 2,
            borderColor: gameTheme.brandOrange,
            backgroundColor: "rgba(0,0,0,0.96)",
            paddingBottom: 28,
            paddingTop: 8,
            overflow: "hidden"
          }}
        >
          <LinearGradient
            colors={[gameTheme.brandOrange, gameTheme.brandAmber, gameTheme.brandGreen]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{ height: 3, width: "100%" }}
          />
          <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: "800", color: "#fff", textAlign: "center", marginBottom: 12 }}>Place Your Bid</Text>
            <View style={{ alignItems: "center", marginBottom: 16 }}>
              <Text style={{ fontSize: 13, color: gameTheme.textMuted }}>Current Bid</Text>
              <Text style={{ fontSize: 26, fontWeight: "900", color: gameTheme.brandAmber, marginTop: 4 }}>
                {currentBid > 0 ? currentBid : "None"}
              </Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 12, flexDirection: "row", alignItems: "center" }}>
              {validBids.map((amount) => (
                <Pressable key={amount} onPress={() => setSelectedAmount(amount)} style={{ marginRight: 8 }}>
                  <View
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      borderRadius: 12,
                      backgroundColor: selectedAmount === amount ? gameTheme.brandAmber : "rgba(255,255,255,0.1)",
                      borderWidth: selectedAmount === amount ? 0 : 1,
                      borderColor: "rgba(255,255,255,0.12)"
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "900",
                        color: selectedAmount === amount ? "#000" : "#fff",
                        fontSize: 16
                      }}
                    >
                      {amount}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>

            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 16, marginTop: 8 }}>
              {SUITS.map((s) => (
                <Pressable key={s.key} onPress={() => setSelectedSuit(s.key)} style={{ width: "23%", marginBottom: 8 }}>
                  <View
                    style={{
                      paddingVertical: 14,
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: selectedSuit === s.key ? gameTheme.brandGreen : "rgba(255,255,255,0.2)",
                      backgroundColor: selectedSuit === s.key ? "rgba(0,255,136,0.15)" : "rgba(255,255,255,0.05)",
                      alignItems: "center"
                    }}
                  >
                    <Text style={{ fontSize: 28, color: s.red ? "#ef4444" : "#fff" }}>{s.sym}</Text>
                  </View>
                </Pressable>
              ))}
            </View>

            <View style={{ flexDirection: "row", alignItems: "stretch", gap: 8 }}>
              <View style={{ flex: 1 }}>
                <GameButton variant="ghost" size="lg" fullWidth onPress={onPass}>
                  Pass
                </GameButton>
              </View>
              {canDouble ? (
                <View style={{ flex: 1 }}>
                  <GameButton variant="secondary" size="lg" fullWidth onPress={onDouble}>
                    Double
                  </GameButton>
                </View>
              ) : null}
              <View style={{ flex: canDouble ? 1 : 2 }}>
                <GameButton
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={selectedAmount == null || !selectedSuit}
                  onPress={confirm}
                >
                  Confirm
                </GameButton>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
