import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toPng } from 'html-to-image'
import { useSessionStore } from '../store/session'
import { siglaColor, siglaColorSoft, initials } from '../lib/colorHash'
import type { Candidate, Cargo } from '../lib/types'
import candidatesData from '../data/candidates.json'

const allCandidates = candidatesData as Candidate[]
const byId = new Map(allCandidates.map((c) => [c.id, c]))

// Ordem da urna
const CARGO_ORDER: { id: Cargo; label: string }[] = [
  { id: 'deputadoEstadual', label: 'Deputado Estadual' },
  { id: 'deputadoFederal', label: 'Deputado Federal' },
  { id: 'senador', label: 'Senador' },
  { id: 'governador', label: 'Governador' },
  { id: 'presidente', label: 'Presidente' },
]

function spaced(numero: string) {
  return numero.split('').join(' ')
}

function ColaCard({ label, cand }: { label: string; cand?: Candidate }) {
  return (
    <div className="rounded-3xl border border-border/60 border-l-4 border-l-brand bg-surface px-5 py-4">
      <p className="text-xs uppercase tracking-widest text-ink-muted">{label}</p>
      {cand ? (
        <>
          <div className="mt-1 font-mono text-6xl tracking-widest text-ink">
            {spaced(cand.numero)}
          </div>
          <div className="mt-2 flex items-center gap-2">
            {cand.foto ? (
              <img
                src={cand.foto}
                alt=""
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold text-white"
                style={{
                  background: `linear-gradient(160deg, ${siglaColor(
                    cand.partido
                  )}, ${siglaColorSoft(cand.partido)})`,
                }}
              >
                {initials(cand.nomeUrna)}
              </span>
            )}
            <span className="text-sm text-ink-muted">
              {cand.nomeUrna} · {cand.partido}
            </span>
          </div>
        </>
      ) : (
        <div className="mt-1 font-mono text-2xl text-ink-faint">
          — não escolhido —
        </div>
      )}
    </div>
  )
}

export default function Cola() {
  const navigate = useNavigate()
  const escolhaFinal = useSessionStore((s) => s.escolhaFinal)
  const reset = useSessionStore((s) => s.reset)
  const colaRef = useRef<HTMLDivElement>(null)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!colaRef.current) return
    setSaving(true)
    try {
      const dataUrl = await toPng(colaRef.current, {
        pixelRatio: 2,
        backgroundColor: '#0E1117',
        cacheBust: true,
      })
      const link = document.createElement('a')
      link.download = 'cola-da-urna-2022.png'
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Falha ao gerar imagem:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    reset()
    navigate('/')
  }

  return (
    <div className="flex flex-col min-h-[100dvh] px-5 pt-6 safe-top safe-bottom">
      {/* Bloco exportado como PNG */}
      <div ref={colaRef} className="bg-bg px-1 pb-4">
        <header className="mb-4 px-1">
          <h1 className="font-display text-2xl font-bold text-ink">
            Minha Cola da Urna
          </h1>
          <p className="font-mono text-sm uppercase tracking-widest text-brand">
            · 2022 ·
          </p>
        </header>

        <div className="space-y-3">
          {CARGO_ORDER.map(({ id, label }) => (
            <ColaCard
              key={id}
              label={label}
              cand={escolhaFinal[id] ? byId.get(escolhaFinal[id]!) : undefined}
            />
          ))}
        </div>

        <p className="mt-4 px-1 text-[11px] leading-snug text-ink-faint">
          Ferramenta de apoio à decisão. Confirme nas fontes oficiais (TSE).
          Posições estimadas, não oficiais.
        </p>
      </div>

      {/* Ações */}
      <div className="mt-auto flex flex-col gap-3 pt-5 pb-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full rounded-full bg-gradient-to-r from-brand to-[#A855F7] py-4 text-base font-semibold text-white active:scale-95 transition disabled:opacity-60"
        >
          {saving ? 'Gerando imagem…' : 'Salvar como imagem'}
        </button>
        <button
          onClick={handleReset}
          className="w-full rounded-full bg-elevated py-3 text-base font-semibold text-ink-muted active:scale-95 transition"
        >
          Recomeçar
        </button>
      </div>
    </div>
  )
}
