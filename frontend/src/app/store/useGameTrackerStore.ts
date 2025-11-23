import {create} from 'zustand'
import {CritOp, Team, Equipment} from '../../../sanity.types'

interface PlayerState {
  team: Team | null
  setTeam: (team: Team | null) => void
  score: number
  setScore: (score: number) => void
  cp: number
  setCp: (cp: number) => void
  equipment: Equipment[]
  setEquipment: (equipment: Equipment[]) => void
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
  turningPoint: number
  setTurningPoint: (turningPoint: number) => void
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
  turningPoint: 1,
  setTurningPoint: (turningPoint) => set({turningPoint}),
  player1: {
    team: null,
    setTeam: (team) => set((state) => ({player1: {...state.player1, team: team}})),
    score: 0,
    setScore: (score) => set((state) => ({player1: {...state.player1, score}})),
    cp: 2,
    setCp: (cp) => set((state) => ({player1: {...state.player1, cp}})),
    equipment: [],
    setEquipment: (equipment) => set((state) => ({player1: {...state.player1, equipment}})),
  },
  player2: {
    team: null,
    setTeam: (team) => set((state) => ({player2: {...state.player2, team: team}})),
    score: 0,
    setScore: (score) => set((state) => ({player2: {...state.player2, score}})),
    cp: 2,
    setCp: (cp) => set((state) => ({player2: {...state.player2, cp}})),
    equipment: [],
    setEquipment: (equipment) => set((state) => ({player2: {...state.player2, equipment}})),
  },
}))
