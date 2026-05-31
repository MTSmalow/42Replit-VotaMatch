import type { Candidate, IdeaCard, Stance, ThemeId } from '../lib/types'
import { matchColorClass, alignedThemes } from '../lib/matching'
import { siglaColor, siglaColorSoft, initials } from '../lib/colorHash'
import ideasData from '../data/ideas.json'

type Dir = 'left' | 'right' | 'up' | null

const ideasMap = (ideasData as IdeaCard[]).reduce<Record<string, IdeaCard>>(
  (acc, idea) => {
    acc[idea.id] = idea
    return acc
  },
  {}
)

function spaced(numero: string) {
  return numero.split('').join(' ')
}

export default function CandidateCard({
  candidate,
  userAnswers,
  overlayDir,
  flipped,
  onFlip,
}: {
  candidate: Candidate
  userAnswers: Partial<Record<ThemeId, Stance>>
  overlayDir: Dir
  flipped: boolean
  onFlip: () => void
}) {
  const pct = candidate.matchScore ?? 0
  const dotColor = siglaColor(candidate.partido)
  const aligned = alignedThemes(userAnswers, candidate.stances).slice(0, 3)

  // Verso: temas com stance != 0, mais alinhados ao eleitor primeiro
  const posis = (Object.keys(candidate.stances) as ThemeId[])
    .filter((t) => candidate.stances[t] !== 0 && ideasMap[t])
    .sort((a, b) => {
      const aAl = userAnswers[a] === candidate.stances[a] ? 0 : 1
      const bAl = userAnswers[b] === candidate.stances[b] ? 0 : 1
      return aAl - bAl
    })
    .slice(0, 6)

  const ocupacaoLinha = [candidate.ocupacao, candidate.idade ? `${candidate.idade} anos` : null]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="relative h-full w-full">
      <div className="perspective h-full w-full">
        <div
          className={`relative h-full w-full preserve-3d transition-transform duration-500 ${
            flipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* FRENTE */}
          <div
            className="absolute inset-0 backface-hidden rounded-3xl overflow-hidden shadow-card border border-border/60"
            onClick={onFlip}
          >
            {/* Foto ou fallback cor-hash */}
            {candidate.foto ? (
              <img
                src={candidate.foto}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  background: `linear-gradient(160deg, ${siglaColor(
                    candidate.partido
                  )}, ${siglaColorSoft(candidate.partido)})`,
                }}
              >
                <span className="font-display text-7xl font-bold text-white/90">
                  {initials(candidate.nomeUrna)}
                </span>
              </div>
            )}

            {/* Barra de partido (topo) */}
            <div className="absolute left-3 top-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-bg/70 backdrop-blur px-3 py-1 text-sm font-semibold text-ink">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: dotColor }}
                />
                {candidate.partido}
              </span>
            </div>

            {/* Scrim (base) */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg via-bg/85 to-transparent px-5 pb-5 pt-16">
              <div className="font-mono text-5xl tracking-wide text-ink">
                {spaced(candidate.numero)}
              </div>
              <div className="mt-1 font-display text-xl text-ink">
                {candidate.nomeUrna}
              </div>
              {ocupacaoLinha && (
                <div className="text-sm text-ink-muted">{ocupacaoLinha}</div>
              )}
              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center gap-1 text-base">
                  {aligned.map((t) => (
                    <span key={t} aria-hidden>
                      {ideasMap[t]?.emoji}
                    </span>
                  ))}
                </div>
                <span className={`text-xs font-semibold ${matchColorClass(pct)}`}>
                  {pct}%
                </span>
                <span className="ml-auto text-xs text-ink-faint">↻ ver +</span>
              </div>
            </div>
          </div>

          {/* VERSO */}
          <div
            className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl overflow-hidden border border-border/60 bg-surface px-5 py-5 flex flex-col"
            onClick={onFlip}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-display text-xl text-ink">
                  {candidate.nomeUrna}
                </div>
                <div className="font-mono text-sm text-ink-muted">
                  nº {spaced(candidate.numero)}
                </div>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-elevated px-3 py-1 text-sm font-semibold text-ink">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: dotColor }}
                />
                {candidate.partido}
              </span>
            </div>

            <p className="mt-4 text-xs uppercase tracking-widest text-ink-muted">
              Onde se posiciona (estimativa)
            </p>
            <ul className="mt-2 space-y-1.5 flex-1 overflow-hidden">
              {posis.map((t) => {
                const fav = candidate.stances[t] === 1
                return (
                  <li key={t} className="flex items-center gap-2 text-sm">
                    <span
                      className={fav ? 'text-agree' : 'text-disagree'}
                      aria-hidden
                    >
                      {fav ? '✓' : '✗'}
                    </span>
                    <span className="text-ink">{ideasMap[t]?.labelCurto}</span>
                  </li>
                )
              })}
            </ul>

            <div className="mt-3 border-t border-border/60 pt-3">
              {ocupacaoLinha && (
                <div className="text-sm text-ink-muted">
                  {ocupacaoLinha} · {candidate.uf}
                </div>
              )}
              <p className="mt-1 text-[10px] leading-snug text-ink-faint">
                Posições estimadas pelo partido — não são declarações oficiais do
                candidato. ↻
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay de arraste (acima de tudo) */}
      <div
        className={`pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-150 ${
          overlayDir === 'right'
            ? 'bg-agree/25 opacity-100'
            : overlayDir === 'left'
            ? 'bg-disagree/25 opacity-100'
            : 'opacity-0'
        }`}
      />
      <span
        className={`pointer-events-none absolute top-10 left-6 -rotate-12 rounded-xl border-4 border-agree px-4 py-1 font-display text-2xl font-bold uppercase text-agree transition-opacity ${
          overlayDir === 'right' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        Salvar
      </span>
      <span
        className={`pointer-events-none absolute top-10 right-6 rotate-12 rounded-xl border-4 border-disagree px-4 py-1 font-display text-2xl font-bold uppercase text-disagree transition-opacity ${
          overlayDir === 'left' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        Descartar
      </span>
    </div>
  )
}
