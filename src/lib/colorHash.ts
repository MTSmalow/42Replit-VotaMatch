// Cor-hash estável por sigla (HSL) — DECORATIVA, não a cor oficial do partido.
// Usada para o ponto na barra de partido e o fallback de avatar.
export function siglaColor(sigla: string): string {
  let h = 0
  for (let i = 0; i < sigla.length; i++) {
    h = (h * 31 + sigla.charCodeAt(i)) % 360
  }
  return `hsl(${h} 55% 50%)`
}

export function siglaColorSoft(sigla: string): string {
  let h = 0
  for (let i = 0; i < sigla.length; i++) {
    h = (h * 31 + sigla.charCodeAt(i)) % 360
  }
  return `hsl(${h} 45% 32%)`
}

export function initials(nome: string): string {
  const parts = nome.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
