import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

const MONO = Platform.select({ ios: "Courier New", android: "monospace", default: "monospace" });

interface NumberDisplayProps {
  numero: string;
  color?: string;
  fontSize?: number;
}

export function NumberDisplay({ numero, color = "#FFFFFF", fontSize = 42 }: NumberDisplayProps) {
  return (
    <View style={styles.row}>
      {numero.split("").map((d, i) => (
        <Text key={i} style={[styles.digit, { color, fontSize }]}>
          {d}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 6, alignItems: "baseline" },
  digit: {
    fontFamily: MONO,
    fontWeight: "800",
    letterSpacing: 2,
  },
});
