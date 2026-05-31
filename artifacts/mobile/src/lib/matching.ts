import type { Stance, ThemeId } from './types'

// Proximidade (modelo Wahl-O-Mat) — SPEC §6.
// Calcula só sobre os temas respondidos pelo eleitor. Retorno 0..100.
export function matchPct(
  u: Partial<Record<ThemeId, Stance>>,
  s: Partial<Record<ThemeId, Stance>>
): number {
  const themes = (Object.keys(u) as ThemeId[]).filter((t) => u[t] !== undefined)
  if (themes.length === 0) return 0
  let pts = 0
  for (const t of themes) {
    const sv = s[t] ?? 0
    pts += 2 - Math.abs(u[t]! - sv) // 0..2 por tema
  }
  return Math.round((pts / (2 * themes.length)) * 100)
}

// Cor do match% por tier: ≥70 verde, 40–69 amarelo, <40 cinza.
export function matchColor(pct: number): string {
  if (pct >= 70) return '#27AE60'
  if (pct >= 40) return '#F39C12'
  return '#95A5A6'
}

// Temas onde eleitor e candidato concordam (mesma posição, não-neutra).
export function alignedThemes(
  u: Partial<Record<ThemeId, Stance>>,
  s: Partial<Record<ThemeId, Stance>>
): ThemeId[] {
  return (Object.keys(u) as ThemeId[]).filter(
    (t) => u[t] !== undefined && u[t] !== 0 && u[t] === (s[t] ?? 0)
  )
}
