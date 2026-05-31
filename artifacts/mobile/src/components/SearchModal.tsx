import React, { useMemo, useState } from "react";
import {
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { C } from "@/constants/colors";
import { CARGO_LABELS } from "@/src/constants/cargo";
import { initials, siglaColorHex } from "@/src/lib/colorHash";
import { matchColor } from "@/src/lib/matching";
import type { Cargo, ScoredCandidate } from "@/src/lib/types";

interface SearchModalProps {
  visible: boolean;
  cargo: Cargo;
  candidates: ScoredCandidate[];
  swipedIds: string[];
  savedIds?: string[];
  onSave: (id: string) => void;
  onClose: () => void;
  onGoToChoice: () => void;
}

export function SearchModal({
  visible,
  cargo,
  candidates,
  swipedIds,
  savedIds = [],
  onSave,
  onClose,
  onGoToChoice,
}: SearchModalProps) {
  const [query, setQuery] = useState("");

  React.useEffect(() => {
    if (!visible) setQuery("");
  }, [visible]);

  const sorted = useMemo(() => {
    const unswiped = candidates.filter((c) => !swipedIds.includes(c.id));
    const swiped = candidates.filter((c) => swipedIds.includes(c.id));
    return [...unswiped, ...swiped];
  }, [candidates, swipedIds]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter(
      (c) =>
        c.nomeUrna.toLowerCase().includes(q) ||
        c.partido.toLowerCase().includes(q) ||
        c.numero.includes(q)
    );
  }, [query, sorted]);

  const unswipedCount = candidates.filter((c) => !swipedIds.includes(c.id)).length;
  const savedCount = savedIds.length;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.backdrop}
        onPress={() => { Keyboard.dismiss(); onClose(); }}
      />

      <View style={styles.sheet}>
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Candidatos</Text>
            <Text style={styles.subtitle}>
              {CARGO_LABELS[cargo]} · {unswipedCount} restantes
              {savedCount > 0 ? ` · ${savedCount} salvo${savedCount > 1 ? "s" : ""}` : ""}
            </Text>
          </View>
          <Pressable
            onPress={onClose}
            hitSlop={16}
            style={styles.closeBtn}
            accessibilityRole="button"
            accessibilityLabel="Fechar busca"
          >
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </View>

        {/* Search input */}
        <View style={styles.inputWrapper}>
          <View style={styles.inputRow}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome, partido ou número…"
              placeholderTextColor={C.border}
              value={query}
              onChangeText={setQuery}
              autoFocus
              clearButtonMode="while-editing"
              returnKeyType="search"
            />
          </View>
        </View>

        {/* Candidate list */}
        <ScrollView
          style={styles.list}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {filtered.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔎</Text>
              <Text style={styles.emptyText}>Nenhum candidato encontrado</Text>
            </View>
          )}
          {filtered.map((c) => {
            const isSwiped = swipedIds.includes(c.id);
            const isSaved = savedIds.includes(c.id);
            const accentColor = siglaColorHex(c.partido);
            return (
              <View key={c.id} style={[styles.row, isSwiped && styles.rowDone]}>
                <View style={[styles.rowAccent, { backgroundColor: matchColor(c.matchScore) }]} />

                <View
                  style={[
                    styles.avatar,
                    { backgroundColor: accentColor + "22", borderColor: accentColor + "55" },
                  ]}
                >
                  <Text style={[styles.avatarText, { color: accentColor }]}>
                    {initials(c.nomeUrna)}
                  </Text>
                </View>

                <View style={styles.info}>
                  <Text style={styles.name} numberOfLines={1}>{c.nomeUrna}</Text>
                  <View style={styles.metaRow}>
                    <View
                      style={[
                        styles.pill,
                        { backgroundColor: accentColor + "18", borderColor: accentColor + "44", borderWidth: 1 },
                      ]}
                    >
                      <Text style={[styles.pillText, { color: accentColor }]}>{c.partido}</Text>
                    </View>
                    <Text style={styles.numero}>{c.numero}</Text>
                  </View>
                </View>

                <Text style={[styles.pct, { color: matchColor(c.matchScore) }]}>
                  {c.matchScore}%
                </Text>

                {isSaved ? (
                  <View style={styles.savedBadge}>
                    <Text style={styles.savedBadgeText}>♥</Text>
                  </View>
                ) : isSwiped ? (
                  <View style={styles.skippedBadge}>
                    <Text style={styles.skippedBadgeText}>–</Text>
                  </View>
                ) : (
                  <Pressable
                    style={styles.saveBtn}
                    onPress={() => onSave(c.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`Salvar ${c.nomeUrna}`}
                  >
                    <Text style={styles.saveBtnIcon}>♥</Text>
                    <Text style={styles.saveBtnText}>Salvar</Text>
                  </Pressable>
                )}
              </View>
            );
          })}
          <View style={{ height: 8 }} />
        </ScrollView>

        {/* Sticky footer */}
        <View style={styles.footer}>
          <Pressable
            style={styles.choiceBtn}
            onPress={() => { onClose(); onGoToChoice(); }}
            accessibilityRole="button"
            accessibilityLabel="Escolher candidato diretamente"
          >
            <Text style={styles.choiceBtnText}>Escolher candidato →</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(13,27,42,0.55)",
  },
  sheet: {
    backgroundColor: C.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "82%",
    paddingTop: 10,
    shadowColor: C.shadowColor,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 16,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.border,
    alignSelf: "center",
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: C.text,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: C.neutral,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.background,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  closeText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: C.mutedForeground,
  },
  inputWrapper: {
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.background,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 8,
    borderWidth: 1.5,
    borderColor: C.inputBorder,
  },
  searchIcon: { fontSize: 14, opacity: 0.6 },
  input: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: C.text,
    padding: 0,
  },
  list: { flex: 1, marginTop: 8 },
  listContent: { paddingHorizontal: 16 },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 8,
  },
  emptyIcon: { fontSize: 32 },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: C.border,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.subtleBg,
    paddingLeft: 6,
  },
  rowDone: { opacity: 0.38 },
  rowAccent: {
    width: 3,
    height: 32,
    borderRadius: 2,
    flexShrink: 0,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: { fontFamily: "Inter_700Bold", fontSize: 14 },
  info: { flex: 1, gap: 4, minWidth: 0 },
  name: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: C.text,
  },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  pill: {
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  pillText: { fontFamily: "Inter_700Bold", fontSize: 10 },
  numero: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: C.neutral,
    letterSpacing: 0.5,
  },
  pct: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    width: 34,
    textAlign: "right",
    flexShrink: 0,
  },
  savedBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: C.agreeBg,
    borderWidth: 1.5,
    borderColor: C.agree,
    alignItems: "center",
    justifyContent: "center",
  },
  savedBadgeText: { fontSize: 14, color: C.agree },
  skippedBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: C.subtleBg,
    alignItems: "center",
    justifyContent: "center",
  },
  skippedBadgeText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: C.border,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: C.primary,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexShrink: 0,
  },
  saveBtnIcon: { fontSize: 13, color: C.card },
  saveBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: C.card,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 28 : 16,
    borderTopWidth: 1,
    borderTopColor: C.subtleBg,
    backgroundColor: C.card,
  },
  choiceBtn: {
    backgroundColor: C.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  choiceBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: C.card,
  },
});
