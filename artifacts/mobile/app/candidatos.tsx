import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { allCandidates } from "@/src/data/candidates";
import { CandidateAvatar } from "@/src/components/CandidateAvatar";
import { SearchModal } from "@/src/components/SearchModal";
import { CARGO_ORDER, CARGO_LABELS } from "@/src/constants/cargo";
import { siglaColorHex } from "@/src/lib/colorHash";
import { matchPct, matchColor } from "@/src/lib/matching";
import { useSessionStore } from "@/src/lib/session";
import { useSafeInsets } from "@/src/lib/useSafeInsets";
import type { Cargo, ScoredCandidate } from "@/src/lib/types";
import { C } from "@/constants/colors";

const CARGO_TAB_LABELS: Record<Cargo, string> = {
  deputadoEstadual: "Dep. Estadual",
  deputadoFederal: "Dep. Federal",
  senador: "Senador",
  governador: "Governador",
  presidente: "Presidente",
};

export default function CandidatosScreen() {
  const router = useRouter();
  const { top: topPad, bottom: botPad } = useSafeInsets();

  const [selectedCargo, setSelectedCargo] = useState<Cargo>(CARGO_ORDER[0]);
  const [partyFilter, setPartyFilter] = useState<string[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  const answers = useSessionStore((s) => s.answers);
  const escolhaFinal = useSessionStore((s) => s.escolhaFinal);
  const setEscolha = useSessionStore((s) => s.setEscolha);
  const clearEscolha = useSessionStore((s) => s.clearEscolha);

  const hasAnswers = Object.keys(answers).length > 0;

  const ranked = useMemo<ScoredCandidate[]>(() => {
    return allCandidates
      .filter((c) => c.cargo === selectedCargo)
      .map((c) => ({ ...c, matchScore: matchPct(answers, c.stances) }))
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [selectedCargo, answers]);

  const allParties = useMemo(() => {
    return [
      ...new Set(
        allCandidates
          .filter((c) => c.cargo === selectedCargo)
          .map((c) => c.partido)
      ),
    ].sort();
  }, [selectedCargo]);

  const displayed = useMemo(() => {
    if (partyFilter.length === 0) return ranked;
    return ranked.filter((c) => partyFilter.includes(c.partido));
  }, [ranked, partyFilter]);

  function toggleParty(p: string) {
    setPartyFilter((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  }

  function handleCargoChange(cargo: Cargo) {
    setSelectedCargo(cargo);
    setPartyFilter([]);
  }

  function toggleCola(c: ScoredCandidate) {
    if (escolhaFinal[c.cargo] === c.id) {
      clearEscolha(c.cargo);
    } else {
      setEscolha(c.cargo, c.id);
    }
  }

  const chosenId = escolhaFinal[selectedCargo];

  return (
    <View
      style={[
        styles.container,
        Platform.OS === "web" && styles.containerWeb,
        { paddingTop: topPad },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.title}>Candidatos</Text>
        <Pressable
          onPress={() => setShowSearch(true)}
          hitSlop={12}
          style={styles.searchBtn}
          accessibilityRole="button"
          accessibilityLabel="Buscar candidatos"
        >
          <Text style={styles.searchIcon}>🔍</Text>
        </Pressable>
      </View>

      {/* Cargo tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabRow}
        style={styles.tabScroll}
      >
        {CARGO_ORDER.map((cargo) => {
          const active = cargo === selectedCargo;
          const hasChoice = !!escolhaFinal[cargo];
          return (
            <Pressable
              key={cargo}
              style={[styles.tab, active && styles.tabActive]}
              onPress={() => handleCargoChange(cargo)}
              accessibilityRole="tab"
              accessibilityLabel={CARGO_LABELS[cargo]}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {CARGO_TAB_LABELS[cargo]}
              </Text>
              {hasChoice && (
                <View style={[styles.tabDot, active && styles.tabDotActive]} />
              )}
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Party filter */}
      {allParties.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
          style={styles.filterScroll}
        >
          {allParties.map((p) => {
            const active = partyFilter.includes(p);
            const color = siglaColorHex(p);
            return (
              <Pressable
                key={p}
                style={[
                  styles.filterChip,
                  active && {
                    backgroundColor: color + "18",
                    borderColor: color + "88",
                  },
                ]}
                onPress={() => toggleParty(p)}
                accessibilityRole="button"
                accessibilityLabel={
                  active ? `Remover filtro ${p}` : `Filtrar por ${p}`
                }
              >
                {active && (
                  <View style={[styles.chipDot, { backgroundColor: color }]} />
                )}
                <Text
                  style={[styles.filterChipText, active && { color }]}
                >
                  {p}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      {/* Candidate list */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: botPad + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {displayed.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔎</Text>
            <Text style={styles.emptyText}>Nenhum candidato encontrado</Text>
          </View>
        )}
        {displayed.map((c) => {
          const accent = siglaColorHex(c.partido);
          const isChosen = escolhaFinal[c.cargo] === c.id;
          return (
            <View
              key={c.id}
              style={[styles.row, isChosen && styles.rowChosen]}
            >
              <View
                style={[
                  styles.rowAccent,
                  { backgroundColor: isChosen ? C.agree : accent + "55" },
                ]}
              />
              <CandidateAvatar candidate={c} size={44} accentColor={accent} />
              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>
                  {c.nomeUrna}
                </Text>
                <View style={styles.metaRow}>
                  <View
                    style={[
                      styles.pill,
                      {
                        backgroundColor: accent + "18",
                        borderColor: accent + "55",
                      },
                    ]}
                  >
                    <Text style={[styles.pillText, { color: accent }]}>
                      {c.partido}
                    </Text>
                  </View>
                  <Text style={styles.numero}>{c.numero}</Text>
                </View>
              </View>
              {hasAnswers && (
                <Text
                  style={[styles.pct, { color: matchColor(c.matchScore) }]}
                >
                  {c.matchScore}%
                </Text>
              )}
              <Pressable
                style={[styles.colaBtn, isChosen && styles.colaBtnActive]}
                onPress={() => toggleCola(c)}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={
                  isChosen
                    ? `Remover ${c.nomeUrna} da cola`
                    : `Adicionar ${c.nomeUrna} à cola`
                }
              >
                <Text
                  style={[
                    styles.colaBtnIcon,
                    isChosen && styles.colaBtnIconActive,
                  ]}
                >
                  {isChosen ? "♥" : "♡"}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>

      <SearchModal
        visible={showSearch}
        cargo={selectedCargo}
        candidates={ranked}
        swipedIds={[]}
        savedIds={chosenId ? [chosenId] : []}
        onSave={(id) => setEscolha(selectedCargo, id)}
        onClose={() => setShowSearch(false)}
        onGoToChoice={() => setShowSearch(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.background,
  },
  containerWeb: {
    maxWidth: 480,
    alignSelf: "center",
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 22,
    color: C.primary,
    width: 32,
  },
  title: {
    flex: 1,
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    color: C.text,
    textAlign: "center",
  },
  searchBtn: {
    width: 32,
    alignItems: "flex-end",
  },
  searchIcon: { fontSize: 18 },
  tabScroll: {
    flexGrow: 0,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  tabRow: {
    paddingHorizontal: 14,
    gap: 6,
    paddingBottom: 0,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: C.primary,
  },
  tabText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: C.mutedForeground,
  },
  tabTextActive: {
    fontFamily: "Inter_700Bold",
    color: C.primary,
  },
  tabDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.mutedForeground,
  },
  tabDotActive: {
    backgroundColor: C.primary,
  },
  filterScroll: {
    flexGrow: 0,
    marginTop: 8,
    marginBottom: 4,
  },
  filterRow: {
    paddingHorizontal: 16,
    gap: 7,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: C.card,
    borderWidth: 1.5,
    borderColor: C.border,
  },
  chipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  filterChipText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: C.mutedForeground,
  },
  listContent: {
    paddingTop: 6,
    paddingHorizontal: 16,
  },
  empty: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 10,
  },
  emptyIcon: { fontSize: 32 },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: C.neutral,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 11,
    paddingLeft: 8,
    paddingRight: 4,
    borderBottomWidth: 1,
    borderBottomColor: C.subtleBg,
  },
  rowChosen: {
    backgroundColor: C.agreeLight,
    borderRadius: 12,
    borderBottomWidth: 0,
    marginBottom: 1,
    paddingHorizontal: 8,
  },
  rowAccent: {
    width: 3,
    height: 34,
    borderRadius: 2,
    flexShrink: 0,
  },
  info: { flex: 1, gap: 4, minWidth: 0 },
  name: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: C.text,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pill: {
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
  },
  pillText: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
  },
  numero: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: C.neutral,
    letterSpacing: 0.4,
  },
  pct: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    width: 34,
    textAlign: "right",
    flexShrink: 0,
  },
  colaBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.card,
    borderWidth: 1.5,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  colaBtnActive: {
    backgroundColor: C.agreeBg,
    borderColor: C.agree,
  },
  colaBtnIcon: {
    fontSize: 16,
    color: C.neutral,
  },
  colaBtnIconActive: {
    color: C.agree,
  },
});
