'use client'
import {useGameTrackerStore} from '@/app/store'
import {Button, CritOpCard, PrimaryOpDialog, ScoreTracker, TurnInitiativeDialog} from '@/components'
import React from 'react'
import Image from 'next/image'
import {MapZoomModal} from '../SetupDialog/SetupDialog'
import ReactDOM from 'react-dom'
import {XMarkIcon} from '@heroicons/react/16/solid'
import {useSession} from 'next-auth/react'
import {toast} from 'sonner'
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
            className={isVisible ? 'opacity-100' : 'opacity-40 grayscale'}
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
  onEndGame,
  gameSessionId,
  isUploaded,
  onUploaded,
  critOpName,
  player1TacOpName,
  player2TacOpName,
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
  onEndGame: () => void
  gameSessionId: string
  isUploaded: boolean
  onUploaded: () => void
  critOpName: string | null
  player1TacOpName: string | null
  player2TacOpName: string | null
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
  const {status: authStatus} = useSession()
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploadMessage, setUploadMessage] = React.useState<string | null>(null)

  const canUpload = authStatus === 'authenticated' && !isUploaded

  const handleUploadResult = async () => {
    if (!canUpload || isUploading) {
      return
    }

    setIsUploading(true)
    setUploadMessage(null)

    try {
      const response = await fetch('/api/game-results', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          gameSessionId,
          teams: {
            player1: {name: player1Name},
            player2: {name: player2Name},
          },
          scores: {
            player1: {
              critOp: player1Crit,
              tacOp: player1Tac,
              killOp: player1Kill,
              primaryBonus: player1PrimaryBonus,
              total: player1Total,
            },
            player2: {
              critOp: player2Crit,
              tacOp: player2Tac,
              killOp: player2Kill,
              primaryBonus: player2PrimaryBonus,
              total: player2Total,
            },
          },
          selections: {
            critOp: critOpName,
            player1TacOp: player1TacOpName,
            player2TacOp: player2TacOpName,
            player1PrimaryOp: player1Primary,
            player2PrimaryOp: player2Primary,
          },
        }),
      })

      if (response.status === 409) {
        onUploaded()
        setUploadMessage('This game has already been uploaded.')
        return
      }

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      onUploaded()
      setUploadMessage(null)
      toast.success('Game result uploaded.')
    } catch {
      setUploadMessage('Unable to upload result. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

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
      setUploadMessage(null)
      return
    }

    setRevealState(EMPTY_REVEAL_STATE)
    setPrimaryReveal(EMPTY_PRIMARY_REVEAL_STATE)
    setTotalReveal(EMPTY_TOTAL_REVEAL_STATE)
    setUploadMessage(null)

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
        <div className="mr-auto flex items-center gap-3">
          <div className="text-sm text-zinc-600">
            {uploadMessage
              ? uploadMessage
              : authStatus !== 'authenticated'
                ? 'Sign in to upload this game result.'
                : isUploaded
                  ? 'This game result has already been uploaded.'
                  : null}
          </div>
          {authStatus === 'authenticated' ? (
            <Button onClick={handleUploadResult} disabled={!canUpload || isUploading}>
              Upload
            </Button>
          ) : null}
        </div>
        <Button outline onClick={onClose}>
          Close
        </Button>
        <Button onClick={onEndGame}>End game</Button>
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
    resetGame,
    map,
    critOp,
    turningPoint,
    setTurningPoint,
    initiativePlayer,
    setInitiativePlayer,
    gameSessionId,
    isGameResultUploaded,
    markGameResultUploaded,
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
      <div className="flex min-h-[70dvh] w-full items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 p-6 shadow-sm">
        <Button onClick={() => setIsSetupOpen(true)}>New Game</Button>
      </div>
    )
  }

  return (
    <div className="w-full rounded-lg">
      <div className="flex items-center justify-between gap-4 lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Mission */}
        <div className="flex items-center gap-2 lg:flex-col lg:gap-4 lg:text-center">
          <div className="hidden text-[1.05rem] font-semibold uppercase tracking-wide text-zinc-800 lg:block">
            Mission
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <Button onClick={() => setShowMap(true)} disabled={!map}>
              Map
            </Button>
            <Button onClick={() => setShowCritOp(true)} disabled={!critOp}>
              Crit Op
            </Button>
          </div>
        </div>

        {/* Turning Point */}
        <div className="flex items-center gap-2 lg:flex-col lg:items-center lg:gap-4">
          <div className="text-sm font-semibold uppercase tracking-wide text-zinc-800 lg:text-[1.05rem]">
            TP{turningPoint}
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

        {/* Score */}
        <div className="flex items-center justify-end gap-4 lg:justify-center">
          <span className="text-3xl font-bold text-zinc-900 lg:text-4xl">{player1.score}</span>
          <span className="text-2xl font-semibold text-zinc-500 lg:text-3xl">-</span>
          <span className="text-3xl font-bold text-zinc-900 lg:text-4xl">{player2.score}</span>
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
        onEndGame={() => {
          setShowGameResult(false)
          resetGame()
        }}
        gameSessionId={gameSessionId}
        isUploaded={isGameResultUploaded}
        onUploaded={markGameResultUploaded}
        critOpName={critOp?.name ?? null}
        player1TacOpName={player1.tacOp?.name ?? null}
        player2TacOpName={player2.tacOp?.name ?? null}
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
