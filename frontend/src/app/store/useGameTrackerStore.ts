import {create} from 'zustand'
import { CritOp } from '../../../sanity.types'

interface PlayerState {
  teamId: string | null
  setTeamId: (teamId: string | null) => void
}

interface GameTrackerState {
  isSetupOpen: boolean
  setIsSetupOpen: (isOpen: boolean) => void
  isSetupDone: boolean
  setIsSetupDone: (isDone: boolean) => void
  selectedMap: string | null
  setSelectedMap: (map: string | null) => void
  clearSelection: () => void
  critOp: CritOp | null
  setCritOp: (critOp: CritOp | null) => void
  player1: PlayerState
  player2: PlayerState
}

export const useGameTrackerStore = create<GameTrackerState>((set) => ({
  isSetupOpen: false,
  setIsSetupOpen: (isOpen) => set({isSetupOpen: isOpen}),
  isSetupDone: false,
  setIsSetupDone: (isDone) => set({isSetupDone: isDone}),
  selectedMap: null,
  setSelectedMap: (map) => set({selectedMap: map}),
  clearSelection: () => set({selectedMap: null}),
  critOp: null,
  setCritOp: (critOp) => set({critOp}),
  player1: {
    teamId: null,
    setTeamId: (teamId) => set((state) => ({player1: {...state.player1, teamId}})),
  },
  player2: {
    teamId: null,
    setTeamId: (teamId) => set((state) => ({player2: {...state.player2, teamId}})),
  },
}))
