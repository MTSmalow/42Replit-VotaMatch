import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { C } from "@/constants/colors";

interface StepperProps {
  step: number;
  total: number;
}

export function Stepper({ step, total }: StepperProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <React.Fragment key={i}>
          <View style={[styles.node, i <= step ? styles.nodeDone : styles.nodeFuture]}>
            {i < step && <Text style={styles.nodeCheck}>✓</Text>}
            {i === step && <View style={styles.nodePulse} />}
          </View>
          {i < total - 1 && (
            <View style={[styles.line, i < step ? styles.lineDone : styles.lineFuture]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 0,
  },
  node: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  nodeDone: { backgroundColor: C.primary },
  nodeFuture: { backgroundColor: C.border },
  nodePulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.card,
  },
  nodeCheck: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    color: C.card,
  },
  line: { height: 3, width: 28 },
  lineDone: { backgroundColor: C.primary },
  lineFuture: { backgroundColor: C.border },
});
