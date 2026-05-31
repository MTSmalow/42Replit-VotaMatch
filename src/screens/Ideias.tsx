import { createRef, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TinderCard from 'react-tinder-card'
import IdeaCard from '../components/IdeaCard'
import { useSessionStore } from '../store/session'
import type { IdeaCard as Idea, Stance } from '../lib/types'
import ideasData from '../data/ideas.json'

type Dir = 'left' | 'right' | 'up' | 'down'

// react-tinder-card empilha o último item do array no topo.
// Invertemos para que a 1ª ideia do JSON apareça primeiro.
const ideas = [...(ideasData as Idea[])].reverse()
const total = ideas.length

function dirToStance(dir: Dir): Stance {
  if (dir === 'right') return 1
  if (dir === 'left') return -1
  return 0 // up = neutro
}

export default function Ideias() {
  const navigate = useNavigate()
  const setAnswer = useSessionStore((s) => s.setAnswer)

  const [currentIndex, setCurrentIndex] = useState(ideas.length - 1)
  const [dragDir, setDragDir] = useState<Dir | null>(null)
  const currentIndexRef = useRef(currentIndex)

  const childRefs = useMemo(
    () => ideas.map(() => createRef<any>()),
    []
  )

  const updateIndex = (val: number) => {
    currentIndexRef.current = val
    setCurrentIndex(val)
  }

  const answered = total - 1 - currentIndex
  const progress = Math.min(answered, total)
  const progressPct = total > 0 ? (progress / total) * 100 : 0

  useEffect(() => {
    if (currentIndex < 0) {
      navigate('/cargos')
    }
  }, [currentIndex, navigate])

  const swiped = (dir: Dir, idea: Idea, index: number) => {
    if (dir === 'down') return
    setAnswer(idea.id, dirToStance(dir))
    setDragDir(null)
    updateIndex(index - 1)
  }

  const triggerSwipe = async (dir: Dir) => {
    const idx = currentIndexRef.current
    if (idx < 0) return
    const ref = childRefs[idx]?.current
    if (ref) {
      await ref.swipe(dir)
    }
  }

  return (
    <div className="flex flex-col min-h-[100dvh] px-5 pt-4 safe-top safe-bottom">
      {/* Progresso */}
      <header className="shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase tracking-widest text-ink-muted">
            {progress} de {total}
          </span>
          <button
            onClick={() => navigate('/cargos')}
            className="text-xs text-ink-faint hover:text-ink-muted transition-colors"
          >
            pular para resultados
          </button>
        </div>
        <div className="h-2 w-full rounded-full bg-elevated overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-from to-brand-to transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </header>

      {/* Deck */}
      <div className="relative flex-1 my-5">
        {ideas.map((idea, index) => (
          <TinderCard
            key={idea.id}
            ref={childRefs[index]}
            className="absolute inset-0"
            preventSwipe={['down']}
            swipeRequirementType="position"
            swipeThreshold={80}
            onSwipe={(dir) => swiped(dir as Dir, idea, index)}
            onSwipeRequirementFulfilled={(dir) => {
              if (index === currentIndexRef.current) setDragDir(dir as Dir)
            }}
            onSwipeRequirementUnfulfilled={() => {
              if (index === currentIndexRef.current) setDragDir(null)
            }}
          >
            <div
              className="h-full w-full"
              style={{ pointerEvents: index === currentIndex ? 'auto' : 'none' }}
            >
              <IdeaCard
                idea={idea}
                overlayDir={
                  index === currentIndex && dragDir !== 'down' ? dragDir : null
                }
              />
            </div>
          </TinderCard>
        ))}

        {currentIndex < 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-ink-muted">
            Carregando resultados…
          </div>
        )}
      </div>

      {/* FABs */}
      <footer className="shrink-0 flex items-center justify-center gap-6 pb-6">
        <button
          aria-label="Discordo"
          onClick={() => triggerSwipe('left')}
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-disagree bg-elevated text-disagree text-2xl active:scale-90 transition"
        >
          ✕
        </button>
        <button
          aria-label="Neutro / pular"
          onClick={() => triggerSwipe('up')}
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-skip bg-elevated text-skip text-2xl active:scale-90 transition"
        >
          ↑
        </button>
        <button
          aria-label="Concordo"
          onClick={() => triggerSwipe('right')}
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-agree bg-elevated text-agree text-2xl active:scale-90 transition"
        >
          ♥
        </button>
      </footer>
    </div>
  )
}
