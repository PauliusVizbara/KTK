import {create} from 'zustand'

interface PlayerState {
  teamId: string | null
  setTeamId: (teamId: string | null) => void
}

interface GameTrackerState {
  isSetupOpen: boolean
  setIsSetupOpen: (isOpen: boolean) => void
  isSetupDone: boolean
  setIsSetupDone: (isDone: boolean) => void
  player1: PlayerState
  player2: PlayerState
}

export const useGameTrackerStore = create<GameTrackerState>((set) => ({
  isSetupOpen: false,
  setIsSetupOpen: (isOpen) => set({isSetupOpen: isOpen}),
  isSetupDone: false,
  setIsSetupDone: (isDone) => set({isSetupDone: isDone}),
  player1: {
    teamId: null,
    setTeamId: (teamId) => set((state) => ({player1: {...state.player1, teamId}})),
  },
  player2: {
    teamId: null,
    setTeamId: (teamId) => set((state) => ({player2: {...state.player2, teamId}})),
  },
}))
