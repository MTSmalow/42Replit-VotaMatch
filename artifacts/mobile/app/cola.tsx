import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import { allCandidates } from "@/src/data/candidates";
import { JourneyBar } from "@/src/components/JourneyBar";
import { NumberDisplay } from "@/src/components/NumberDisplay";
import { CARGO_ORDER, CARGO_LABELS, CARGO_DIGITS } from "@/src/constants/cargo";
import { siglaColorHex } from "@/src/lib/colorHash";
import { CandidateAvatar } from "@/src/components/CandidateAvatar";
import { useSafeInsets } from "@/src/lib/useSafeInsets";
import { useSessionStore } from "@/src/lib/session";
import type { Candidate, Cargo } from "@/src/lib/types";
import { C } from "@/constants/colors";

const ELEICAO_LABEL = "Eleições Brasil · Outubro 2026";

function notify(message: string) {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") window.alert(message);
  } else {
    Alert.alert("Minha Cola", message);
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildColaHtml(rows: { cargo: Cargo; candidate: Candidate }[]): string {
  const cards = rows
    .map(({ cargo, candidate }) => {
      const accent = siglaColorHex(candidate.partido);
      const cargoLabel = escapeHtml(CARGO_LABELS[cargo].toUpperCase());
      const nome = escapeHtml(candidate.nomeUrna);
      const numero = escapeHtml(candidate.numero);
      const sigla = escapeHtml(candidate.partido);
      const meta = escapeHtml(
        [candidate.ocupacao, candidate.idade ? `${candidate.idade} anos` : null]
          .filter(Boolean)
          .join(" · ")
      );
      return `
        <div class="card" style="border-left: 6px solid ${accent};">
          <div class="card-top">
            <span class="cargo">${cargoLabel}</span>
            <span class="pill" style="background:${accent}22; border:1px solid ${accent}55; color:${accent};">
              <span class="dot" style="background:${accent};"></span>${sigla}
            </span>
          </div>
          <div class="numero" style="color:${accent};">${numero}</div>
          <div class="nome">${nome}</div>
          ${meta ? `<div class="meta">${meta}</div>` : ""}
        </div>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body { font-family: -apple-system, Helvetica, Arial, sans-serif; color: #0a121a; padding: 24px 26px; }
  h1 { font-size: 23px; margin: 0 0 3px; }
  .subtitle { font-size: 12px; color: #6b7785; margin: 0 0 16px; }
  .card { border-radius: 12px; background: #f7f9fb; padding: 11px 16px; margin-bottom: 9px; page-break-inside: avoid; }
  .card:last-of-type { margin-bottom: 0; }
  .card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
  .cargo { font-size: 10px; font-weight: 700; letter-spacing: 1.2px; color: #6b7785; }
  .pill { display: inline-flex; align-items: center; gap: 6px; border-radius: 12px; padding: 3px 10px; font-size: 11px; font-weight: 700; }
  .dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; }
  .numero { font-family: "Courier New", monospace; font-size: 32px; font-weight: 800; letter-spacing: 4px; margin: 1px 0; }
  .nome { font-size: 16px; font-weight: 700; }
  .meta { font-size: 11px; color: #6b7785; margin-top: 1px; }
  .disclaimer { font-size: 10px; color: #8a949f; line-height: 1.45; margin-top: 14px; border-top: 1px solid #e3e8ee; padding-top: 11px; }
</style>
</head>
<body>
  <h1>Minha Cola</h1>
  <p class="subtitle">${escapeHtml(ELEICAO_LABEL)}</p>
  ${cards}
  <p class="disclaimer">⚠️ As posições dos candidatos são estimativas baseadas no partido, não declarações oficiais. Digite o número exatamente como aparece, confirme, e repita para cada cargo na ordem da urna.</p>
</body>
</html>`;
}

// ─── CargoRow ─────────────────────────────────────────────────────────────────
function CargoRow({ cargo, candidate }: { cargo: Cargo; candidate: Candidate }) {
  const accentColor = siglaColorHex(candidate.partido);
  return (
    <View style={rowStyles.card}>
      <View style={[rowStyles.accent, { backgroundColor: accentColor }]} />

      <View style={rowStyles.body}>
        <View style={rowStyles.topRow}>
          <Text style={rowStyles.cargoLabel}>{CARGO_LABELS[cargo].toUpperCase()}</Text>
          <View
            style={[
              rowStyles.pill,
              { backgroundColor: accentColor + "22", borderColor: accentColor + "55" },
            ]}
          >
            <View style={[rowStyles.pillDot, { backgroundColor: accentColor }]} />
            <Text style={[rowStyles.pillText, { color: accentColor }]}>{candidate.partido}</Text>
          </View>
        </View>

        <NumberDisplay numero={candidate.numero} color={accentColor} fontSize={52} />

        <Text style={rowStyles.name}>{candidate.nomeUrna}</Text>
        {(candidate.ocupacao || candidate.idade) ? (
          <Text style={rowStyles.meta}>
            {[candidate.ocupacao, candidate.idade ? `${candidate.idade} anos` : null]
              .filter(Boolean)
              .join(" · ")}
          </Text>
        ) : null}
      </View>

      <CandidateAvatar candidate={candidate} size={44} accentColor={accentColor} />
    </View>
  );
}

const rowStyles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.card,
    borderRadius: 18,
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 18,
    paddingLeft: 22,
    shadowColor: C.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    gap: 12,
  },
  accent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  body: { flex: 1, gap: 2 },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  cargoLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    color: C.neutral,
    letterSpacing: 1.2,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
  },
  pillDot: { width: 6, height: 6, borderRadius: 3 },
  pillText: { fontFamily: "Inter_700Bold", fontSize: 11 },
  name: {
    fontFamily: "Inter_700Bold",
    fontSize: 17,
    color: C.text,
    marginTop: 2,
  },
  meta: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: C.neutral,
    marginTop: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: { fontFamily: "Inter_700Bold", fontSize: 15 },
});

// ─── EmptyRow ─────────────────────────────────────────────────────────────────
function EmptyRow({ cargo }: { cargo: Cargo }) {
  return (
    <View style={emptyStyles.row}>
      <View style={emptyStyles.badge}>
        <Text style={emptyStyles.badgeText}>{CARGO_DIGITS[cargo]}×</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={emptyStyles.label}>{CARGO_LABELS[cargo].toUpperCase()}</Text>
        <Text style={emptyStyles.hint}>não escolhido</Text>
      </View>
    </View>
  );
}

const emptyStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginHorizontal: 20,
    marginBottom: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: C.card,
    borderRadius: 14,
    opacity: 0.5,
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.faintBg,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    color: C.border,
  },
  label: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    color: C.border,
    letterSpacing: 1.1,
  },
  hint: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: C.border,
  },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ColaScreen() {
  const router = useRouter();
  const { top: topPad, bottom: botPad } = useSafeInsets();

  const escolhaFinal = useSessionStore((s) => s.escolhaFinal);
  const reset = useSessionStore((s) => s.reset);

  const choices = useMemo(() => {
    return CARGO_ORDER.map((cargo) => {
      const id = escolhaFinal[cargo];
      const candidate = id ? allCandidates.find((c) => c.id === id) ?? null : null;
      return { cargo, candidate };
    });
  }, [escolhaFinal]);

  const chosenCount = choices.filter((c) => c.candidate !== null).length;
  const [generating, setGenerating] = useState(false);

  function handleRestart() {
    reset();
    router.replace("/");
  }

  async function handleDownloadPdf() {
    const rows = choices.filter(
      (c): c is { cargo: Cargo; candidate: Candidate } => c.candidate !== null
    );
    if (rows.length === 0) {
      notify("Escolha ao menos um candidato antes de baixar a cola.");
      return;
    }
    if (generating) return;
    setGenerating(true);
    try {
      const html = buildColaHtml(rows);
      if (Platform.OS === "web") {
        await Print.printAsync({ html });
      } else {
        const { uri } = await Print.printToFileAsync({ html });
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, {
            mimeType: "application/pdf",
            dialogTitle: "Minha Cola",
            UTI: "com.adobe.pdf",
          });
        } else {
          notify("Não foi possível compartilhar o PDF neste dispositivo.");
        }
      }
    } catch {
      notify("Não foi possível gerar o PDF. Tente novamente.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <View style={[styles.container, Platform.OS === "web" && styles.containerWeb, { paddingTop: topPad }]}>
      <View style={styles.journeyRow}>
        <JourneyBar phase="cola" stepInPhase={0} />
      </View>

      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Minha Cola</Text>
          <Text style={styles.subtitle}>Eleições Brasil · Outubro 2026</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.summaryRow}>
        <View style={[styles.summaryPill, chosenCount === 5 ? styles.pillFull : styles.pillPartial]}>
          <Text style={[styles.summaryText, chosenCount === 5 ? styles.pillFullText : styles.pillPartialText]}>
            {chosenCount === 0
              ? "Nenhum cargo escolhido"
              : chosenCount === 5
              ? "Cola completa ✓"
              : `${chosenCount} de 5 cargos`}
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: botPad + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardsSection}>
          {choices.map(({ cargo, candidate }) =>
            candidate ? (
              <CargoRow key={cargo} cargo={cargo} candidate={candidate} />
            ) : (
              <EmptyRow key={cargo} cargo={cargo} />
            )
          )}
        </View>

        <View style={styles.howTo}>
          <Text style={styles.howToTitle}>Na urna eletrônica</Text>
          <Text style={styles.howToBody}>
            Digite o número do candidato exatamente como aparece acima, confirme, e repita para cada cargo — na ordem da urna.
          </Text>
        </View>

        <View style={styles.actionsBlock}>
          <Pressable
            style={[styles.ctaPrimary, (generating || chosenCount === 0) && styles.ctaDisabled]}
            onPress={handleDownloadPdf}
            disabled={generating}
            accessibilityRole="button"
            accessibilityLabel="Baixar PDF da cola"
          >
            <Text style={styles.ctaPrimaryText}>
              {generating ? "Gerando PDF…" : "Baixar PDF"}
            </Text>
          </Pressable>
          {chosenCount < 5 && (
            <Pressable
              style={styles.ctaSecondary}
              onPress={() => router.replace("/cargos")}
              accessibilityRole="button"
              accessibilityLabel="Completar escolhas"
            >
              <Text style={styles.ctaSecondaryText}>Completar escolhas →</Text>
            </Pressable>
          )}
          <Pressable
            style={styles.ctaGhost}
            onPress={handleRestart}
            accessibilityRole="button"
            accessibilityLabel="Recomeçar"
          >
            <Text style={styles.ctaGhostText}>Recomeçar</Text>
          </Pressable>
        </View>
      </ScrollView>
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
  journeyRow: {
    alignItems: "center",
    paddingVertical: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 6,
  },
  backText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 22,
    color: C.primary,
    width: 32,
  },
  titleBlock: { flex: 1, alignItems: "center" },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    color: C.text,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: C.neutral,
    marginTop: 2,
  },
  summaryRow: {
    alignItems: "center",
    paddingVertical: 12,
  },
  summaryPill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  pillFull: { backgroundColor: C.agreeLight, borderColor: C.agree },
  pillPartial: { backgroundColor: C.secondary, borderColor: C.primary },
  summaryText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
  pillFullText: { color: C.agree },
  pillPartialText: { color: C.primary },
  cardsSection: {
    paddingTop: 4,
    paddingBottom: 8,
  },
  howTo: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    backgroundColor: C.secondary,
    borderRadius: 14,
    borderLeftWidth: 4,
    borderLeftColor: C.primary,
  },
  howToTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    color: C.primary,
    marginBottom: 4,
  },
  howToBody: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: C.textSecondary,
    lineHeight: 20,
  },
  actionsBlock: {
    paddingHorizontal: 20,
    gap: 10,
  },
  ctaPrimary: {
    backgroundColor: C.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaPrimaryText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: C.card,
  },
  ctaSecondary: {
    backgroundColor: "transparent",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: C.primary,
  },
  ctaSecondaryText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: C.primary,
  },
  ctaDisabled: {
    opacity: 0.5,
  },
  ctaGhost: {
    backgroundColor: "transparent",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  ctaGhostText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: C.neutral,
  },
});
