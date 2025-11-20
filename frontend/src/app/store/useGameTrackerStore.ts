import {create} from 'zustand'
import {CritOp, Team} from '../../../sanity.types'

interface PlayerState {
  teamSelection: {name: string | null; id: string | null}
  setTeamSelection: (team: {name: string | null; id: string | null}) => void
}

interface GameTrackerState {
  isSetupOpen: boolean
  setIsSetupOpen: (isOpen: boolean) => void
  isSetupDone: boolean
  setIsSetupDone: (isDone: boolean) => void
  map: string | null
  setMap: (map: string | null) => void
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
  map: null,
  setMap: (map) => set({map}),
  critOp: null,
  setCritOp: (critOp) => set({critOp}),
  player1: {
    teamSelection: {name: null, id: null},
    setTeamSelection: (team) =>
      set((state) => ({player1: {...state.player1, teamSelection: team}})),
  },
  player2: {
    teamSelection: {name: null, id: null},
    setTeamSelection: (team) =>
      set((state) => ({player2: {...state.player2, teamSelection: team}})),
  },
}))
