import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Dimensions, Easing, View } from "react-native";
import { gameTheme } from "../../theme";

const { width: W, height: H } = Dimensions.get("window");

export function FloatingParticles({ count = 15 }: { count?: number }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const rand = Math.random();
      const color =
        rand > 0.66 ? gameTheme.brandOrange : rand > 0.33 ? gameTheme.brandGreen : gameTheme.brandAmber;
      return {
        id: i,
        x: Math.random() * W,
        y: Math.random() * H,
        size: Math.random() * 3 + 2,
        duration: 8000 + Math.random() * 12000,
        delay: Math.random() * 4000,
        color
      };
    });
  }, [count]);

  return (
    <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, overflow: "hidden" }}>
      {particles.map((p) => (
        <Particle key={p.id} {...p} />
      ))}
    </View>
  );
}

function Particle(props: {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}) {
  const op = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(props.delay),
        Animated.timing(op, { toValue: 1, duration: props.duration / 3, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(op, { toValue: 0, duration: props.duration / 3, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.delay(props.duration / 3)
      ])
    ).start();
  }, [op, props.delay, props.duration]);

  const opacity = op.interpolate({ inputRange: [0, 1], outputRange: [0, 0.55] });

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: props.x,
        top: props.y,
        width: props.size,
        height: props.size,
        borderRadius: props.size / 2,
        backgroundColor: props.color,
        opacity,
        shadowColor: props.color,
        shadowOpacity: 0.8,
        shadowRadius: props.size * 2
      }}
    />
  );
}
