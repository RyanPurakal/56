import React from "react";
import { Text, View } from "react-native";

export function Banner(props: { tone: "info" | "warn" | "error"; message: string }) {
  const palette =
    props.tone === "info"
      ? { bg: "#12243D", border: "#2F4E7A", text: "#CFE3FF" }
      : props.tone === "warn"
        ? { bg: "#2B271B", border: "#6B5A2A", text: "#FFF1C7" }
        : { bg: "#2B1B1B", border: "#6B2A2A", text: "#FFD7D7" };

  return (
    <View style={{ marginTop: 10, padding: 10, borderRadius: 10, backgroundColor: palette.bg, borderWidth: 1, borderColor: palette.border }}>
      <Text style={{ color: palette.text, fontWeight: "700" }}>{props.message}</Text>
    </View>
  );
}

