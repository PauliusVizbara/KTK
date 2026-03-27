'use client'
import {useGameTrackerStore} from '@/app/store'
import {Button, CritOpCard, PrimaryOpDialog, ScoreTracker, TurnInitiativeDialog} from '@/components'
import React from 'react'
import {MapZoomModal} from '../SetupDialog/SetupDialog'
import ReactDOM from 'react-dom'
import {XMarkIcon} from '@heroicons/react/16/solid'

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
    </div>
  )
}
