import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-[100dvh] px-6 safe-top safe-bottom">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-from to-brand-to shadow-card">
          <span className="text-3xl">🗳️</span>
        </div>

        <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-elevated px-3 py-1 text-xs font-medium text-ink-muted">
          São Paulo · Eleições 2022
        </span>

        <h1 className="font-display text-5xl font-bold leading-tight">
          <span className="bg-gradient-to-r from-brand-from to-brand-to bg-clip-text text-transparent">
            VotaMatch SP
          </span>
        </h1>

        <p className="mt-4 max-w-xs font-sans text-lg text-ink-muted">
          Descubra candidatos alinhados às suas ideias deslizando — e leve sua
          cola pra urna.
        </p>
      </div>

      <div className="shrink-0 space-y-4 pb-8">
        <p className="text-center text-[11px] leading-snug text-ink-faint">
          Apoio à decisão. Posições estimadas por partido, não oficiais. Confirme
          no TSE.
        </p>
        <button
          onClick={() => navigate('/ideias')}
          className="w-full rounded-full bg-gradient-to-r from-brand-from to-brand-to py-4 text-lg font-semibold text-white shadow-card active:scale-95 transition"
        >
          Começar
        </button>
      </div>
    </div>
  )
}
