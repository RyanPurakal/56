import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Dimensions, Easing, View } from "react-native";
import { CardBack } from "./CardBack";

const { width: W, height: H } = Dimensions.get("window");

/** Figma-style deal burst; capped card count for mobile performance. */
const VISIBLE_CARDS = 20;
const POSITIONS = [
  { x: 0, y: H * 0.11 },
  { x: -W * 0.28, y: 0 },
  { x: 0, y: -H * 0.11 },
  { x: W * 0.28, y: 0 }
];

export function CardDealAnimation({ active }: { active: boolean }) {
  const anims = useRef(Array.from({ length: VISIBLE_CARDS }, () => new Animated.Value(0))).current;
  const deckPulse = useRef(new Animated.Value(1)).current;

  const order = useMemo(() => Array.from({ length: VISIBLE_CARDS }, (_, i) => i), []);

  useEffect(() => {
    if (!active) {
      anims.forEach((a) => a.setValue(0));
      deckPulse.stopAnimation();
      return;
    }
    anims.forEach((a, index) => {
      a.setValue(0);
      Animated.timing(a, {
        toValue: 1,
        duration: 420,
        delay: index * 45,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true
      }).start();
    });
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(deckPulse, { toValue: 0.94, duration: 400, useNativeDriver: true }),
        Animated.timing(deckPulse, { toValue: 1, duration: 400, useNativeDriver: true })
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [active, anims, deckPulse]);

  if (!active) return null;

  return (
    <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, alignItems: "center", justifyContent: "center", zIndex: 15 }}>
      {order.map((index) => {
        const playerIndex = index % 4;
        const pos = POSITIONS[playerIndex]!;
        const v = anims[index]!;
        const tx = v.interpolate({ inputRange: [0, 1], outputRange: [0, pos.x] });
        const ty = v.interpolate({ inputRange: [0, 1], outputRange: [0, pos.y] });
        const op = v.interpolate({ inputRange: [0, 0.2, 0.85, 1], outputRange: [0, 1, 1, 0] });
        const sc = v.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });
        return (
          <Animated.View
            key={index}
            style={{
              position: "absolute",
              opacity: op,
              transform: [{ translateX: tx }, { translateY: ty }, { scale: sc }],
              zIndex: index
            }}
          >
            <CardBack size="sm" animate={false} />
          </Animated.View>
        );
      })}
      <Animated.View style={{ transform: [{ scale: deckPulse }] }}>
        <View
          style={{
            width: 72,
            height: 100,
            borderRadius: 16,
            backgroundColor: "#222",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.12)"
          }}
        />
      </Animated.View>
    </View>
  );
}
