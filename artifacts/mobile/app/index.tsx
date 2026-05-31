import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { C } from "@/constants/colors";
import { useSafeInsets } from "@/src/lib/useSafeInsets";
import { useSessionStore } from "@/src/lib/session";

const ICON = require("../assets/images/icon.png");

export default function LandingScreen() {
  const router = useRouter();
  const { top: topPad, bottom: botPad } = useSafeInsets();
  const escolhaFinal = useSessionStore((s) => s.escolhaFinal);
  const hasCola = Object.keys(escolhaFinal).length > 0;

  return (
    <View style={[styles.container, Platform.OS === "web" && styles.containerWeb, { paddingTop: topPad, paddingBottom: botPad + 16 }]}>

      {/* Minha Cola shortcut — visible only when at least one cargo was chosen */}
      {hasCola && (
        <Pressable
          style={[styles.colaFab, { top: topPad + 8 }]}
          onPress={() => router.push("/cola")}
          accessibilityRole="button"
          accessibilityLabel="Minha Cola"
        >
          <Text style={styles.colaFabIcon}>📋</Text>
          <Text style={styles.colaFabLabel}>Minha Cola</Text>
        </Pressable>
      )}
      <View style={{ flex: 1 }} />

      {/* Logo + Wordmark */}
      <View style={styles.heroSection}>
        <View style={styles.iconWrapper}>
          <Image source={ICON} style={styles.icon} resizeMode="contain" />
        </View>
        <Text style={styles.wordmark}>VotaMatch</Text>
        <Text style={styles.region}>Brasil · 2026</Text>
      </View>

      {/* Tagline */}
      <View style={styles.taglineSection}>
        <Text style={styles.tagline}>
          Encontre candidatos que{"\n"}pensam como você
        </Text>
        <Text style={styles.subtitle}>
          Responda 12 perguntas sobre temas que importam e veja o quanto cada candidato se alinha com suas posições — cargo por cargo.
        </Text>
      </View>

      <View style={{ flex: 1.5 }} />

      {/* Disclaimer */}
      <View style={styles.disclaimerBox}>
        <View style={styles.disclaimerDot} />
        <Text style={styles.disclaimerText}>
          As posições dos candidatos são <Text style={styles.bold}>estimadas por partido</Text>, não declarações oficiais. Use como orientação, não como fato.
        </Text>
      </View>

      {/* CTA */}
      <Pressable
        style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaPressed]}
        onPress={() => router.push("/ideias")}
        accessibilityRole="button"
        accessibilityLabel="Começar"
      >
        <Text style={styles.ctaText}>Começar</Text>
      </Pressable>

      {/* Secondary */}
      <Pressable
        style={({ pressed }) => [styles.secondaryButton, pressed && styles.ctaPressed]}
        onPress={() => router.push("/candidatos")}
        accessibilityRole="button"
        accessibilityLabel="Ver candidatos"
      >
        <Text style={styles.secondaryText}>Ver candidatos</Text>
      </Pressable>

      <Text style={styles.footerNote}>Pré-eleição · Outubro 2026</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.background,
    paddingHorizontal: 28,
    alignItems: "center",
  },
  containerWeb: {
    maxWidth: 480,
    alignSelf: "center",
    width: "100%",
  },
  heroSection: {
    alignItems: "center",
    gap: 8,
  },
  iconWrapper: {
    width: 88,
    height: 88,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: C.card,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 4,
  },
  icon: { width: 88, height: 88 },
  wordmark: {
    fontFamily: "Inter_700Bold",
    fontSize: 38,
    color: C.primary,
    letterSpacing: -1,
  },
  region: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: C.agree,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  taglineSection: {
    alignItems: "center",
    marginTop: 36,
    gap: 14,
  },
  tagline: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 24,
    color: C.text,
    textAlign: "center",
    lineHeight: 32,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: C.subtitleText,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  disclaimerBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: C.secondary,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 20,
    gap: 10,
    width: "100%",
  },
  disclaimerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.primary,
    marginTop: 4,
    flexShrink: 0,
  },
  disclaimerText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: C.textSecondary,
    lineHeight: 19,
    flex: 1,
  },
  bold: { fontFamily: "Inter_600SemiBold" },
  ctaButton: {
    width: "100%",
    backgroundColor: C.primary,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 8,
    marginBottom: 10,
  },
  secondaryButton: {
    width: "100%",
    backgroundColor: "transparent",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: C.primary,
    marginBottom: 16,
  },
  secondaryText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: C.primary,
  },
  ctaPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  ctaText: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: C.card,
    letterSpacing: 0.3,
  },
  footerNote: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: C.neutral,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  colaFab: {
    position: "absolute",
    left: 16,
    alignItems: "center",
    backgroundColor: C.primary,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 2,
    shadowColor: C.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 6,
    zIndex: 10,
  },
  colaFabIcon: { fontSize: 20 },
  colaFabLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    color: C.card,
    letterSpacing: 0.3,
  },
});
