import {create} from 'zustand'
import {createJSONStorage, persist} from 'zustand/middleware'
import {CritOp, Team, Equipment, TacOp} from '../../../sanity.types'

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const createEmptySkullTrack = () => [
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
]

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
  critOpPoints: number
  setCritOpPoints: (points: number) => void
  tacOpPoints: number
  setTacOpPoints: (points: number) => void
  killOpPoints: number
  setKillOpPoints: (points: number) => void
  critTrack: number[][]
  setCritTrack: (track: number[][]) => void
  tacTrack: number[][]
  setTacTrack: (track: number[][]) => void
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
  resetGame: () => void
  gameSessionId: string
  isGameResultUploaded: boolean
  markGameResultUploaded: () => void
  resetGameResultUploadState: () => void
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

const createGameSessionId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export const useGameTrackerStore = create<GameTrackerState>()(
  persist(
    (set) => ({
      isSetupOpen: false,
      setIsSetupOpen: (isOpen) => set({isSetupOpen: isOpen}),
      isSetupDone: false,
      setIsSetupDone: (isDone) => set({isSetupDone: isDone}),
      resetGame: () =>
        set((state) => ({
          isSetupOpen: true,
          isSetupDone: false,
          gameSessionId: createGameSessionId(),
          isGameResultUploaded: false,
          map: null,
          critOp: null,
          turningPoint: 1,
          initiativePlayer: null,
          player1: {
            ...state.player1,
            team: null,
            tacOp: null,
            primaryOp: null,
            hasInitiativeRerollCard: false,
            initiativeModifierCards: [],
            score: 0,
            critOpPoints: 0,
            tacOpPoints: 0,
            killOpPoints: 0,
            critTrack: createEmptySkullTrack(),
            tacTrack: createEmptySkullTrack(),
            cp: 2,
            equipment: [],
            selectedOperativeCount: 0,
            enemyKilledOperatives: 0,
          },
          player2: {
            ...state.player2,
            team: null,
            tacOp: null,
            primaryOp: null,
            hasInitiativeRerollCard: false,
            initiativeModifierCards: [],
            score: 0,
            critOpPoints: 0,
            tacOpPoints: 0,
            killOpPoints: 0,
            critTrack: createEmptySkullTrack(),
            tacTrack: createEmptySkullTrack(),
            cp: 2,
            equipment: [],
            selectedOperativeCount: 0,
            enemyKilledOperatives: 0,
          },
        })),
      gameSessionId: createGameSessionId(),
      isGameResultUploaded: false,
      markGameResultUploaded: () => set({isGameResultUploaded: true}),
      resetGameResultUploadState: () =>
        set({
          gameSessionId: createGameSessionId(),
          isGameResultUploaded: false,
        }),
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
              score: 0,
              critOpPoints: 0,
              tacOpPoints: 0,
              killOpPoints: 0,
              critTrack: createEmptySkullTrack(),
              tacTrack: createEmptySkullTrack(),
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
        critOpPoints: 0,
        setCritOpPoints: (points) =>
          set((state) => ({player1: {...state.player1, critOpPoints: points}})),
        tacOpPoints: 0,
        setTacOpPoints: (points) =>
          set((state) => ({player1: {...state.player1, tacOpPoints: points}})),
        killOpPoints: 0,
        setKillOpPoints: (points) =>
          set((state) => ({player1: {...state.player1, killOpPoints: points}})),
        critTrack: createEmptySkullTrack(),
        setCritTrack: (track) => set((state) => ({player1: {...state.player1, critTrack: track}})),
        tacTrack: createEmptySkullTrack(),
        setTacTrack: (track) => set((state) => ({player1: {...state.player1, tacTrack: track}})),
        cp: 2,
        setCp: (cp) => set((state) => ({player1: {...state.player1, cp}})),
        equipment: [],
        setEquipment: (equipment) => set((state) => ({player1: {...state.player1, equipment}})),
        selectedOperativeCount: 0,
        setSelectedOperativeCount: (count) =>
          set((state) => ({player1: {...state.player1, selectedOperativeCount: count}})),
        enemyKilledOperatives: 0,
        setEnemyKilledOperatives: (count) =>
          set((state) => ({
            player1: {...state.player1, enemyKilledOperatives: Math.max(0, count)},
          })),
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
              score: 0,
              critOpPoints: 0,
              tacOpPoints: 0,
              killOpPoints: 0,
              critTrack: createEmptySkullTrack(),
              tacTrack: createEmptySkullTrack(),
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
        critOpPoints: 0,
        setCritOpPoints: (points) =>
          set((state) => ({player2: {...state.player2, critOpPoints: points}})),
        tacOpPoints: 0,
        setTacOpPoints: (points) =>
          set((state) => ({player2: {...state.player2, tacOpPoints: points}})),
        killOpPoints: 0,
        setKillOpPoints: (points) =>
          set((state) => ({player2: {...state.player2, killOpPoints: points}})),
        critTrack: createEmptySkullTrack(),
        setCritTrack: (track) => set((state) => ({player2: {...state.player2, critTrack: track}})),
        tacTrack: createEmptySkullTrack(),
        setTacTrack: (track) => set((state) => ({player2: {...state.player2, tacTrack: track}})),
        cp: 2,
        setCp: (cp) => set((state) => ({player2: {...state.player2, cp}})),
        equipment: [],
        setEquipment: (equipment) => set((state) => ({player2: {...state.player2, equipment}})),
        selectedOperativeCount: 0,
        setSelectedOperativeCount: (count) =>
          set((state) => ({player2: {...state.player2, selectedOperativeCount: count}})),
        enemyKilledOperatives: 0,
        setEnemyKilledOperatives: (count) =>
          set((state) => ({
            player2: {...state.player2, enemyKilledOperatives: Math.max(0, count)},
          })),
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
    }),
    {
      name: 'ktk-game-tracker-v1',
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState, currentState) => {
        const typedPersistedState = (persistedState as Partial<GameTrackerState>) ?? {}

        return {
          ...currentState,
          ...typedPersistedState,
          player1: {
            ...currentState.player1,
            ...(typedPersistedState.player1 ?? {}),
          },
          player2: {
            ...currentState.player2,
            ...(typedPersistedState.player2 ?? {}),
          },
        }
      },
    },
  ),
)
