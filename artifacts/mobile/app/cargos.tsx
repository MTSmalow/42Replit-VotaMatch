import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Image } from "expo-image";

import { allCandidates } from "@/src/data/candidates";
import { JourneyBar } from "@/src/components/JourneyBar";
import { CandidateCard, cardDimensionsForScreen } from "@/src/components/CandidateCard";
import { ChoicePanel } from "@/src/components/ChoicePanel";
import { SearchModal } from "@/src/components/SearchModal";
import { CARGO_ORDER, CARGO_LABELS, HAS_FILTER, TOP_N } from "@/src/constants/cargo";
import { initials, siglaColorHex } from "@/src/lib/colorHash";
import { CandidateAvatar } from "@/src/components/CandidateAvatar";
import { matchPct } from "@/src/lib/matching";
import { useSessionStore } from "@/src/lib/session";
import { useSafeInsets } from "@/src/lib/useSafeInsets";
import type { Candidate, Cargo } from "@/src/lib/types";
import { C } from "@/constants/colors";

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function CargosScreen() {
  const router = useRouter();
  const { top: topPad, bottom: botPad } = useSafeInsets();

  const { width: screenW } = useWindowDimensions();
  const { cardW, cardH } = cardDimensionsForScreen(screenW);

  const [step, setStep] = useState(0);
  const [swipedIds, setSwipedIds] = useState<string[]>([]);
  const [savedThisStep, setSavedThisStep] = useState<string[]>([]);
  const [partidoFilter, setPartidoFilter] = useState<string[]>([]);
  const [showChoice, setShowChoice] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const cargo = CARGO_ORDER[step];
  const answers = useSessionStore((s) => s.answers);
  const setEscolha = useSessionStore((s) => s.setEscolha);
  const saveCandidate = useSessionStore((s) => s.saveCandidate);
  const discardCandidate = useSessionStore((s) => s.discardCandidate);

  const ranked = useMemo(() => {
    let pool = allCandidates
      .filter((c) => c.cargo === cargo)
      .map((c) => ({ ...c, matchScore: matchPct(answers, c.stances) }))
      .sort((a, b) => b.matchScore - a.matchScore);
    if (HAS_FILTER[cargo] && partidoFilter.length > 0) {
      pool = pool.filter((c) => partidoFilter.includes(c.partido));
    }
    return pool.slice(0, TOP_N[cargo]);
  }, [cargo, answers, partidoFilter]);

  const allParties = useMemo(
    () => [...new Set(allCandidates.filter((c) => c.cargo === cargo).map((c) => c.partido))].sort(),
    [cargo]
  );

  const remaining = ranked.filter((c) => !swipedIds.includes(c.id));
  const topCard = remaining[remaining.length - 1];
  const nextCard = remaining[remaining.length - 2];

  function advanceStep() {
    setSwipedIds([]);
    setSavedThisStep([]);
    setPartidoFilter([]);
    setShowChoice(false);
    if (step + 1 >= CARGO_ORDER.length) {
      router.replace("/cola");
    } else {
      setStep((s) => s + 1);
    }
  }

  const handleSave = useCallback(
    (id: string) => {
      saveCandidate(cargo, id);
      setSavedThisStep((prev) => [...prev, id]);
      setSwipedIds((prev) => {
        const next = [...prev, id];
        if (next.length >= ranked.length) setShowChoice(true);
        return next;
      });
    },
    [cargo, ranked.length, saveCandidate]
  );

  const handleDiscard = useCallback(
    (id: string) => {
      discardCandidate(cargo, id);
      setSwipedIds((prev) => {
        const next = [...prev, id];
        if (next.length >= ranked.length) setShowChoice(true);
        return next;
      });
    },
    [cargo, ranked.length, discardCandidate]
  );

  function handleChoose(id: string) {
    setEscolha(cargo, id);
    advanceStep();
  }

  function togglePartyFilter(p: string) {
    setPartidoFilter((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
    setSwipedIds([]);
    setSavedThisStep([]);
    setShowChoice(false);
  }

  const isLastStep = step === CARGO_ORDER.length - 1;

  return (
    <View style={[styles.container, Platform.OS === "web" && styles.containerWeb, { paddingTop: topPad }]}>
      {/* Journey progress */}
      <View style={styles.stepperRow}>
        <JourneyBar phase="cargos" stepInPhase={step} />
        <Text style={styles.stepLabel}>{step + 1}/5</Text>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.cargoTitle}>{CARGO_LABELS[cargo].toUpperCase()}</Text>
        <Text style={styles.candidateCounter}>
          {Math.min(swipedIds.length + 1, ranked.length)}/{ranked.length}
        </Text>
      </View>

      {/* Candidate progress bar */}
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${(swipedIds.length / Math.max(ranked.length, 1)) * 100}%` as `${number}%` },
          ]}
        />
      </View>

      {/* Party filter (deputados only) */}
      {HAS_FILTER[cargo] && (
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>⌗ partido</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {allParties.map((p) => {
              const active = partidoFilter.includes(p);
              return (
                <Pressable
                  key={p}
                  style={[styles.filterChip, active && styles.filterChipActive]}
                  onPress={() => togglePartyFilter(p)}
                  accessibilityRole="button"
                  accessibilityLabel={active ? `Remover filtro ${p}` : `Filtrar por ${p}`}
                >
                  <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                    {p}{active ? " ✕" : ""}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Deck or Choice panel */}
      {!showChoice ? (
        <View style={styles.deckOuter}>
          <View style={[styles.deckWrapper, { width: cardW, height: cardH + 18 }]}>
            {/* Background card (next) */}
            {nextCard && (
              <View
                style={{
                  position: "absolute",
                  width: cardW,
                  height: cardH,
                  top: 18,
                  borderRadius: 28,
                  overflow: "hidden",
                  backgroundColor: C.cardDark,
                  transform: [{ scale: 0.95 }],
                  opacity: 0.7,
                }}
              >
                {nextCard.fotoUrl ? (
                  <Image
                    source={nextCard.fotoUrl}
                    style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
                    contentFit="cover"
                  />
                ) : (
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: siglaColorHex(nextCard.partido) + "44",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ fontSize: 110, fontFamily: "Inter_700Bold", opacity: 0.35, color: siglaColorHex(nextCard.partido) }}>
                      {initials(nextCard.nomeUrna)}
                    </Text>
                  </View>
                )}
              </View>
            )}
            {/* Top card */}
            {topCard ? (
              <CandidateCard
                key={topCard.id}
                candidate={topCard}
                answers={answers}
                onSwipeRight={() => handleSave(topCard.id)}
                onSwipeLeft={() => handleDiscard(topCard.id)}
              />
            ) : (
              <View style={[styles.emptyDeck, { width: cardW, height: cardH }]}>
                <Text style={styles.emptyText}>—</Text>
              </View>
            )}
          </View>

          {/* Action buttons */}
          <View style={styles.actionRow}>
            <Pressable
              style={[styles.actionBtn, styles.actionPass]}
              onPress={() => topCard && handleDiscard(topCard.id)}
              accessibilityRole="button"
              accessibilityLabel="Passar"
            >
              <Text style={styles.actionPassIcon}>✕</Text>
              <Text style={styles.actionPassLabel}>Passar</Text>
            </Pressable>
            <Pressable
              style={[styles.actionBtn, styles.actionSearch]}
              onPress={() => setShowSearch(true)}
              accessibilityRole="button"
              accessibilityLabel="Buscar candidatos"
            >
              <Text style={styles.actionSearchIcon}>🔍</Text>
              <Text style={styles.actionSearchLabel}>Buscar</Text>
            </Pressable>
            <Pressable
              style={[styles.actionBtn, styles.actionSave]}
              onPress={() => topCard && handleSave(topCard.id)}
              accessibilityRole="button"
              accessibilityLabel="Salvar candidato"
            >
              <Text style={styles.actionSaveIcon}>♥</Text>
              <Text style={styles.actionSaveLabel}>Salvar</Text>
            </Pressable>
          </View>

          <Pressable
            style={styles.skipBtn}
            onPress={() => setShowChoice(true)}
            accessibilityRole="button"
            accessibilityLabel={remaining.length > 0 ? `Pular ${remaining.length} restantes` : "Escolher candidato"}
          >
            <Text style={styles.skipBtnText}>
              {remaining.length > 0
                ? `Pular restantes (${remaining.length}) →`
                : "Escolher candidato →"}
            </Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[styles.choiceScroll, { paddingBottom: botPad + 24 }]}
          showsVerticalScrollIndicator={false}
        >
          <ChoicePanel
            cargo={cargo}
            candidates={ranked}
            saved={savedThisStep}
            onChoose={handleChoose}
          />
          <Pressable
            style={[styles.skipBtn, { marginTop: 16, alignSelf: "center" }]}
            onPress={advanceStep}
            accessibilityRole="button"
            accessibilityLabel={isLastStep ? "Ver cola" : `Pular para ${CARGO_LABELS[CARGO_ORDER[step + 1]]}`}
          >
            <Text style={styles.skipBtnText}>
              Pular este cargo → {isLastStep ? "Ver cola" : CARGO_LABELS[CARGO_ORDER[step + 1]]}
            </Text>
          </Pressable>
        </ScrollView>
      )}

      <SearchModal
        visible={showSearch}
        cargo={cargo}
        candidates={ranked}
        swipedIds={swipedIds}
        savedIds={savedThisStep}
        onSave={handleSave}
        onClose={() => setShowSearch(false)}
        onGoToChoice={() => setShowChoice(true)}
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
  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    marginBottom: 10,
    paddingHorizontal: 24,
  },
  stepLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: C.mutedForeground,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 6,
  },
  backBtn: { width: 32 },
  backText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 22,
    color: C.primary,
  },
  cargoTitle: {
    flex: 1,
    fontFamily: "Inter_700Bold",
    fontSize: 17,
    color: C.text,
    textAlign: "center",
    letterSpacing: 1,
  },
  candidateCounter: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: C.mutedForeground,
    width: 36,
    textAlign: "right",
  },
  progressTrack: {
    height: 4,
    backgroundColor: C.border,
    borderRadius: 2,
    marginHorizontal: 20,
    marginBottom: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: 4,
    backgroundColor: C.agree,
    borderRadius: 2,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingLeft: 20,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingRight: 20,
  },
  filterLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: C.neutral,
    marginRight: 8,
    flexShrink: 0,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: C.card,
    borderWidth: 1.5,
    borderColor: C.border,
  },
  filterChipActive: {
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  filterChipText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: C.mutedForeground,
  },
  filterChipTextActive: { color: C.card },
  deckOuter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  deckWrapper: {
    position: "relative",
    alignItems: "center",
  },
  choiceScroll: {
    paddingTop: 8,
    paddingHorizontal: 0,
  },
  emptyDeck: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.card,
    borderRadius: 28,
  },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: C.neutral,
  },
  actionRow: {
    flexDirection: "row",
    gap: 24,
    marginTop: 20,
  },
  actionBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
    gap: 2,
  },
  actionPass: { backgroundColor: C.card, borderWidth: 2, borderColor: C.disagree },
  actionSearch: { backgroundColor: C.card, borderWidth: 2, borderColor: C.primary },
  actionSave: { backgroundColor: C.card, borderWidth: 2, borderColor: C.agree },
  actionPassIcon: { fontSize: 20, color: C.disagree },
  actionPassLabel: { fontFamily: "Inter_500Medium", fontSize: 10, color: C.disagree },
  actionSearchIcon: { fontSize: 18 },
  actionSearchLabel: { fontFamily: "Inter_500Medium", fontSize: 10, color: C.primary },
  actionSaveIcon: { fontSize: 20, color: C.agree },
  actionSaveLabel: { fontFamily: "Inter_500Medium", fontSize: 10, color: C.agree },
  skipBtn: {
    marginTop: 14,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  skipBtnText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: C.neutral,
    textDecorationLine: "underline",
  },
});
