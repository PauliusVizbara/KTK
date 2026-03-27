'use client'
import {useGameTrackerStore} from '@/app/store'
import {Button, TacOpCard} from '@/components'
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@/components/dialog'
import {MinusIcon, PlusIcon} from '@heroicons/react/16/solid'
import React from 'react'

type TacOpLite = {_id?: string; name?: string | null} | null
type EquipmentLite = {name: string; description: string}
type EquipmentPreview = {title: string; items: EquipmentLite[]}

const PlayerResource = ({
  name,
  cp,
  setCp,
  tacOp,
  isTacOpRevealed,
  onRevealTacOp,
  onPreviewTacOp,
  equipmentItems,
  onPreviewEquipment,
}: {
  name: string | null
  cp: number
  setCp: (cp: number) => void
  tacOp: TacOpLite
  isTacOpRevealed: boolean
  onRevealTacOp: () => void
  onPreviewTacOp: () => void
  equipmentItems: EquipmentLite[]
  onPreviewEquipment: () => void
}) => {
  return (
    <section className="w-full overflow-hidden rounded-lg border-2 border-zinc-300 bg-zinc-50 shadow-sm">
      <div className="flex items-center gap-4 border-b border-zinc-300 bg-white px-4 py-2">
        <div className="text-base font-bold text-zinc-800">{name || 'Player'}</div>
        <div className="h-px flex-1 bg-zinc-300" />
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 text-center md:grid-cols-3 md:items-start">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Command Points
          </div>
          <div className="mt-2 flex items-center justify-center gap-3">
            <Button onClick={() => setCp(Math.max(0, cp - 1))}>
              <MinusIcon className="h-4 w-4" />
            </Button>
            <div className="min-w-8 text-center text-3xl font-bold text-zinc-900">{cp}</div>
            <Button onClick={() => setCp(cp + 1)}>
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="text-xs text-zinc-700">
          <div className="font-semibold uppercase text-zinc-500">Tac Op</div>
          {!tacOp && <div className="mt-1 text-sm text-zinc-800">Not selected</div>}
          {tacOp && isTacOpRevealed && (
            <div className="mt-2">
              <Button outline onClick={onPreviewTacOp}>
                {tacOp.name ?? 'Unnamed Tac Op'}
              </Button>
            </div>
          )}
          {tacOp && !isTacOpRevealed && (
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <Button outline onClick={onPreviewTacOp}>
                View
              </Button>
              <Button onClick={onRevealTacOp}>Reveal</Button>
            </div>
          )}
        </div>

        <div className="text-xs text-zinc-700">
          <div className="font-semibold uppercase text-zinc-500">Equipment</div>
          {equipmentItems.length > 0 ? (
            <div className="mt-2">
              <Button outline onClick={onPreviewEquipment}>
                View Equipment
              </Button>
            </div>
          ) : (
            <div className="mt-2 text-sm text-zinc-500">None selected</div>
          )}
        </div>
      </div>
    </section>
  )
}

export const ResourceTracker = () => {
  const {player1, player2} = useGameTrackerStore()
  const [player1TacOpRevealed, setPlayer1TacOpRevealed] = React.useState(false)
  const [player2TacOpRevealed, setPlayer2TacOpRevealed] = React.useState(false)
  const [previewTacOp, setPreviewTacOp] = React.useState<TacOpLite>(null)
  const [previewEquipment, setPreviewEquipment] = React.useState<EquipmentPreview | null>(null)

  const player1EquipmentItems = player1.equipment.map((item) => ({
    name: item.name ?? 'Unnamed equipment',
    description: item.description ?? 'No description available.',
  }))

  const player2EquipmentItems = player2.equipment.map((item) => ({
    name: item.name ?? 'Unnamed equipment',
    description: item.description ?? 'No description available.',
  }))

  React.useEffect(() => {
    setPlayer1TacOpRevealed(false)
  }, [player1.tacOp?._id])

  React.useEffect(() => {
    setPlayer2TacOpRevealed(false)
  }, [player2.tacOp?._id])

  return (
    <>
      <div className="flex w-full flex-col items-center rounded-lg border border-zinc-200 bg-white p-4 shadow">
        <div className="grid w-full grid-cols-2 gap-4">
          <PlayerResource
            name={player1.team?.name ?? null}
            cp={player1.cp}
            setCp={player1.setCp}
            tacOp={player1.tacOp}
            isTacOpRevealed={player1TacOpRevealed}
            onRevealTacOp={() => setPlayer1TacOpRevealed(true)}
            onPreviewTacOp={() => setPreviewTacOp(player1.tacOp)}
            equipmentItems={player1EquipmentItems}
            onPreviewEquipment={() =>
              setPreviewEquipment({
                title: `${player1.team?.name ?? 'Player 1'} Equipment`,
                items: player1EquipmentItems,
              })
            }
          />
          <PlayerResource
            name={player2.team?.name ?? null}
            cp={player2.cp}
            setCp={player2.setCp}
            tacOp={player2.tacOp}
            isTacOpRevealed={player2TacOpRevealed}
            onRevealTacOp={() => setPlayer2TacOpRevealed(true)}
            onPreviewTacOp={() => setPreviewTacOp(player2.tacOp)}
            equipmentItems={player2EquipmentItems}
            onPreviewEquipment={() =>
              setPreviewEquipment({
                title: `${player2.team?.name ?? 'Player 2'} Equipment`,
                items: player2EquipmentItems,
              })
            }
          />
        </div>
      </div>

      <Dialog size="3xl" open={Boolean(previewTacOp)} onClose={() => setPreviewTacOp(null)}>
        <DialogTitle className="text-2xl">Tac Op</DialogTitle>
        <DialogDescription>Preview tactical operation details.</DialogDescription>
        <DialogBody>{previewTacOp ? <TacOpCard tacOp={previewTacOp as any} /> : null}</DialogBody>
        <DialogActions>
          <Button onClick={() => setPreviewTacOp(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog size="md" open={Boolean(previewEquipment)} onClose={() => setPreviewEquipment(null)}>
        <DialogTitle className="text-2xl">{previewEquipment?.title ?? 'Equipment'}</DialogTitle>
        <DialogDescription>Equipment details</DialogDescription>
        <DialogBody>
          {previewEquipment && previewEquipment.items.length > 0 ? (
            <div className="max-h-[60vh] space-y-2 overflow-y-auto pr-1">
              {previewEquipment.items.map((item) => (
                <div key={item.name} className="rounded border border-zinc-200 px-3 py-2">
                  <div className="text-sm font-semibold text-zinc-800">{item.name}</div>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-700">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-800">No equipment selected.</p>
          )}
        </DialogBody>
        <DialogActions>
          <Button onClick={() => setPreviewEquipment(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
