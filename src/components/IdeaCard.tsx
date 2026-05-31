import type { IdeaCard as Idea } from '../lib/types'

type Dir = 'left' | 'right' | 'up' | null

export default function IdeaCard({
  idea,
  overlayDir,
}: {
  idea: Idea
  overlayDir: Dir
}) {
  return (
    <div className="relative h-full w-full rounded-3xl bg-surface shadow-card border border-border/60 overflow-hidden flex flex-col items-center justify-center px-7 text-center select-none">
      {/* Tint de arraste */}
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-150 ${
          overlayDir === 'right' ? 'bg-agree/20 opacity-100' : 'opacity-0'
        }`}
      />
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-150 ${
          overlayDir === 'left' ? 'bg-disagree/20 opacity-100' : 'opacity-0'
        }`}
      />
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-150 ${
          overlayDir === 'up' ? 'bg-skip/20 opacity-100' : 'opacity-0'
        }`}
      />

      {/* Selos */}
      <span
        className={`pointer-events-none absolute top-8 left-6 -rotate-12 rounded-xl border-4 border-agree px-4 py-1 font-display text-2xl font-bold uppercase tracking-wide text-agree transition-opacity ${
          overlayDir === 'right' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        Concordo
      </span>
      <span
        className={`pointer-events-none absolute top-8 right-6 rotate-12 rounded-xl border-4 border-disagree px-4 py-1 font-display text-2xl font-bold uppercase tracking-wide text-disagree transition-opacity ${
          overlayDir === 'left' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        Discordo
      </span>
      <span
        className={`pointer-events-none absolute top-8 left-1/2 -translate-x-1/2 -rotate-6 rounded-xl border-4 border-skip px-4 py-1 font-display text-2xl font-bold uppercase tracking-wide text-skip transition-opacity ${
          overlayDir === 'up' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        Neutro
      </span>

      {/* Conteúdo */}
      <div className="text-6xl mb-6" aria-hidden>
        {idea.emoji}
      </div>
      <p className="text-xs uppercase tracking-widest text-ink-muted mb-4">
        {idea.tema}
      </p>
      <h2 className="font-display text-3xl text-ink leading-snug">
        {idea.statement}
      </h2>
    </div>
  )
}
