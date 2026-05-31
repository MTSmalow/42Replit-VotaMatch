import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { Stance, Cargo, Session } from './types'

// Versão React Native da store de sessão.
// Usa AsyncStorage em vez de localStorage.

interface SessionStore extends Session {
  setAnswer: (ideaId: string, stance: Stance) => void
  saveCandidate: (cargo: Cargo, candidateId: string) => void
  discardCandidate: (cargo: Cargo, candidateId: string) => void
  setEscolha: (cargo: Cargo, candidateId: string) => void
  clearEscolha: (cargo: Cargo) => void
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

      clearEscolha: (cargo) =>
        set((state) => {
          const next = { ...state.escolhaFinal };
          delete next[cargo];
          return { escolhaFinal: next };
        }),

      reset: () => set(initialState),
    }),
    {
      name: 'votamatch-session',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
