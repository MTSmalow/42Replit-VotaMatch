import { createRef, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TinderCard from 'react-tinder-card'
import CandidateCard from '../components/CandidateCard'
import { useSessionStore } from '../store/session'
import { matchPct, matchColorClass } from '../lib/matching'
import { siglaColor } from '../lib/colorHash'
import type { Candidate, Cargo } from '../lib/types'
import candidatesData from '../data/candidates.json'

type Dir = 'left' | 'right' | 'up' | 'down'

// Ordem da urna (rótulos + se é deputado)
const CARGO_ORDER: { id: Cargo; label: string; isDeputado: boolean }[] = [
  { id: 'deputadoEstadual', label: 'Deputado Estadual', isDeputado: true },
  { id: 'deputadoFederal', label: 'Deputado Federal', isDeputado: true },
  { id: 'senador', label: 'Senador', isDeputado: false },
  { id: 'governador', label: 'Governador', isDeputado: false },
  { id: 'presidente', label: 'Presidente', isDeputado: false },
]

const allCandidates = candidatesData as Candidate[]
const TOP_N = 30

export default function Cargos() {
  const navigate = useNavigate()
  const answers = useSessionStore((s) => s.answers)
  const favorites = useSessionStore((s) => s.favorites)
  const saveCandidate = useSessionStore((s) => s.saveCandidate)
  const discardCandidate = useSessionStore((s) => s.discardCandidate)
  const setEscolha = useSessionStore((s) => s.setEscolha)

  const [cargoIdx, setCargoIdx] = useState(0)
  const [phase, setPhase] = useState<'swiping' | 'choosing'>('swiping')
  const [selectedParties, setSelectedParties] = useState<string[]>([])
  const [filterOpen, setFilterOpen] = useState(false)
  const [dragDir, setDragDir] = useState<Dir | null>(null)
  const [flipped, setFlipped] = useState(false)

  const cargo = CARGO_ORDER[cargoIdx]

  // Ranking COMPLETO do cargo (sem filtro) — base para a escolha final.
  const ranked = useMemo(() => {
    return allCandidates
      .filter((c) => c.cargo === cargo.id)
      .map((c) => ({ ...c, matchScore: matchPct(answers, c.stances) }))
      .sort((a, b) => b.matchScore! - a.matchScore!)
  }, [cargo.id, answers])

  // Deck de swipe: aplica filtro (só deputados) + corte TOP 30, e inverte a ordem
  // para que a carta de MAIOR match fique no topo da pilha (último = topo).
  const swipeDeck = useMemo(() => {
    let list = ranked
    if (cargo.isDeputado && selectedParties.length > 0) {
      list = list.filter((c) => selectedParties.includes(c.partido))
    }
    if (cargo.isDeputado) list = list.slice(0, TOP_N)
    return [...list].reverse()
  }, [ranked, cargo.isDeputado, selectedParties])

  // Siglas disponíveis no cargo atual (para o filtro)
  const partiesAvailable = useMemo(() => {
    const set = new Set(
      allCandidates.filter((c) => c.cargo === cargo.id).map((c) => c.partido)
    )
    return Array.from(set).sort()
  }, [cargo.id])

  const [currentIndex, setCurrentIndex] = useState(swipeDeck.length - 1)
  const currentIndexRef = useRef(currentIndex)
  const childRefs = useMemo(
    () => swipeDeck.map(() => createRef<any>()),
    [swipeDeck]
  )

  const updateIndex = (val: number) => {
    currentIndexRef.current = val
    setCurrentIndex(val)
  }

  // Reinicia o deck quando o cargo ou o filtro muda
  useEffect(() => {
    updateIndex(swipeDeck.length - 1)
    setFlipped(false)
    setDragDir(null)
    setPhase('swiping')
  }, [swipeDeck])

  // Fim do deck → escolher favorito (apenas se havia cartas)
  useEffect(() => {
    if (phase === 'swiping' && swipeDeck.length > 0 && currentIndex < 0) {
      setPhase('choosing')
    }
  }, [currentIndex, phase, swipeDeck.length])

  const swiped = (dir: Dir, cand: Candidate, index: number) => {
    if (dir === 'down') return
    if (dir === 'right' || dir === 'up') saveCandidate(cargo.id, cand.id)
    else discardCandidate(cargo.id, cand.id)
    setDragDir(null)
    setFlipped(false)
    updateIndex(index - 1)
  }

  const triggerSwipe = async (dir: Dir) => {
    const idx = currentIndexRef.current
    if (idx < 0) return
    const ref = childRefs[idx]?.current
    if (ref) await ref.swipe(dir)
  }

  const toggleParty = (sigla: string) => {
    setSelectedParties((prev) =>
      prev.includes(sigla) ? prev.filter((p) => p !== sigla) : [...prev, sigla]
    )
  }

  const advanceCargo = (chosenId?: string) => {
    if (chosenId) setEscolha(cargo.id, chosenId)
    setSelectedParties([])
    setFilterOpen(false)
    if (cargoIdx >= CARGO_ORDER.length - 1) {
      navigate('/cola')
    } else {
      setCargoIdx((i) => i + 1)
    }
  }

  // Opções para a escolha final: favoritos salvos (no conjunto completo do cargo),
  // ou top 5 do ranking quando nada foi salvo.
  const savedIds = favorites[cargo.id] ?? []
  const chooseOptions: Candidate[] =
    savedIds.length > 0
      ? ranked.filter((c) => savedIds.includes(c.id))
      : ranked.slice(0, 5)

  return (
    <div className="flex flex-col min-h-[100dvh] px-5 pt-4 safe-top safe-bottom">
      {/* Cabeçalho de cargo */}
      <header className="shrink-0">
        {/* Stepper */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center flex-1">
            {CARGO_ORDER.map((c, i) => (
              <div key={c.id} className="flex items-center flex-1 last:flex-none">
                <span
                  className={`h-3 w-3 rounded-full ${
                    i <= cargoIdx ? 'bg-brand' : 'bg-elevated'
                  }`}
                />
                {i < CARGO_ORDER.length - 1 && (
                  <span
                    className={`h-0.5 flex-1 ${
                      i < cargoIdx ? 'bg-brand' : 'bg-elevated'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <span className="ml-3 text-xs text-ink-muted">
            {cargoIdx + 1}/{CARGO_ORDER.length}
          </span>
        </div>

        <h1 className="font-display text-lg uppercase tracking-wide text-ink">
          {cargo.label}
        </h1>

        {/* Filtro de partido (só deputados) */}
        {cargo.isDeputado && (
          <div className="mt-2">
            <button
              onClick={() => setFilterOpen((o) => !o)}
              className="text-xs text-ink-muted hover:text-ink transition-colors"
            >
              ⌗ filtrar partido ▾
            </button>
            {selectedParties.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedParties.map((p) => (
                  <button
                    key={p}
                    onClick={() => toggleParty(p)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-elevated px-2.5 py-1 text-xs text-ink"
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: siglaColor(p) }}
                    />
                    {p} ✕
                  </button>
                ))}
              </div>
            )}
            {filterOpen && (
              <div className="mt-2 flex flex-wrap gap-2 rounded-2xl bg-surface border border-border/60 p-3 max-h-40 overflow-y-auto">
                {partiesAvailable.map((p) => {
                  const active = selectedParties.includes(p)
                  return (
                    <button
                      key={p}
                      onClick={() => toggleParty(p)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs transition-colors ${
                        active
                          ? 'bg-brand text-white'
                          : 'bg-elevated text-ink-muted'
                      }`}
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: siglaColor(p) }}
                      />
                      {p}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </header>

      {/* Conteúdo */}
      {phase === 'swiping' ? (
        <>
          <div className="relative flex-1 my-4">
            {swipeDeck.map((cand, index) => (
              <TinderCard
                key={cand.id}
                ref={childRefs[index]}
                className="absolute inset-0"
                preventSwipe={['down']}
                swipeRequirementType="position"
                swipeThreshold={80}
                onSwipe={(dir) => swiped(dir as Dir, cand, index)}
                onSwipeRequirementFulfilled={(dir) => {
                  if (index === currentIndexRef.current) setDragDir(dir as Dir)
                }}
                onSwipeRequirementUnfulfilled={() => {
                  if (index === currentIndexRef.current) setDragDir(null)
                }}
              >
                <div
                  className="h-full w-full"
                  style={{
                    pointerEvents: index === currentIndex ? 'auto' : 'none',
                  }}
                >
                  <CandidateCard
                    candidate={cand}
                    userAnswers={answers}
                    overlayDir={
                      index === currentIndex && dragDir !== 'down'
                        ? (dragDir as 'left' | 'right' | 'up' | null)
                        : null
                    }
                    flipped={index === currentIndex && flipped}
                    onFlip={() => {
                      if (index === currentIndex) setFlipped((f) => !f)
                    }}
                  />
                </div>
              </TinderCard>
            ))}

            {swipeDeck.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center text-ink-muted px-6">
                <p>Nenhum candidato com esse filtro.</p>
                {selectedParties.length > 0 && (
                  <button
                    onClick={() => setSelectedParties([])}
                    className="rounded-full bg-elevated px-4 py-2 text-sm text-ink active:scale-95 transition"
                  >
                    Limpar filtro
                  </button>
                )}
              </div>
            )}
          </div>

          {/* FABs */}
          <footer className="shrink-0 flex items-center justify-center gap-8 pb-6">
            <button
              aria-label="Descartar"
              onClick={() => triggerSwipe('left')}
              disabled={currentIndex < 0}
              className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-disagree bg-elevated text-disagree text-2xl active:scale-90 transition disabled:opacity-40"
            >
              ✕
            </button>
            <button
              aria-label="Salvar"
              onClick={() => triggerSwipe('right')}
              disabled={currentIndex < 0}
              className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-agree bg-elevated text-agree text-2xl active:scale-90 transition disabled:opacity-40"
            >
              ♥
            </button>
          </footer>
        </>
      ) : (
        /* Escolha final do cargo */
        <div className="flex flex-1 flex-col my-4">
          <p className="text-sm text-ink-muted mb-3">
            {chooseOptions.length > 0
              ? `Escolha 1 ${cargo.label.toLowerCase()} para a sua Cola da Urna:`
              : 'Você não salvou ninguém neste cargo.'}
          </p>
          <div className="flex-1 space-y-3 overflow-y-auto">
            {chooseOptions.map((c) => (
              <button
                key={c.id}
                onClick={() => advanceCargo(c.id)}
                className="w-full flex items-center gap-3 rounded-2xl bg-surface border border-border/60 p-3 text-left active:scale-[0.98] transition"
              >
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-mono text-sm text-white"
                  style={{ background: siglaColor(c.partido) }}
                >
                  {c.numero.length > 3 ? c.numero.slice(0, 2) : c.numero}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-display text-ink truncate">
                    {c.nomeUrna}
                  </span>
                  <span className="block text-xs text-ink-muted">
                    {c.partido} · nº {c.numero}
                  </span>
                </span>
                <span
                  className={`text-sm font-semibold ${matchColorClass(
                    c.matchScore ?? 0
                  )}`}
                >
                  {c.matchScore}%
                </span>
              </button>
            ))}
          </div>
          <button
            onClick={() => advanceCargo()}
            className="mt-4 w-full rounded-full py-3 text-base font-semibold text-ink-muted bg-elevated active:scale-95 transition"
          >
            {cargoIdx >= CARGO_ORDER.length - 1
              ? 'Ver Cola da Urna →'
              : 'Pular este cargo →'}
          </button>
        </div>
      )}
    </div>
  )
}
