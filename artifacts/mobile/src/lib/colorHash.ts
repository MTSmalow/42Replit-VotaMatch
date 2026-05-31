// Cor-hash estável por sigla (HSL) — DECORATIVA, não a cor oficial do partido.
// Usada para o ponto na barra de partido e o fallback de avatar.
export function siglaColor(sigla: string): string {
  let h = 0
  for (let i = 0; i < sigla.length; i++) {
    h = (h * 31 + sigla.charCodeAt(i)) % 360
  }
  return `hsl(${h}, 55%, 50%)`
}

export function siglaColorSoft(sigla: string): string {
  let h = 0
  for (let i = 0; i < sigla.length; i++) {
    h = (h * 31 + sigla.charCodeAt(i)) % 360
  }
  return `hsl(${h}, 45%, 32%)`
}

export function siglaColorHex(sigla: string): string {
  let h = 0
  for (let i = 0; i < sigla.length; i++) {
    h = (h * 31 + sigla.charCodeAt(i)) % 360
  }
  // Compute a stable colour from the hue and return it as a real `#RRGGBB` hex.
  // Hex (not `rgb(...)`) is required so callers can append an alpha suffix —
  // e.g. `accentColor + "22"` → `#RRGGBB22` — which only works with hex strings.
  const r = Math.round(128 + 80 * Math.cos((h * Math.PI) / 180))
  const g = Math.round(128 + 80 * Math.cos(((h - 120) * Math.PI) / 180))
  const b = Math.round(128 + 80 * Math.cos(((h - 240) * Math.PI) / 180))
  const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, "0")
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export function initials(nome: string): string {
  const parts = nome.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
