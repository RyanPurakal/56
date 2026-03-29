import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, type TextStyle } from "react-native";

export function AnimatedScore(props: {
  value: number;
  duration?: number;
  delay?: number;
  style?: TextStyle;
}) {
  const { value, duration = 900, delay = 0, style } = props;
  const anim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    anim.setValue(0);
    const id = anim.addListener(({ value: v }) => setDisplay(Math.round(v)));
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(anim, { toValue: value, duration, useNativeDriver: false })
    ]).start();
    return () => anim.removeListener(id);
  }, [value, duration, delay, anim]);

  return <Text style={[styles.txt, style]}>{display}</Text>;
}

const styles = StyleSheet.create({
  txt: { fontVariant: ["tabular-nums"] }
});
