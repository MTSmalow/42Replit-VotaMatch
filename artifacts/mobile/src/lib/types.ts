// 12 eixos temáticos (SPEC §5)
export type ThemeId =
  | 'economia'
  | 'rendaSocial'
  | 'amazonia'
  | 'armas'
  | 'corrupcao'
  | 'sus'
  | 'educacao'
  | 'democracia'
  | 'lgbtqia'
  | 'drogas'
  | 'impostos'
  | 'estatais'

// Posição numa afirmação: discordo (-1), neutro (0), concordo (1)
export type Stance = -1 | 0 | 1

// Carta de ideia exibida no swipe
export interface IdeaCard {
  id: ThemeId
  tema: string        // rótulo curto p/ UI
  statement: string   // afirmação que o eleitor avalia (swipe)
  labelCurto: string  // forma curta da posição +1 (verso do candidato)
  labelCurtoNeg?: string // forma curta da posição -1 (proposta oposta)
  emoji?: string
  foto?: string       // caminho da foto do tema (ex.: /fotos/economia.jpg)
}

// Cargos eleitorais
export type Cargo =
  | 'presidente'
  | 'governador'
  | 'senador'
  | 'deputadoFederal'
  | 'deputadoEstadual'

// Candidato — SEM campo "resultado" (estamos em out/2022, pré-votação)
export interface Candidate {
  id: string            // SQ_CANDIDATO do TSE
  nomeUrna: string      // NM_URNA_CANDIDATO
  nomeCompleto: string  // NM_CANDIDATO
  numero: string        // NR_CANDIDATO (string p/ preservar zeros)
  partido: string       // SG_PARTIDO
  cargo: Cargo
  uf: 'SP' | 'BR'
  foto?: string         // URL/placeholder (legacy)
  fotoUrl?: string | number // remote URL (Wikimedia/TSE) or local require() asset (preferred)
  ocupacao?: string     // DS_OCUPACAO
  idade?: number        // calculada de DT_NASCIMENTO (em out/2022)
  // Posições ESTIMADAS por partido (não oficiais — exibir disclaimer)
  stances: Partial<Record<ThemeId, Stance>>
  // Propostas legíveis (futuro: texto real do TSE; hoje derivadas das stances)
  proposals?: string[]
  // Score de compatibilidade — calculado dinamicamente, não persistido
  matchScore?: number
}

// Candidato com score calculado dinamicamente
export type ScoredCandidate = Candidate & { matchScore: number };

// Estado da sessão do usuário (Zustand + persist)
export interface Session {
  answers: Partial<Record<ThemeId, Stance>>
  favorites: Partial<Record<Cargo, string[]>>
  discarded: Partial<Record<Cargo, string[]>>
  escolhaFinal: Partial<Record<Cargo, string>>
}
