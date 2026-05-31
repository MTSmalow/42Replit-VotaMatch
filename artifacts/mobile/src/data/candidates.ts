import type { Candidate } from "@/src/lib/types";
import allCandidatesRaw from "./candidates.json";

// Local mockup portraits for candidates without a free remote photo.
// JSON can't hold require() refs, so they are overlaid by id here.
const localPhotos: Record<string, number> = {
  "gov-005": require("../../assets/candidates/vinicius-poit.png"), // Vinícius Poit
  "depest-003": require("../../assets/candidates/professora-bebel.png"), // Professora Bebel
  "depest-006": require("../../assets/candidates/gil-diniz.png"), // Gil Diniz
};

export const allCandidates: Candidate[] = (allCandidatesRaw as Candidate[]).map(
  (c) => (localPhotos[c.id] !== undefined ? { ...c, fotoUrl: localPhotos[c.id] } : c)
);
