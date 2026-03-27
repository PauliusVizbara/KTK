'use client'
import {useGameTrackerStore} from '@/app/store'
import {Button, CritOpCard, PrimaryOpDialog, ScoreTracker, TurnInitiativeDialog} from '@/components'
import React from 'react'
import Image from 'next/image'
import {MapZoomModal} from '../SetupDialog/SetupDialog'
import ReactDOM from 'react-dom'
import {XMarkIcon} from '@heroicons/react/16/solid'
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@/components/dialog'

type PrimaryOp = 'critical' | 'tactical' | 'kill' | null

const getPrimaryOpSourcePoints = (
  primaryOp: PrimaryOp,
  critOpPoints: number,
  tacOpPoints: number,
  killOpPoints: number,
) => {
  if (primaryOp === 'critical') return critOpPoints
  if (primaryOp === 'tactical') return tacOpPoints
  if (primaryOp === 'kill') return killOpPoints
  return 0
}

const renderScoreSkulls = (
  points: number,
  row: Exclude<PrimaryOp, null>,
  primaryOp: PrimaryOp,
  primaryBonus: number,
  revealStep: number,
  primaryRevealStep: number,
) => {
  const hasPrimaryBonus = primaryOp === row && primaryBonus > 0
  const revealedPoints = Math.min(points, revealStep)
  const revealedBonus = hasPrimaryBonus ? Math.min(primaryBonus, primaryRevealStep) : 0

  return (
    <div className="flex items-center justify-start gap-2">
      <AnimatedSkulls count={6} active={Math.min(6, revealedPoints)} />
      {hasPrimaryBonus ? (
        <div
          className={
            revealedBonus > 0
              ? 'flex items-center gap-2 opacity-100'
              : 'flex items-center gap-2 opacity-0'
          }
        >
          <span className="text-zinc-500">+</span>
          <AnimatedSkulls count={Math.min(6, primaryBonus)} active={Math.min(6, revealedBonus)} />
        </div>
      ) : null}
    </div>
  )
}

type RevealKey =
  | 'player1Crit'
  | 'player2Crit'
  | 'player1Tac'
  | 'player2Tac'
  | 'player1Kill'
  | 'player2Kill'

type RevealState = Record<RevealKey, number>

type PrimaryRevealState = {
  player1: number
  player2: number
}

type TotalRevealState = {
  player1: number
  player2: number
}

const EMPTY_REVEAL_STATE: RevealState = {
  player1Crit: 0,
  player2Crit: 0,
  player1Tac: 0,
  player2Tac: 0,
  player1Kill: 0,
  player2Kill: 0,
}

const EMPTY_PRIMARY_REVEAL_STATE: PrimaryRevealState = {
  player1: 0,
  player2: 0,
}

const EMPTY_TOTAL_REVEAL_STATE: TotalRevealState = {
  player1: 0,
  player2: 0,
}

const AnimatedSkulls = ({count, active}: {count: number; active: number}) => (
  <div className="flex items-center gap-1">
    {Array.from({length: count}).map((_, index) => {
      const isVisible = index < active
      return (
        <span
          key={`result-skull-${index}`}
          className="inline-flex h-6 w-6 items-center justify-center"
        >
          <Image
            src="/images/skull.svg"
            alt="Skull"
            width={14}
            height={14}
            className={isVisible ? 'opacity-100' : 'opacity-20 grayscale'}
            style={
              isVisible
                ? {
                    filter:
                      'brightness(0) saturate(100%) invert(49%) sepia(94%) saturate(3145%) hue-rotate(2deg) brightness(98%) contrast(94%)',
                  }
                : undefined
            }
          />
        </span>
      )
    })}
  </div>
)

const GameResultDialog = ({
  open,
  onClose,
  player1Name,
  player2Name,
  player1Crit,
  player1Tac,
  player1Kill,
  player1Primary,
  player2Crit,
  player2Tac,
  player2Kill,
  player2Primary,
}: {
  open: boolean
  onClose: () => void
  player1Name: string
  player2Name: string
  player1Crit: number
  player1Tac: number
  player1Kill: number
  player1Primary: PrimaryOp
  player2Crit: number
  player2Tac: number
  player2Kill: number
  player2Primary: PrimaryOp
}) => {
  const player1PrimarySource = getPrimaryOpSourcePoints(
    player1Primary,
    player1Crit,
    player1Tac,
    player1Kill,
  )
  const player2PrimarySource = getPrimaryOpSourcePoints(
    player2Primary,
    player2Crit,
    player2Tac,
    player2Kill,
  )

  const player1PrimaryBonus = Math.ceil(player1PrimarySource / 2)
  const player2PrimaryBonus = Math.ceil(player2PrimarySource / 2)

  const player1Total = player1Crit + player1Tac + player1Kill + player1PrimaryBonus
  const player2Total = player2Crit + player2Tac + player2Kill + player2PrimaryBonus

  const [revealState, setRevealState] = React.useState<RevealState>(EMPTY_REVEAL_STATE)
  const [primaryReveal, setPrimaryReveal] = React.useState<PrimaryRevealState>(
    EMPTY_PRIMARY_REVEAL_STATE,
  )
  const [totalReveal, setTotalReveal] = React.useState<TotalRevealState>(EMPTY_TOTAL_REVEAL_STATE)

  React.useEffect(() => {
    if (!open) {
      setRevealState(EMPTY_REVEAL_STATE)
      setPrimaryReveal(EMPTY_PRIMARY_REVEAL_STATE)
      setTotalReveal(EMPTY_TOTAL_REVEAL_STATE)
      return
    }

    setRevealState(EMPTY_REVEAL_STATE)
    setPrimaryReveal(EMPTY_PRIMARY_REVEAL_STATE)
    setTotalReveal(EMPTY_TOTAL_REVEAL_STATE)

    const revealTargets: Array<{key: RevealKey; total: number}> = [
      {
        key: 'player1Crit',
        total: player1Crit,
      },
      {
        key: 'player2Crit',
        total: player2Crit,
      },
      {
        key: 'player1Tac',
        total: player1Tac,
      },
      {
        key: 'player2Tac',
        total: player2Tac,
      },
      {
        key: 'player1Kill',
        total: player1Kill,
      },
      {
        key: 'player2Kill',
        total: player2Kill,
      },
    ]

    const primaryRevealTargets: Array<{player: keyof PrimaryRevealState; total: number}> = [
      {player: 'player1', total: player1PrimaryBonus},
      {player: 'player2', total: player2PrimaryBonus},
    ]

    const totalAnimatedSkulls =
      revealTargets.reduce((sum, target) => sum + target.total, 0) +
      primaryRevealTargets.reduce((sum, target) => sum + target.total, 0)
    if (totalAnimatedSkulls <= 0) {
      return
    }

    const skullStepDelay = 137
    const opDelay = 35
    const totalStepDelay = 74
    const beforeTotalDelay = 200
    let elapsed = 0
    const timeoutIds: number[] = []

    revealTargets.forEach(({key, total}) => {
      for (let step = 1; step <= total; step += 1) {
        elapsed += skullStepDelay
        const timeoutId = window.setTimeout(() => {
          setRevealState((current) => ({...current, [key]: step}))
        }, elapsed)
        timeoutIds.push(timeoutId)
      }

      elapsed += opDelay
    })

    primaryRevealTargets.forEach(({player, total}) => {
      for (let step = 1; step <= total; step += 1) {
        elapsed += skullStepDelay
        const timeoutId = window.setTimeout(() => {
          setPrimaryReveal((current) => ({...current, [player]: step}))
        }, elapsed)
        timeoutIds.push(timeoutId)
      }

      elapsed += opDelay
    })

    elapsed += beforeTotalDelay

    const maxTotal = Math.max(player1Total, player2Total)
    for (let step = 1; step <= maxTotal; step += 1) {
      elapsed += totalStepDelay
      const timeoutId = window.setTimeout(() => {
        setTotalReveal({
          player1: Math.min(step, player1Total),
          player2: Math.min(step, player2Total),
        })
      }, elapsed)
      timeoutIds.push(timeoutId)
    }

    return () => {
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId))
    }
  }, [
    open,
    player1Crit,
    player1Tac,
    player1Kill,
    player1Primary,
    player2Crit,
    player2Tac,
    player2Kill,
    player2Primary,
    player1PrimaryBonus,
    player2PrimaryBonus,
    player1Total,
    player2Total,
  ])

  return (
    <Dialog size="3xl" open={open} onClose={onClose}>
      <DialogTitle className="text-2xl font-bold uppercase">Game Result</DialogTitle>
      <DialogDescription>Turning Point 4 complete. Final score summary.</DialogDescription>

      <DialogBody>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-700">
                <th className="px-2 py-2 text-left">Track</th>
                <th className="px-2 py-2 text-center">{player1Name}</th>
                <th className="px-2 py-2 text-center">{player2Name}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-zinc-100">
                <td className="px-2 py-2">Critical Op</td>
                <td className="px-2 py-2 text-left font-semibold">
                  {renderScoreSkulls(
                    player1Crit,
                    'critical',
                    player1Primary,
                    player1PrimaryBonus,
                    revealState.player1Crit,
                    primaryReveal.player1,
                  )}
                </td>
                <td className="px-2 py-2 text-left font-semibold">
                  {renderScoreSkulls(
                    player2Crit,
                    'critical',
                    player2Primary,
                    player2PrimaryBonus,
                    revealState.player2Crit,
                    primaryReveal.player2,
                  )}
                </td>
              </tr>
              <tr className="border-b border-zinc-100">
                <td className="px-2 py-2">Tactical Op</td>
                <td className="px-2 py-2 text-left font-semibold">
                  {renderScoreSkulls(
                    player1Tac,
                    'tactical',
                    player1Primary,
                    player1PrimaryBonus,
                    revealState.player1Tac,
                    primaryReveal.player1,
                  )}
                </td>
                <td className="px-2 py-2 text-left font-semibold">
                  {renderScoreSkulls(
                    player2Tac,
                    'tactical',
                    player2Primary,
                    player2PrimaryBonus,
                    revealState.player2Tac,
                    primaryReveal.player2,
                  )}
                </td>
              </tr>
              <tr className="border-b border-zinc-100">
                <td className="px-2 py-2">Kill Op</td>
                <td className="px-2 py-2 text-left font-semibold">
                  {renderScoreSkulls(
                    player1Kill,
                    'kill',
                    player1Primary,
                    player1PrimaryBonus,
                    revealState.player1Kill,
                    primaryReveal.player1,
                  )}
                </td>
                <td className="px-2 py-2 text-left font-semibold">
                  {renderScoreSkulls(
                    player2Kill,
                    'kill',
                    player2Primary,
                    player2PrimaryBonus,
                    revealState.player2Kill,
                    primaryReveal.player2,
                  )}
                </td>
              </tr>
              <tr>
                <td className="px-2 py-2 font-bold uppercase">Final Total</td>
                <td className="px-2 py-2 text-center">
                  <span className="text-lg font-bold text-zinc-900">{totalReveal.player1}</span>
                </td>
                <td className="px-2 py-2 text-center">
                  <span className="text-lg font-bold text-zinc-900">{totalReveal.player2}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </DialogBody>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

const CritOpModal = ({onClose}: {onClose: () => void}) => {
  const {critOp} = useGameTrackerStore()
  if (!critOp) return null
  return (
    <div
      onClick={onClose}
      className="fixed left-0 w-screen h-screen top-0 inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-20"
    >
      <div className="fixed top-6 right-6">
        <XMarkIcon className="w-16 h-16 p-4 cursor-pointer text-white" onClick={onClose} />
      </div>
      <div onClick={(e) => e.stopPropagation()} className="max-w-2xl w-full">
        <CritOpCard critOp={critOp} />
      </div>
    </div>
  )
}

export const StateTracker = () => {
  const {
    isSetupDone,
    setIsSetupOpen,
    map,
    critOp,
    turningPoint,
    setTurningPoint,
    initiativePlayer,
    setInitiativePlayer,
    player1,
    player2,
  } = useGameTrackerStore()

  const [showMap, setShowMap] = React.useState(false)
  const [showCritOp, setShowCritOp] = React.useState(false)
  const [showTurnInitiative, setShowTurnInitiative] = React.useState(false)
  const [showPrimaryOp, setShowPrimaryOp] = React.useState(false)
  const [showGameResult, setShowGameResult] = React.useState(false)
  const [hasOpenedInitialInitiative, setHasOpenedInitialInitiative] = React.useState(false)

  const tieWinnerName = React.useMemo(() => {
    if (initiativePlayer === 'player1') {
      return player2?.team?.name || 'Player 2'
    }

    if (initiativePlayer === 'player2') {
      return player1?.team?.name || 'Player 1'
    }

    return player1?.team?.name || 'Player 1'
  }, [initiativePlayer, player1?.team?.name, player2?.team?.name])

  const player1InitiativeCards = React.useMemo(() => {
    const rerollCards = player1.hasInitiativeRerollCard
      ? ([{id: 'p1-reroll', kind: 'reroll' as const}] as const)
      : ([] as const)

    const modifierCards = player1.initiativeModifierCards.map((value, index) => ({
      id: `p1-mod-${index}`,
      kind: 'modifier' as const,
      value,
      modifierIndex: index,
    }))

    return [...rerollCards, ...modifierCards]
  }, [player1.hasInitiativeRerollCard, player1.initiativeModifierCards])

  const player2InitiativeCards = React.useMemo(() => {
    const rerollCards = player2.hasInitiativeRerollCard
      ? ([{id: 'p2-reroll', kind: 'reroll' as const}] as const)
      : ([] as const)

    const modifierCards = player2.initiativeModifierCards.map((value, index) => ({
      id: `p2-mod-${index}`,
      kind: 'modifier' as const,
      value,
      modifierIndex: index,
    }))

    return [...rerollCards, ...modifierCards]
  }, [player2.hasInitiativeRerollCard, player2.initiativeModifierCards])

  React.useEffect(() => {
    if (!isSetupDone) {
      setHasOpenedInitialInitiative(false)
      setShowTurnInitiative(false)
      setShowPrimaryOp(false)
      return
    }

    if (!hasOpenedInitialInitiative) {
      setShowTurnInitiative(true)
      setHasOpenedInitialInitiative(true)
    }
  }, [isSetupDone, hasOpenedInitialInitiative])

  if (!isSetupDone) {
    return (
      <div className="flex justify-center items-center">
        <Button onClick={() => setIsSetupOpen(true)}>New Game Setup</Button>
      </div>
    )
  }

  return (
    <div className="w-full rounded-lg border border-zinc-200 bg-zinc-50 p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="text-2xl font-semibold uppercase tracking-wide text-zinc-800">
            Mission
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={() => setShowMap(true)} disabled={!map}>
              Map
            </Button>
            <Button onClick={() => setShowCritOp(true)} disabled={!critOp}>
              Crit Op
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="text-2xl font-semibold uppercase tracking-wide text-zinc-800">
            Turning Point {turningPoint}
          </div>
          <Button
            onClick={() => {
              if (turningPoint >= 4) {
                setShowGameResult(true)
                return
              }

              setTurningPoint(turningPoint + 1)
              setShowTurnInitiative(true)
            }}
          >
            End Turn
          </Button>
        </div>

        <div className="flex flex-col items-center gap-4 text-center">
          <div className="grid grid-cols-3 items-center gap-x-4 gap-y-2 text-center justify-items-center">
            <div className="text-sm font-bold uppercase text-zinc-700">
              {player1?.team?.name || 'Team 1'}
            </div>
            <div />
            <div className="text-sm font-bold uppercase text-zinc-700">
              {player2?.team?.name || 'Team 2'}
            </div>

            <div
              className="w-14 px-2 py-1 text-center text-3xl font-bold text-zinc-900"
              title="Total score"
            >
              {player1.score}
            </div>
            <span className="text-5xl leading-none font-semibold text-zinc-500">-</span>
            <div
              className="w-14 px-2 py-1 text-center text-3xl font-bold text-zinc-900"
              title="Total score"
            >
              {player2.score}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showMap &&
        ReactDOM.createPortal(
          <MapZoomModal selectedMap={map} clearSelection={() => setShowMap(false)} />,
          document.body,
        )}
      {showCritOp &&
        ReactDOM.createPortal(<CritOpModal onClose={() => setShowCritOp(false)} />, document.body)}

      <TurnInitiativeDialog
        open={showTurnInitiative}
        turningPoint={turningPoint}
        player1Name={player1.team?.name || 'Player 1'}
        player2Name={player2.team?.name || 'Player 2'}
        tieWinnerName={tieWinnerName}
        player1Cards={player1InitiativeCards}
        player2Cards={player2InitiativeCards}
        onResolve={({initiativePlayer, rollWinner, selectedPlayer1Cards, selectedPlayer2Cards}) => {
          if (selectedPlayer1Cards.some((card) => card.kind === 'reroll')) {
            player1.setHasInitiativeRerollCard(false)
          }

          const player1ModifierIndexes = selectedPlayer1Cards
            .filter((card) => card.kind === 'modifier' && typeof card.modifierIndex === 'number')
            .map((card) => card.modifierIndex as number)
            .sort((a, b) => b - a)

          player1ModifierIndexes.forEach((index) => {
            player1.removeInitiativeModifierCardAt(index)
          })

          if (selectedPlayer2Cards.some((card) => card.kind === 'reroll')) {
            player2.setHasInitiativeRerollCard(false)
          }

          const player2ModifierIndexes = selectedPlayer2Cards
            .filter((card) => card.kind === 'modifier' && typeof card.modifierIndex === 'number')
            .map((card) => card.modifierIndex as number)
            .sort((a, b) => b - a)

          player2ModifierIndexes.forEach((index) => {
            player2.removeInitiativeModifierCardAt(index)
          })

          setInitiativePlayer(initiativePlayer)

          if (turningPoint <= 3) {
            if (rollWinner === 'player1') {
              player2.addInitiativeModifierCard(turningPoint)
            } else {
              player1.addInitiativeModifierCard(turningPoint)
            }
          }

          if (turningPoint === 1) {
            player1.setCp(player1.cp + 1)
            player2.setCp(player2.cp + 1)

            if (!player1.primaryOp || !player2.primaryOp) {
              setShowPrimaryOp(true)
            }
          } else if (initiativePlayer === 'player1') {
            player1.setCp(player1.cp + 1)
            player2.setCp(player2.cp + 2)
          } else {
            player1.setCp(player1.cp + 2)
            player2.setCp(player2.cp + 1)
          }

          setShowTurnInitiative(false)
        }}
      />

      <PrimaryOpDialog
        open={showPrimaryOp}
        initiativePlayer={initiativePlayer ?? 'player1'}
        player1Name={player1.team?.name || 'Player 1'}
        player2Name={player2.team?.name || 'Player 2'}
        onResolve={({player1PrimaryOp, player2PrimaryOp}) => {
          player1.setPrimaryOp(player1PrimaryOp)
          player2.setPrimaryOp(player2PrimaryOp)
          setShowPrimaryOp(false)
        }}
      />

      <GameResultDialog
        open={showGameResult}
        onClose={() => setShowGameResult(false)}
        player1Name={player1.team?.name || 'Player 1'}
        player2Name={player2.team?.name || 'Player 2'}
        player1Crit={player1.critOpPoints}
        player1Tac={player1.tacOpPoints}
        player1Kill={player1.killOpPoints}
        player1Primary={player1.primaryOp}
        player2Crit={player2.critOpPoints}
        player2Tac={player2.tacOpPoints}
        player2Kill={player2.killOpPoints}
        player2Primary={player2.primaryOp}
      />
    </div>
  )
}
