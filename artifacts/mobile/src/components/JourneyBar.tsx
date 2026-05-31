import React from "react";
import { StyleSheet, View } from "react-native";
import { C } from "@/constants/colors";

// 7 dots total:
//   0     → Ideias  (whole phase = 1 dot)
//   1–5   → Cargos  (one dot per cargo)
//   6     → Cola
const TOTAL = 7;

function globalIdx(phase: "ideias" | "cargos" | "cola", step: number): number {
  if (phase === "ideias") return 0;
  if (phase === "cargos") return 1 + step; // 1–5
  return 6;
}

interface JourneyBarProps {
  phase: "ideias" | "cargos" | "cola";
  /** 0-indexed position within the current phase (ignored for ideias/cola) */
  stepInPhase: number;
}

export function JourneyBar({ phase, stepInPhase }: JourneyBarProps) {
  const current = globalIdx(phase, stepInPhase);

  return (
    <View style={styles.row}>
      {Array.from({ length: TOTAL }).map((_, i) => {
        const done = i < current;
        const active = i === current;
        const isPhaseEnd = i === 0 || i === 5;
        return (
          <View key={i} style={isPhaseEnd ? styles.dotWithGap : undefined}>
            <View style={[styles.dot, done && styles.dotDone, active && styles.dotActive]} />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  dotWithGap: {
    marginRight: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: C.border,
  },
  dotDone: {
    backgroundColor: C.agree,
  },
  dotActive: {
    width: 18,
    backgroundColor: C.primary,
  },
});
