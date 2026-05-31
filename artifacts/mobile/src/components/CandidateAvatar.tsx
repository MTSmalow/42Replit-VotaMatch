import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { initials, siglaColorHex } from "@/src/lib/colorHash";
import type { Candidate } from "@/src/lib/types";

interface CandidateAvatarProps {
  candidate: Candidate;
  size?: number;
  accentColor?: string;
}

export function CandidateAvatar({ candidate, size = 40, accentColor }: CandidateAvatarProps) {
  const color = accentColor ?? siglaColorHex(candidate.partido);
  const radius = size / 2;

  return (
    <View
      style={[
        styles.wrapper,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: color + "22",
          borderColor: color + "66",
        },
      ]}
    >
      <Text style={[styles.initials, { color, fontSize: size * 0.35 }]}>
        {initials(candidate.nomeUrna)}
      </Text>
      {candidate.fotoUrl ? (
        <Image
          source={candidate.fotoUrl}
          style={[StyleSheet.absoluteFillObject, { borderRadius: radius }]}
          contentFit="cover"
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  initials: {
    fontFamily: "Inter_700Bold",
  },
});
