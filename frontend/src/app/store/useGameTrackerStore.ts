import {create} from 'zustand'
import {CritOp, Team, Equipment, TacOp} from '../../../sanity.types'

interface PlayerState {
  team: Team | null
  setTeam: (team: Team | null) => void
  tacOp: TacOp | null
  setTacOp: (tacOp: TacOp | null) => void
  hasInitiativeRerollCard: boolean
  setHasInitiativeRerollCard: (value: boolean) => void
  initiativeModifierCards: number[]
  addInitiativeModifierCard: (value: number) => void
  removeInitiativeModifierCardAt: (index: number) => void
  score: number
  setScore: (score: number) => void
  cp: number
  setCp: (cp: number) => void
  equipment: Equipment[]
  setEquipment: (equipment: Equipment[]) => void
  selectedOperativeCount: number
  setSelectedOperativeCount: (count: number) => void
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
  initiativePlayer: 'player1' | 'player2' | null
  setInitiativePlayer: (player: 'player1' | 'player2' | null) => void
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
  initiativePlayer: null,
  setInitiativePlayer: (player) => set({initiativePlayer: player}),
  player1: {
    team: null,
    setTeam: (team) =>
      set((state) => ({
        player1: {
          ...state.player1,
          team: team,
          tacOp: null,
          hasInitiativeRerollCard: false,
          initiativeModifierCards: [],
          selectedOperativeCount:
            state.player1.team?._id === team?._id
              ? state.player1.selectedOperativeCount
              : (team?.operativeCount ?? 0),
        },
      })),
    tacOp: null,
    setTacOp: (tacOp) => set((state) => ({player1: {...state.player1, tacOp}})),
    hasInitiativeRerollCard: false,
    setHasInitiativeRerollCard: (value) =>
      set((state) => ({player1: {...state.player1, hasInitiativeRerollCard: value}})),
    initiativeModifierCards: [],
    addInitiativeModifierCard: (value) =>
      set((state) => ({
        player1: {
          ...state.player1,
          initiativeModifierCards: [...state.player1.initiativeModifierCards, value],
        },
      })),
    removeInitiativeModifierCardAt: (index) =>
      set((state) => ({
        player1: {
          ...state.player1,
          initiativeModifierCards: state.player1.initiativeModifierCards.filter(
            (_, i) => i !== index,
          ),
        },
      })),
    score: 0,
    setScore: (score) => set((state) => ({player1: {...state.player1, score}})),
    cp: 2,
    setCp: (cp) => set((state) => ({player1: {...state.player1, cp}})),
    equipment: [],
    setEquipment: (equipment) => set((state) => ({player1: {...state.player1, equipment}})),
    selectedOperativeCount: 0,
    setSelectedOperativeCount: (count) =>
      set((state) => ({player1: {...state.player1, selectedOperativeCount: count}})),
  },
  player2: {
    team: null,
    setTeam: (team) =>
      set((state) => ({
        player2: {
          ...state.player2,
          team: team,
          tacOp: null,
          hasInitiativeRerollCard: false,
          initiativeModifierCards: [],
          selectedOperativeCount:
            state.player2.team?._id === team?._id
              ? state.player2.selectedOperativeCount
              : (team?.operativeCount ?? 0),
        },
      })),
    tacOp: null,
    setTacOp: (tacOp) => set((state) => ({player2: {...state.player2, tacOp}})),
    hasInitiativeRerollCard: false,
    setHasInitiativeRerollCard: (value) =>
      set((state) => ({player2: {...state.player2, hasInitiativeRerollCard: value}})),
    initiativeModifierCards: [],
    addInitiativeModifierCard: (value) =>
      set((state) => ({
        player2: {
          ...state.player2,
          initiativeModifierCards: [...state.player2.initiativeModifierCards, value],
        },
      })),
    removeInitiativeModifierCardAt: (index) =>
      set((state) => ({
        player2: {
          ...state.player2,
          initiativeModifierCards: state.player2.initiativeModifierCards.filter(
            (_, i) => i !== index,
          ),
        },
      })),
    score: 0,
    setScore: (score) => set((state) => ({player2: {...state.player2, score}})),
    cp: 2,
    setCp: (cp) => set((state) => ({player2: {...state.player2, cp}})),
    equipment: [],
    setEquipment: (equipment) => set((state) => ({player2: {...state.player2, equipment}})),
    selectedOperativeCount: 0,
    setSelectedOperativeCount: (count) =>
      set((state) => ({player2: {...state.player2, selectedOperativeCount: count}})),
  },
}))
