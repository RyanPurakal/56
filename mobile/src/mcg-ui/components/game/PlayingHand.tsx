import React, { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import type { Card as CardT, Rank } from "../../../../../shared/src/index.js";
import { gameTheme } from "../../theme";
import { PlayingCard } from "./PlayingCard";

const SUIT_ORDER = ["S", "H", "D", "C"] as const;
const RANK_ORDER: ReadonlyArray<Rank> = ["J", "9", "A", "10", "K", "Q"];

function sortCards(cards: ReadonlyArray<CardT>): ReadonlyArray<CardT> {
  return cards.slice().sort((a, b) => {
    const suitDiff = SUIT_ORDER.indexOf(a.suit as (typeof SUIT_ORDER)[number]) - SUIT_ORDER.indexOf(b.suit as (typeof SUIT_ORDER)[number]);
    if (suitDiff !== 0) return suitDiff;
    return RANK_ORDER.indexOf(a.rank) - RANK_ORDER.indexOf(b.rank);
  });
}

export function PlayingHand(props: {
  cards: ReadonlyArray<CardT>;
  enabled: boolean;
  onPlay: (cardUid: string) => void;
  selectedUid: string | null;
  onSelect: (uid: string | null) => void;
}) {
  const sorted = useMemo(() => sortCards(props.cards), [props.cards]);

  return (
    <View style={{ paddingVertical: 8 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10, alignItems: "flex-end" }}
      >
        {sorted.map((c, idx) => (
          <View key={c.uid} style={{ marginLeft: idx === 0 ? 0 : -10, zIndex: idx }}>
            <PlayingCard
              card={c}
              isPlayable={props.enabled}
              isSelected={props.selectedUid === c.uid}
              onPress={() => props.onSelect(props.selectedUid === c.uid ? null : c.uid)}
            />
          </View>
        ))}
      </ScrollView>
      <Text style={{ textAlign: "center", marginTop: 6, fontSize: 11, color: gameTheme.textFaint, fontWeight: "700" }}>
        {props.cards.length} cards
      </Text>
    </View>
  );
}
