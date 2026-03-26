'use client'

import React from 'react'
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@/components/dialog'
import {Button} from '@/components'
import {Heading} from '@/components/heading'

type InitiativePlayer = 'player1' | 'player2'

interface TurnInitiativeDialogProps {
  open: boolean
  turningPoint: number
  player1Name: string
  player2Name: string
  onResolve: (initiativePlayer: InitiativePlayer) => void
}

export const TurnInitiativeDialog = ({
  open,
  turningPoint,
  player1Name,
  player2Name,
  onResolve,
}: TurnInitiativeDialogProps) => {
  const [selectedInitiative, setSelectedInitiative] = React.useState<InitiativePlayer | null>(null)

  React.useEffect(() => {
    if (!open) {
      setSelectedInitiative(null)
    }
  }, [open])

  const initiativeName = selectedInitiative === 'player1' ? player1Name : player2Name
  const noInitiativeName = selectedInitiative === 'player1' ? player2Name : player1Name

  return (
    <Dialog size="3xl" open={open} onClose={() => {}}>
      <DialogTitle className="text-4xl uppercase bold">Turn {turningPoint}: Initiative</DialogTitle>
      <DialogDescription>Roll-off and assign initiative for this turning point.</DialogDescription>

      <DialogBody>
        <Heading className="mt-6" level={6}>
          Roll-off winner chooses who has initiative:
        </Heading>

        <div className="mt-4 flex gap-4">
          <Button
            color={selectedInitiative === 'player1' ? 'primary' : 'secondary'}
            onClick={() => setSelectedInitiative('player1')}
            className="flex-1"
          >
            {player1Name}
          </Button>
          <Button
            color={selectedInitiative === 'player2' ? 'primary' : 'secondary'}
            onClick={() => setSelectedInitiative('player2')}
            className="flex-1"
          >
            {player2Name}
          </Button>
        </div>

        {selectedInitiative && (
          <ul className="mt-4 list-disc list-inside">
            {turningPoint === 1 ? (
              <>
                <li>{initiativeName} has initiative.</li>
                <li>{noInitiativeName} has no initiative.</li>
                <li>Both players gain 1 CP in turning point 1.</li>
              </>
            ) : (
              <>
                <li>{initiativeName} has initiative and gains 1 CP.</li>
                <li>{noInitiativeName} has no initiative and gains 2 CP.</li>
              </>
            )}
          </ul>
        )}
      </DialogBody>

      <DialogActions>
        <Button
          disabled={!selectedInitiative}
          onClick={() => selectedInitiative && onResolve(selectedInitiative)}
        >
          Confirm Initiative
        </Button>
      </DialogActions>
    </Dialog>
  )
}
