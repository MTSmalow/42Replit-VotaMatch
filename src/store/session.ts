import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Stance, Cargo, Session } from '../lib/types'

interface SessionStore extends Session {
  // Ações
  setAnswer: (ideaId: string, stance: Stance) => void
  saveCandidate: (cargo: Cargo, candidateId: string) => void
  discardCandidate: (cargo: Cargo, candidateId: string) => void
  setEscolha: (cargo: Cargo, candidateId: string) => void
  reset: () => void
}

const initialState: Session = {
  answers: {},
  favorites: {},
  discarded: {},
  escolhaFinal: {},
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      ...initialState,

      setAnswer: (ideaId, stance) =>
        set((state) => ({
          answers: { ...state.answers, [ideaId]: stance },
        })),

      saveCandidate: (cargo, candidateId) =>
        set((state) => {
          const current = state.favorites[cargo] ?? []
          if (current.includes(candidateId)) return state
          return {
            favorites: {
              ...state.favorites,
              [cargo]: [...current, candidateId],
            },
          }
        }),

      discardCandidate: (cargo, candidateId) =>
        set((state) => {
          const current = state.discarded[cargo] ?? []
          if (current.includes(candidateId)) return state
          return {
            discarded: {
              ...state.discarded,
              [cargo]: [...current, candidateId],
            },
          }
        }),

      setEscolha: (cargo, candidateId) =>
        set((state) => ({
          escolhaFinal: { ...state.escolhaFinal, [cargo]: candidateId },
        })),

      reset: () => set(initialState),
    }),
    {
      name: 'votamatch-session',
    }
  )
)
