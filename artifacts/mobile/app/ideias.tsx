import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import ideas from "@/src/data/ideas.json";
import { JourneyBar } from "@/src/components/JourneyBar";
import { useSafeInsets } from "@/src/lib/useSafeInsets";
import { useSessionStore } from "@/src/lib/session";
import type { Stance } from "@/src/lib/types";
import { C } from "@/constants/colors";

type IdeaCard = (typeof ideas)[number];

function IdeaCardView({
  card,
  screenW,
  onAnswer,
}: {
  card: IdeaCard;
  screenW: number;
  onAnswer: (stance: Stance) => void;
}) {
  const cardW = Math.min(screenW - 48, 360);
  const swipeThreshold = cardW * 0.35;

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const commitAnswer = useCallback(
    (stance: Stance) => onAnswer(stance),
    [onAnswer]
  );

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY * 0.2;
    })
    .onEnd((e) => {
      if (e.translationX > swipeThreshold) {
        translateX.value = withTiming(screenW * 1.5, { duration: 280 }, () => {
          runOnJS(commitAnswer)(1);
        });
      } else if (e.translationX < -swipeThreshold) {
        translateX.value = withTiming(-screenW * 1.5, { duration: 280 }, () => {
          runOnJS(commitAnswer)(-1);
        });
      } else {
        translateX.value = withSpring(0, { damping: 18, stiffness: 180 });
        translateY.value = withSpring(0, { damping: 18, stiffness: 180 });
      }
    });

  const cardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-screenW / 2, 0, screenW / 2],
      [-12, 0, 12]
    );
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  const agreeOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, swipeThreshold], [0, 1], "clamp"),
  }));

  const disagreeOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-swipeThreshold, 0], [1, 0], "clamp"),
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.card, { width: cardW }, cardStyle]}>
        {/* CONCORDO overlay */}
        <Animated.View style={[styles.overlay, styles.overlayAgree, agreeOverlayStyle]}>
          <Text style={styles.overlayAgreeText}>CONCORDO</Text>
        </Animated.View>
        {/* DISCORDO overlay */}
        <Animated.View style={[styles.overlay, styles.overlayDisagree, disagreeOverlayStyle]}>
          <Text style={styles.overlayDisagreeText}>DISCORDO</Text>
        </Animated.View>

        <View style={styles.cardBody}>
          <Text style={styles.cardEmoji}>{card.emoji}</Text>
          <Text style={styles.cardTema}>{card.tema.toUpperCase()}</Text>
          <Text style={styles.cardStatement}>{card.statement}</Text>
        </View>

        <View style={styles.cardHint}>
          <Text style={styles.hintText}>← discordo · arraste · concordo →</Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

export default function IdeiasScreen() {
  const router = useRouter();
  const setAnswer = useSessionStore((s) => s.setAnswer);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { top: topPad, bottom: botPad } = useSafeInsets();
  const { width: screenW } = useWindowDimensions();

  const cardW = Math.min(screenW - 48, 360);
  const progress = currentIndex / ideas.length;

  const handleAnswer = useCallback(
    (stance: Stance) => {
      const card = ideas[currentIndex];
      setAnswer(card.id, stance);
      if (currentIndex + 1 >= ideas.length) {
        router.replace("/cargos");
      } else {
        setCurrentIndex((i) => i + 1);
      }
    },
    [currentIndex, router, setAnswer]
  );

  const current = ideas[currentIndex];
  const next = ideas[currentIndex + 1];

  return (
    <View style={[styles.container, Platform.OS === "web" && styles.containerWeb, { paddingTop: topPad, paddingBottom: botPad + 8 }]}>
      <View style={styles.bulletRow}>
        <JourneyBar phase="ideias" stepInPhase={currentIndex} />
      </View>

      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Suas ideias</Text>
        <Text style={styles.counter}>
          {currentIndex + 1} / {ideas.length}
        </Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <View style={styles.deck}>
        {/* Next card (background) */}
        {next && (
          <View style={[styles.card, styles.cardNext, { width: cardW }]}>
            <View style={styles.cardBody}>
              <Text style={styles.cardEmoji}>{next.emoji}</Text>
              <Text style={styles.cardTema}>{next.tema.toUpperCase()}</Text>
              <Text style={[styles.cardStatement, { opacity: 0.5 }]}>
                {next.statement}
              </Text>
            </View>
          </View>
        )}

        {/* Current card */}
        {current && (
          <IdeaCardView
            key={current.id}
            card={current}
            screenW={screenW}
            onAnswer={handleAnswer}
          />
        )}
      </View>

      {/* Button row */}
      <View style={styles.buttonRow}>
        <Pressable
          style={[styles.actionBtn, styles.btnDisagree]}
          onPress={() => handleAnswer(-1)}
          accessibilityRole="button"
          accessibilityLabel="Discordo"
        >
          <Text style={styles.actionIcon}>✕</Text>
          <Text style={styles.actionLabel}>Discordo</Text>
        </Pressable>

        <Pressable
          style={[styles.actionBtn, styles.btnNeutral]}
          onPress={() => handleAnswer(0)}
          accessibilityRole="button"
          accessibilityLabel="Neutro"
        >
          <Text style={styles.actionIcon}>—</Text>
          <Text style={styles.actionLabel}>Neutro</Text>
        </Pressable>

        <Pressable
          style={[styles.actionBtn, styles.btnAgree]}
          onPress={() => handleAnswer(1)}
          accessibilityRole="button"
          accessibilityLabel="Concordo"
        >
          <Text style={styles.actionIcon}>✓</Text>
          <Text style={styles.actionLabel}>Concordo</Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.skipBtn}
        onPress={() => router.replace("/cargos")}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Pular para candidatos"
      >
        <Text style={styles.skipText}>Pular para candidatos →</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.background,
    paddingHorizontal: 24,
  },
  containerWeb: {
    maxWidth: 480,
    alignSelf: "center",
    width: "100%",
  },
  bulletRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginBottom: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  backBtn: { marginRight: 8 },
  backText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 22,
    color: C.primary,
  },
  headerTitle: {
    flex: 1,
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
    color: C.text,
  },
  counter: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: C.mutedForeground,
  },
  progressTrack: {
    height: 4,
    backgroundColor: C.border,
    borderRadius: 2,
    marginBottom: 24,
    overflow: "hidden",
  },
  progressFill: {
    height: 4,
    backgroundColor: C.agree,
    borderRadius: 2,
  },
  deck: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    position: "absolute",
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 28,
    shadowColor: C.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    overflow: "hidden",
  },
  cardNext: {
    transform: [{ scale: 0.96 }, { translateY: 16 }],
    opacity: 0.85,
  },
  cardBody: {
    alignItems: "center",
    gap: 14,
    paddingVertical: 12,
  },
  cardEmoji: { fontSize: 60 },
  cardTema: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: C.primary,
    letterSpacing: 1.5,
  },
  cardStatement: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
    color: C.text,
    textAlign: "center",
    lineHeight: 26,
  },
  cardHint: {
    marginTop: 16,
    alignItems: "center",
  },
  hintText: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: C.border,
    letterSpacing: 0.3,
  },
  overlay: {
    position: "absolute",
    top: 24,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 3,
    zIndex: 10,
  },
  overlayAgree: {
    left: 20,
    borderColor: C.agree,
    backgroundColor: "rgba(39,174,96,0.08)",
    transform: [{ rotate: "-8deg" }],
  },
  overlayDisagree: {
    right: 20,
    borderColor: C.disagree,
    backgroundColor: "rgba(231,76,60,0.08)",
    transform: [{ rotate: "8deg" }],
  },
  overlayAgreeText: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: C.agree,
  },
  overlayDisagreeText: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: C.disagree,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  actionBtn: {
    flex: 1,
    maxWidth: 110,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 14,
    gap: 4,
  },
  btnDisagree: {
    backgroundColor: C.disagreeBg,
    borderWidth: 1.5,
    borderColor: C.disagree,
  },
  btnNeutral: {
    backgroundColor: C.subtleBg,
    borderWidth: 1.5,
    borderColor: C.border,
  },
  btnAgree: {
    backgroundColor: C.agreeBg,
    borderWidth: 1.5,
    borderColor: C.agree,
  },
  actionIcon: {
    fontSize: 20,
    color: C.text,
  },
  actionLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: C.text,
  },
  skipBtn: {
    alignItems: "center",
    paddingVertical: 10,
  },
  skipText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: C.mutedForeground,
  },
});
