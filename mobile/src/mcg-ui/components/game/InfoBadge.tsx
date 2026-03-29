import React from "react";
import { Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { gameTheme } from "../../theme";

export function InfoBadge(props: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  variant?: "default" | "highlight";
}) {
  const { label, value, icon, variant = "default" } = props;

  if (variant === "highlight") {
    return (
      <LinearGradient
        colors={["rgba(255,107,53,0.22)", "rgba(255,167,38,0.18)"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={{
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "rgba(255,107,53,0.4)"
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {icon}
          <View>
            <Text style={{ fontSize: 10, color: gameTheme.textMuted }}>{label}</Text>
            <Text style={{ fontSize: 14, fontWeight: "700", color: "#fff" }}>{value}</Text>
          </View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <View
      style={{
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.05)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)"
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        {icon}
        <View>
          <Text style={{ fontSize: 10, color: gameTheme.textMuted }}>{label}</Text>
          <Text style={{ fontSize: 14, fontWeight: "700", color: "#fff" }}>{value}</Text>
        </View>
      </View>
    </View>
  );
}
