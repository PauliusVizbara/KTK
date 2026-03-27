'use client'

import React from 'react'
import {Button} from '@/components'
import {Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle} from '@/components/dialog'
import {Heading} from '@/components/heading'

type InitiativePlayer = 'player1' | 'player2'
type PrimaryOp = 'critical' | 'tactical' | 'kill'

interface PrimaryOpDialogProps {
  open: boolean
  initiativePlayer: InitiativePlayer
  player1Name: string
  player2Name: string
  onResolve: (selection: {player1PrimaryOp: PrimaryOp; player2PrimaryOp: PrimaryOp}) => void
}

const OPTION_LABELS: Record<PrimaryOp, string> = {
  critical: 'Critical Op',
  tactical: 'Tactical Op',
  kill: 'Kill Op',
}

export const PrimaryOpDialog = ({
  open,
  initiativePlayer,
  player1Name,
  player2Name,
  onResolve,
}: PrimaryOpDialogProps) => {
  const [phase, setPhase] = React.useState<'first-select' | 'second-select'>('first-select')
  const [player1Selection, setPlayer1Selection] = React.useState<PrimaryOp | null>(null)
  const [player2Selection, setPlayer2Selection] = React.useState<PrimaryOp | null>(null)

  React.useEffect(() => {
    if (!open) {
      setPhase('first-select')
      setPlayer1Selection(null)
      setPlayer2Selection(null)
    }
  }, [open])

  const firstPlayer = initiativePlayer
  const secondPlayer: InitiativePlayer = initiativePlayer === 'player1' ? 'player2' : 'player1'

  const firstPlayerName = firstPlayer === 'player1' ? player1Name : player2Name
  const secondPlayerName = secondPlayer === 'player1' ? player1Name : player2Name
  const currentPlayer = phase === 'first-select' ? firstPlayer : secondPlayer
  const currentPlayerName = phase === 'first-select' ? firstPlayerName : secondPlayerName
  const currentSelection = currentPlayer === 'player1' ? player1Selection : player2Selection

  const selectForPlayer = (player: InitiativePlayer, value: PrimaryOp) => {
    if (player === 'player1') {
      setPlayer1Selection(value)
    } else {
      setPlayer2Selection(value)
    }
  }

  const handleSelect = (value: PrimaryOp) => {
    selectForPlayer(currentPlayer, value)
  }

  const handleContinue = () => {
    if (!currentSelection) {
      return
    }

    if (phase === 'first-select') {
      setPhase('second-select')
      return
    }

    const nextPlayer1Selection = player1Selection as PrimaryOp
    const nextPlayer2Selection = player2Selection as PrimaryOp

    onResolve({
      player1PrimaryOp: nextPlayer1Selection,
      player2PrimaryOp: nextPlayer2Selection,
    })
  }

  return (
    <Dialog size="md" open={open} onClose={() => {}}>
      <DialogTitle className="text-2xl font-bold uppercase">Select Primary Op</DialogTitle>
      <DialogDescription>
        On Turning Point 1, each player secretly chooses one primary operation.
      </DialogDescription>

      <DialogBody>
        <div className="space-y-3">
          <Heading level={6}>{currentPlayerName} selects Primary Op</Heading>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {(Object.keys(OPTION_LABELS) as PrimaryOp[]).map((option) => (
              <Button
                key={option}
                color={currentSelection === option ? 'primary' : 'secondary'}
                onClick={() => handleSelect(option)}
              >
                {OPTION_LABELS[option]}
              </Button>
            ))}
          </div>

          {phase === 'second-select' && (
            <div className="text-xs text-zinc-500">
              {firstPlayerName} selection is locked.
            </div>
          )}
        </div>
      </DialogBody>

      <DialogActions>
        <Button onClick={handleContinue} disabled={!currentSelection}>
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  )
}
