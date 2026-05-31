import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { C } from "@/constants/colors";
import { siglaColorHex } from "@/src/lib/colorHash";
import { matchColor } from "@/src/lib/matching";
import type { Cargo, ScoredCandidate } from "@/src/lib/types";
import { CandidateAvatar } from "@/src/components/CandidateAvatar";

interface ChoicePanelProps {
  cargo: Cargo;
  candidates: ScoredCandidate[];
  saved: string[];
  onChoose: (id: string) => void;
}

export function ChoicePanel({ candidates, saved, onChoose }: ChoicePanelProps) {
  const pool = saved.length > 0 ? candidates.filter((c) => saved.includes(c.id)) : candidates;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Escolha seu candidato</Text>
      <Text style={styles.sub}>
        {saved.length > 0
          ? `${saved.length} salvo${saved.length > 1 ? "s" : ""} — quem vai para a cola?`
          : "Você não salvou nenhum — escolha mesmo assim:"}
      </Text>
      <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 340 }}>
        {pool.map((c) => {
          const accentColor = siglaColorHex(c.partido);
          return (
            <Pressable
              key={c.id}
              style={styles.row}
              onPress={() => onChoose(c.id)}
              accessibilityRole="button"
              accessibilityLabel={`Escolher ${c.nomeUrna}`}
            >
              <CandidateAvatar candidate={c} size={40} accentColor={accentColor} />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{c.nomeUrna}</Text>
                <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
                  <View style={styles.partidoTag}>
                    <Text style={styles.partidoTagText}>{c.partido}</Text>
                  </View>
                  <Text style={styles.numero}>Nº {c.numero}</Text>
                </View>
              </View>
              <Text style={[styles.pct, { color: matchColor(c.matchScore) }]}>
                {c.matchScore}%
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    shadowColor: C.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  heading: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: C.text,
    marginBottom: 4,
  },
  sub: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: C.mutedForeground,
    marginBottom: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.subtleBg,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontFamily: "Inter_700Bold", fontSize: 14 },
  name: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: C.text },
  partidoTag: {
    backgroundColor: C.secondary,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  partidoTagText: { fontFamily: "Inter_600SemiBold", fontSize: 11, color: C.primary },
  numero: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.neutral },
  pct: { fontFamily: "Inter_700Bold", fontSize: 14 },
});
