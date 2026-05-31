import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useMemo, useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { C } from "@/constants/colors";
import ideasRaw from "@/src/data/ideas.json";
import { initials, siglaColorHex } from "@/src/lib/colorHash";
import { alignedThemes, matchColor } from "@/src/lib/matching";
import { useSessionStore } from "@/src/lib/session";
import type { ScoredCandidate, Stance, ThemeId } from "@/src/lib/types";
import { NumberDisplay } from "./NumberDisplay";

const ideasMap = Object.fromEntries(ideasRaw.map((i) => [i.id, i]));

function cardDimensions(screenW: number) {
  const cardW = Math.min(screenW - 40, 340);
  return { cardW, cardH: cardW * 1.5, swipeThreshold: cardW * 0.38 };
}

interface CandidateCardProps {
  candidate: ScoredCandidate;
  answers: ReturnType<typeof useSessionStore>["answers"];
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
}

export function CandidateCard({ candidate, answers, onSwipeRight, onSwipeLeft }: CandidateCardProps) {
  const { width: screenW } = useWindowDimensions();
  const { cardW, cardH, swipeThreshold } = cardDimensions(screenW);

  const [showBack, setShowBack] = useState(false);
  const [imgError, setImgError] = useState(false);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scaleX = useSharedValue(1);
  const isFlipped = useSharedValue(0);

  const handleFlip = useCallback(() => {
    scaleX.value = withTiming(0.01, { duration: 150 }, (done) => {
      if (done) {
        const next = isFlipped.value === 0;
        isFlipped.value = next ? 1 : 0;
        runOnJS(setShowBack)(next);
        scaleX.value = withTiming(1, { duration: 150 });
      }
    });
  }, [scaleX, isFlipped]);

  const commitRight = useCallback(() => onSwipeRight(), [onSwipeRight]);
  const commitLeft = useCallback(() => onSwipeLeft(), [onSwipeLeft]);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY * 0.08;
    })
    .onEnd((e) => {
      const dx = Math.abs(e.translationX);
      const dy = Math.abs(e.translationY);
      if (dx < 8 && dy < 8) {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        return;
      }
      if (e.translationX > swipeThreshold) {
        translateX.value = withTiming(screenW * 1.5, { duration: 260 }, (done) => {
          if (done) runOnJS(commitRight)();
        });
      } else if (e.translationX < -swipeThreshold) {
        translateX.value = withTiming(-screenW * 1.5, { duration: 260 }, (done) => {
          if (done) runOnJS(commitLeft)();
        });
      } else {
        translateX.value = withSpring(0, { damping: 18, stiffness: 180 });
        translateY.value = withSpring(0, { damping: 18, stiffness: 180 });
      }
    });

  const tap = Gesture.Tap()
    .maxDuration(300)
    .maxDistance(20)
    .onEnd((_e, success) => {
      if (success) runOnJS(handleFlip)();
    });

  const gesture = Gesture.Race(pan, tap);

  const cardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-screenW / 2, 0, screenW / 2],
      [-10, 0, 10]
    );
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
        { scaleX: scaleX.value },
      ],
    };
  });

  const saveOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, swipeThreshold], [0, 1], "clamp"),
  }));
  const passOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-swipeThreshold, 0], [1, 0], "clamp"),
  }));

  const bgColor = siglaColorHex(candidate.partido);
  const pct = candidate.matchScore;
  const topAligned = (alignedThemes(answers, candidate.stances) as ThemeId[]).slice(0, 3);

  const proposalLines = useMemo(() => {
    return (Object.entries(candidate.stances) as [ThemeId, Stance][])
      .filter(([, v]) => v !== 0)
      .map(([theme, stance]) => {
        const idea = ideasMap[theme];
        const text =
          stance === 1
            ? idea?.labelCurto ?? theme
            : idea?.labelCurtoNeg ?? `Contra: ${idea?.labelCurto ?? theme}`;
        const userAnswer = answers[theme];
        const aligned =
          userAnswer !== undefined && userAnswer !== 0 && userAnswer === stance;
        const mismatch =
          userAnswer !== undefined && userAnswer !== 0 && userAnswer === -stance;
        return { theme, emoji: idea?.emoji ?? "•", text, aligned, mismatch };
      })
      .sort((a, b) => Number(b.aligned) - Number(a.aligned))
      .slice(0, 6);
  }, [candidate.stances, answers]);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.card, { width: cardW, height: cardH }, cardStyle]}>
        {!showBack ? (
          <>
            {candidate.fotoUrl && !imgError ? (
              <Image
                source={candidate.fotoUrl}
                style={styles.photo}
                contentFit="cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <View style={[styles.bg, { backgroundColor: bgColor + "44" }]}>
                <View style={[styles.bgAccent, { backgroundColor: bgColor + "33" }]} />
                <Text style={[styles.bigInitials, { color: bgColor }]}>
                  {initials(candidate.nomeUrna)}
                </Text>
              </View>
            )}

            <LinearGradient
              colors={["transparent", "rgba(10,18,26,0.72)", "rgba(10,18,26,0.97)"]}
              locations={[0.3, 0.65, 1]}
              style={styles.scrim}
            />

            <View style={styles.partidoPill}>
              <View style={[styles.partidoDot, { backgroundColor: bgColor }]} />
              <Text style={styles.partidoText}>{candidate.partido}</Text>
            </View>

            <Animated.View style={[styles.overlay, styles.overlayAgree, saveOverlayStyle]}>
              <Text style={styles.overlayEmoji}>♥</Text>
              <Text style={styles.overlayLabel}>SALVAR</Text>
            </Animated.View>
            <Animated.View style={[styles.overlay, styles.overlayDisagree, passOverlayStyle]}>
              <Text style={styles.overlayEmoji}>✕</Text>
              <Text style={styles.overlayLabel}>PASSAR</Text>
            </Animated.View>

            <View style={styles.content}>
              <NumberDisplay numero={candidate.numero} color={C.card} fontSize={42} />
              <Text style={styles.nomeUrna} numberOfLines={1}>
                {candidate.nomeUrna}
              </Text>
              {(candidate.ocupacao || candidate.idade) ? (
                <Text style={styles.meta}>
                  {[candidate.ocupacao, candidate.idade ? `${candidate.idade} anos` : null]
                    .filter(Boolean)
                    .join(" · ")}
                </Text>
              ) : null}

              {topAligned.length > 0 && (
                <View style={styles.chipsRow}>
                  {topAligned.map((t) => (
                    <View key={t} style={styles.chip}>
                      <Text style={styles.chipText}>✓ {ideasMap[t]?.tema ?? t}</Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.bottomRow}>
                <Text style={[styles.matchPct, { color: matchColor(pct) }]}>
                  {pct}% match
                </Text>
                <Text style={styles.flipHint}>↻ ver +</Text>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.back}>
            <View style={styles.backHeader}>
              <Text style={styles.backName} numberOfLines={1}>
                {candidate.nomeUrna}
              </Text>
              <View
                style={[
                  styles.backPartido,
                  { borderColor: bgColor + "55", backgroundColor: bgColor + "18" },
                ]}
              >
                <View style={[styles.backPartidoDot, { backgroundColor: bgColor }]} />
                <Text style={[styles.backPartidoText, { color: bgColor }]}>
                  {candidate.partido}
                </Text>
              </View>
            </View>

            <Text style={styles.backTitle}>PRINCIPAIS PROPOSTAS</Text>
            <Text style={styles.backSubtitle}>estimativa por partido</Text>

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
              {proposalLines.map((p) => (
                <View
                  key={p.theme}
                  style={[
                    styles.proposalRow,
                    p.aligned && styles.proposalRowAligned,
                    p.mismatch && styles.proposalRowMismatch,
                  ]}
                >
                  <Text style={styles.proposalEmoji}>{p.emoji}</Text>
                  <Text style={styles.proposalText} numberOfLines={2}>
                    {p.text}
                  </Text>
                  {p.aligned ? (
                    <Text style={styles.proposalCheckAgree}>✓</Text>
                  ) : p.mismatch ? (
                    <Text style={styles.proposalCheckMismatch}>✕</Text>
                  ) : null}
                </View>
              ))}
            </ScrollView>

            <Text style={styles.flipBackHint}>↩ toque para voltar</Text>
            <Text style={styles.disclaimer}>
              Posições estimadas pelo partido — não são declarações oficiais do candidato.
            </Text>
          </View>
        )}
      </Animated.View>
    </GestureDetector>
  );
}

export function cardDimensionsForScreen(screenW: number) {
  return cardDimensions(screenW);
}

const MONO = Platform.select({ ios: "Courier", android: "monospace", default: "monospace" });

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: C.cardDark,
    shadowColor: C.shadowColor,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  photo: {
    ...StyleSheet.absoluteFillObject,
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  bgAccent: {
    position: "absolute",
    width: "100%",
    height: "60%",
    top: 0,
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
  },
  bigInitials: {
    fontSize: 110,
    fontFamily: "Inter_700Bold",
    opacity: 0.35,
  },
  scrim: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "70%",
  },
  partidoPill: {
    position: "absolute",
    top: 16,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(10,18,26,0.6)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  partidoDot: { width: 8, height: 8, borderRadius: 4 },
  partidoText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: C.card,
  },
  overlay: {
    position: "absolute",
    top: 28,
    borderRadius: 10,
    borderWidth: 3,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: "center",
    zIndex: 20,
  },
  overlayAgree: {
    left: 20,
    borderColor: C.agree,
    backgroundColor: "rgba(39,174,96,0.15)",
    transform: [{ rotate: "-10deg" }],
  },
  overlayDisagree: {
    right: 20,
    borderColor: C.disagree,
    backgroundColor: "rgba(231,76,60,0.15)",
    transform: [{ rotate: "10deg" }],
  },
  overlayEmoji: { fontSize: 18, color: C.card },
  overlayLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    color: C.card,
    letterSpacing: 1,
  },
  content: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    gap: 6,
  },
  nomeUrna: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    color: C.card,
    letterSpacing: 0.5,
  },
  meta: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "rgba(255,255,255,0.65)",
  },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 2 },
  chip: {
    backgroundColor: "rgba(39,174,96,0.25)",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "rgba(39,174,96,0.5)",
  },
  chipText: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: C.agree,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  matchPct: { fontFamily: "Inter_600SemiBold", fontSize: 12 },
  flipHint: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: "rgba(255,255,255,0.4)",
  },
  back: {
    flex: 1,
    backgroundColor: C.background,
    padding: 20,
    gap: 8,
  },
  backHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  backName: {
    flex: 1,
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: C.text,
  },
  backPartido: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderWidth: 1,
  },
  backPartidoDot: { width: 7, height: 7, borderRadius: 3.5 },
  backPartidoText: { fontFamily: "Inter_700Bold", fontSize: 12 },
  backTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    color: C.primary,
    letterSpacing: 1.5,
    marginTop: 4,
  },
  backSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: C.neutral,
    marginTop: -4,
  },
  proposalRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 6,
    backgroundColor: C.card,
    borderLeftWidth: 3,
    borderLeftColor: C.border,
  },
  proposalRowAligned: {
    backgroundColor: C.agreeBg,
    borderLeftColor: C.agree,
  },
  proposalRowMismatch: {
    backgroundColor: "rgba(231,76,60,0.10)",
    borderLeftColor: C.disagree,
  },
  proposalEmoji: { fontSize: 18, width: 22, textAlign: "center" },
  proposalText: {
    flex: 1,
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: C.textSecondary,
    lineHeight: 18,
  },
  proposalCheckAgree: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: C.agree,
    width: 16,
    textAlign: "center",
  },
  proposalCheckMismatch: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    color: C.disagree,
    width: 16,
    textAlign: "center",
  },
  flipBackHint: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: C.primary,
    textAlign: "center",
    marginTop: 6,
  },
  disclaimer: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    color: C.border,
    lineHeight: 14,
    textAlign: "center",
  },
});
