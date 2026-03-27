import {create} from 'zustand'
import {CritOp, Team, Equipment, TacOp} from '../../../sanity.types'

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

interface PlayerState {
  team: Team | null
  setTeam: (team: Team | null) => void
  tacOp: TacOp | null
  setTacOp: (tacOp: TacOp | null) => void
  primaryOp: 'critical' | 'tactical' | 'kill' | null
  setPrimaryOp: (primaryOp: 'critical' | 'tactical' | 'kill' | null) => void
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
  enemyKilledOperatives: number
  setEnemyKilledOperatives: (count: number) => void
  adjustEnemyKilledOperatives: (delta: number, enemyStartingOperatives: number) => void
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
          primaryOp: null,
          hasInitiativeRerollCard: false,
          initiativeModifierCards: [],
          enemyKilledOperatives: 0,
          selectedOperativeCount:
            state.player1.team?._id === team?._id
              ? state.player1.selectedOperativeCount
              : (team?.operativeCount ?? 0),
        },
      })),
    tacOp: null,
    setTacOp: (tacOp) => set((state) => ({player1: {...state.player1, tacOp}})),
    primaryOp: null,
    setPrimaryOp: (primaryOp) => set((state) => ({player1: {...state.player1, primaryOp}})),
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
    enemyKilledOperatives: 0,
    setEnemyKilledOperatives: (count) =>
      set((state) => ({player1: {...state.player1, enemyKilledOperatives: Math.max(0, count)}})),
    adjustEnemyKilledOperatives: (delta, enemyStartingOperatives) =>
      set((state) => ({
        player1: {
          ...state.player1,
          enemyKilledOperatives: clamp(
            state.player1.enemyKilledOperatives + delta,
            0,
            enemyStartingOperatives,
          ),
        },
      })),
  },
  player2: {
    team: null,
    setTeam: (team) =>
      set((state) => ({
        player2: {
          ...state.player2,
          team: team,
          tacOp: null,
          primaryOp: null,
          hasInitiativeRerollCard: false,
          initiativeModifierCards: [],
          enemyKilledOperatives: 0,
          selectedOperativeCount:
            state.player2.team?._id === team?._id
              ? state.player2.selectedOperativeCount
              : (team?.operativeCount ?? 0),
        },
      })),
    tacOp: null,
    setTacOp: (tacOp) => set((state) => ({player2: {...state.player2, tacOp}})),
    primaryOp: null,
    setPrimaryOp: (primaryOp) => set((state) => ({player2: {...state.player2, primaryOp}})),
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
    enemyKilledOperatives: 0,
    setEnemyKilledOperatives: (count) =>
      set((state) => ({player2: {...state.player2, enemyKilledOperatives: Math.max(0, count)}})),
    adjustEnemyKilledOperatives: (delta, enemyStartingOperatives) =>
      set((state) => ({
        player2: {
          ...state.player2,
          enemyKilledOperatives: clamp(
            state.player2.enemyKilledOperatives + delta,
            0,
            enemyStartingOperatives,
          ),
        },
      })),
  },
}))
