'use client'
import {useGameTrackerStore} from '@/app/store'
import {Button, CritOpCard, TurnInitiativeDialog} from '@/components'
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

  React.useEffect(() => {
    if (!isSetupDone) {
      setHasOpenedInitialInitiative(false)
      setShowTurnInitiative(false)
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
    <div className="flex justify-between items-center w-full p-4 bg-white shadow rounded-lg border border-zinc-200">
      {/* Left: Map and Crit Op */}
      <div className="flex gap-4">
        <Button onClick={() => setShowMap(true)}>Map</Button>
        <Button onClick={() => setShowCritOp(true)}>Crit Op</Button>
      </div>

      {/* Middle: Turning Point */}
      <div className="flex flex-col items-center gap-2">
        <div className="text-sm font-bold uppercase text-zinc-500">Turning point</div>
        <div className="text-4xl font-bold">{turningPoint}</div>
        <Button
          onClick={() => {
            setTurningPoint(turningPoint + 1)
            setShowTurnInitiative(true)
          }}
        >
          End Turn
        </Button>
      </div>

      {/* Right: Score */}
      <div className="flex flex-col items-end gap-1">
        <div className="text-sm font-bold uppercase text-zinc-500">Score</div>
        <div className="flex items-center gap-4 text-4xl font-bold">
          <div className="flex flex-col items-center">
            <span className="text-xs font-normal text-zinc-400 mb-1">
              {player1?.team?.name || 'P1'}
            </span>
            <input
              type="number"
              value={player1.score}
              onChange={(e) => player1.setScore(parseInt(e.target.value) || 0)}
              className="w-16 text-center bg-transparent border-b border-zinc-300 focus:outline-none focus:border-primary"
            />
          </div>
          <span className="text-zinc-300">-</span>
          <div className="flex flex-col items-center">
            <span className="text-xs font-normal text-zinc-400 mb-1">
              {player2?.team?.name || 'P2'}
            </span>
            <input
              type="number"
              value={player2.score}
              onChange={(e) => player2.setScore(parseInt(e.target.value) || 0)}
              className="w-16 text-center bg-transparent border-b border-zinc-300 focus:outline-none focus:border-primary"
            />
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
        onResolve={(initiativePlayer) => {
          setInitiativePlayer(initiativePlayer)

          if (turningPoint === 1) {
            player1.setCp(player1.cp + 1)
            player2.setCp(player2.cp + 1)
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
    </div>
  )
}
