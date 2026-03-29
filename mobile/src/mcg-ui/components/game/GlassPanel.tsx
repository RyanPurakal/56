import React, { useEffect, useRef } from "react";
import { Animated, type ViewProps } from "react-native";
import { gameTheme } from "../../theme";

export function GlassPanel(props: ViewProps & { children?: React.ReactNode }) {
  const { style, children, ...rest } = props;
  const op = useRef(new Animated.Value(0)).current;
  const sc = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(op, { toValue: 1, duration: 320, useNativeDriver: true }),
      Animated.spring(sc, { toValue: 1, useNativeDriver: true, speed: 14, bounciness: 4 })
    ]).start();
  }, [op, sc]);

  return (
    <Animated.View
      {...rest}
      style={[
        {
          backgroundColor: gameTheme.glassBg,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.05)",
          borderRadius: 24,
          opacity: op,
          transform: [{ scale: sc }]
        },
        style
      ]}
    >
      {children}
    </Animated.View>
  );
}
