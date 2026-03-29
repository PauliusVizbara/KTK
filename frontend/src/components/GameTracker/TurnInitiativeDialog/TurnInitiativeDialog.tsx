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
import {ChevronDownIcon} from '@heroicons/react/16/solid'

type InitiativePlayer = 'player1' | 'player2'
type CardKind = 'reroll' | 'modifier'

export interface InitiativeCard {
  id: string
  kind: CardKind
  value?: number
  modifierIndex?: number
}

interface TurnInitiativeDialogProps {
  open: boolean
  turningPoint: number
  player1Name: string
  player2Name: string
  tieWinnerName: string
  player1Cards: InitiativeCard[]
  player2Cards: InitiativeCard[]
  onResolve: (payload: {
    rollWinner: InitiativePlayer
    initiativePlayer: InitiativePlayer
    selectedPlayer1Cards: InitiativeCard[]
    selectedPlayer2Cards: InitiativeCard[]
  }) => void
}

const InitiativeMiniCard = ({
  card,
  selected,
  onClick,
}: {
  card: InitiativeCard
  selected: boolean
  onClick: () => void
}) => {
  const label = card.kind === 'reroll' ? 'Re-roll' : `+${card.value}/-${card.value}`

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold transition-colors ${
        selected
          ? 'border-[#ef4e0a] bg-[#ef4e0a] text-white'
          : 'border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50'
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${selected ? 'bg-white' : 'bg-zinc-300'}`} />
      {label}
    </button>
  )
}

export const TurnInitiativeDialog = ({
  open,
  turningPoint,
  player1Name,
  player2Name,
  tieWinnerName,
  player1Cards,
  player2Cards,
  onResolve,
}: TurnInitiativeDialogProps) => {
  const [selectedInitiative, setSelectedInitiative] = React.useState<InitiativePlayer | null>(null)
  const [selectedRollWinner, setSelectedRollWinner] = React.useState<InitiativePlayer | null>(null)
  const [selectedPlayer1CardIds, setSelectedPlayer1CardIds] = React.useState<string[]>([])
  const [selectedPlayer2CardIds, setSelectedPlayer2CardIds] = React.useState<string[]>([])
  const [expandedSection, setExpandedSection] = React.useState<'rolloff' | 'initiative' | null>(
    'rolloff',
  )

  React.useEffect(() => {
    if (!open) {
      setSelectedInitiative(null)
      setSelectedRollWinner(null)
      setSelectedPlayer1CardIds([])
      setSelectedPlayer2CardIds([])
      setExpandedSection('rolloff')
    }
  }, [open])

  const handlePickRollWinner = (winner: InitiativePlayer) => {
    setSelectedRollWinner(winner)
    setSelectedInitiative(null)
    setExpandedSection('initiative')
  }

  const initiativeName = selectedInitiative === 'player1' ? player1Name : player2Name
  const noInitiativeName = selectedInitiative === 'player1' ? player2Name : player1Name
  const selectedPlayer1Cards = player1Cards.filter((card) =>
    selectedPlayer1CardIds.includes(card.id),
  )
  const selectedPlayer2Cards = player2Cards.filter((card) =>
    selectedPlayer2CardIds.includes(card.id),
  )
  const rollLoser =
    selectedRollWinner === 'player1'
      ? ('player2' as const)
      : selectedRollWinner === 'player2'
        ? ('player1' as const)
        : null
  const rollLoserName =
    rollLoser === 'player1' ? player1Name : rollLoser === 'player2' ? player2Name : null
  const gainedCardText =
    turningPoint <= 3 ? `+${turningPoint}/-${turningPoint} Initiative Card` : null
  const rollOffSummary = selectedRollWinner
    ? `${selectedRollWinner === 'player1' ? player1Name : player2Name} won the roll off`
    : 'Roll off'
  const initiativeSummary = selectedInitiative
    ? `${selectedInitiative === 'player1' ? player1Name : player2Name} has initiative`
    : 'Choose initiative'

  return (
    <Dialog size="3xl" open={open} onClose={() => {}}>
      <DialogTitle className="text-4xl uppercase bold">Turn {turningPoint}: Initiative</DialogTitle>
      <DialogDescription>Roll-off and assign initiative for this turning point.</DialogDescription>

      <DialogBody>
        <div className="flex flex-col min-h-[360px] space-y-4">
          <section className="rounded-md border-2 border-zinc-300 bg-white">
            <button
              type="button"
              className="flex w-full items-center justify-between px-4 py-3 text-left"
              onClick={() => setExpandedSection('rolloff')}
            >
              <span className="flex items-center gap-2 text-lg font-semibold text-zinc-900">
                {selectedRollWinner ? '✓' : '•'} {rollOffSummary}
              </span>
              <ChevronDownIcon
                className={`h-5 w-5 text-zinc-600 transition-transform ${
                  expandedSection === 'rolloff' ? 'rotate-180' : ''
                }`}
              />
            </button>

            <div
              className={`grid transition-all duration-300 ease-out ${
                expandedSection === 'rolloff'
                  ? 'grid-rows-[1fr] opacity-100'
                  : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden border-t border-zinc-200 px-4 py-4">
                <Heading level={6}>Select roll-off winner</Heading>

                <div className="mt-3 flex gap-4">
                  <Button
                    color={selectedRollWinner === 'player1' ? 'primary' : 'secondary'}
                    onClick={() => handlePickRollWinner('player1')}
                    className="flex-1"
                  >
                    {player1Name}
                  </Button>
                  <Button
                    color={selectedRollWinner === 'player2' ? 'primary' : 'secondary'}
                    onClick={() => handlePickRollWinner('player2')}
                    className="flex-1"
                  >
                    {player2Name}
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-md border-2 border-zinc-300 bg-white">
            <button
              type="button"
              className="flex w-full items-center justify-between px-4 py-3 text-left"
              onClick={() => {
                if (!selectedRollWinner) return
                setExpandedSection('initiative')
              }}
            >
              <span className="flex items-center gap-2 text-lg font-semibold text-zinc-900">
                {selectedInitiative ? '✓' : '•'} {initiativeSummary}
              </span>
              <ChevronDownIcon
                className={`h-5 w-5 text-zinc-600 transition-transform ${
                  expandedSection === 'initiative' ? 'rotate-180' : ''
                } ${selectedRollWinner ? '' : 'opacity-40'}`}
              />
            </button>

            <div
              className={`grid transition-all duration-300 ease-out ${
                expandedSection === 'initiative'
                  ? 'grid-rows-[1fr] opacity-100'
                  : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden border-t border-zinc-200 px-4 py-4">
                <Heading level={6}>
                  {(selectedRollWinner === 'player1' ? player1Name : player2Name) +
                    ' chooses who has initiative:'}
                </Heading>

                <div className="mt-4 flex gap-4">
                  <Button
                    disabled={!selectedRollWinner}
                    color={selectedInitiative === 'player1' ? 'primary' : 'secondary'}
                    onClick={() => {
                      setSelectedInitiative('player1')
                      setExpandedSection(null)
                    }}
                    className="flex-1"
                  >
                    {player1Name}
                  </Button>
                  <Button
                    disabled={!selectedRollWinner}
                    color={selectedInitiative === 'player2' ? 'primary' : 'secondary'}
                    onClick={() => {
                      setSelectedInitiative('player2')
                      setExpandedSection(null)
                    }}
                    className="flex-1"
                  >
                    {player2Name}
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-md border border-zinc-200 bg-zinc-50 px-4 py-4">
            <Heading level={6}>Select used initiative cards in this roll-off</Heading>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <div className="mb-2 text-xs uppercase text-zinc-500">{player1Name}</div>
                <div className="flex flex-wrap gap-2">
                  {player1Cards.length === 0 ? (
                    <div className="text-sm text-zinc-500">No initiative cards.</div>
                  ) : (
                    player1Cards.map((card) => (
                      <InitiativeMiniCard
                        key={card.id}
                        card={card}
                        selected={selectedPlayer1CardIds.includes(card.id)}
                        onClick={() => {
                          setSelectedPlayer1CardIds((current) =>
                            current.includes(card.id)
                              ? current.filter((id) => id !== card.id)
                              : [...current, card.id],
                          )
                        }}
                      />
                    ))
                  )}
                </div>
              </div>

              <div>
                <div className="mb-2 text-xs uppercase text-zinc-500">{player2Name}</div>
                <div className="flex flex-wrap gap-2">
                  {player2Cards.length === 0 ? (
                    <div className="text-sm text-zinc-500">No initiative cards.</div>
                  ) : (
                    player2Cards.map((card) => (
                      <InitiativeMiniCard
                        key={card.id}
                        card={card}
                        selected={selectedPlayer2CardIds.includes(card.id)}
                        onClick={() => {
                          setSelectedPlayer2CardIds((current) =>
                            current.includes(card.id)
                              ? current.filter((id) => id !== card.id)
                              : [...current, card.id],
                          )
                        }}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">
              {selectedRollWinner ? (
                rollLoserName && gainedCardText ? (
                  <div>
                    <span className="font-semibold">{rollLoserName}</span> gains a{' '}
                    <span className="font-semibold">{gainedCardText}</span>.
                  </div>
                ) : (
                  <div>No new initiative card is gained this turn.</div>
                )
              ) : (
                <div>Pick a roll-off winner to see card gain summary.</div>
              )}
            </div>

            <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">
              {selectedInitiative ? (
                <div className="space-y-1">
                  <div>
                    <span className="font-semibold">{initiativeName}</span> gets initiative
                  </div>
                  <div>
                    <span className="font-semibold">{initiativeName}</span> gets 1 CP
                  </div>
                  <div>
                    <span className="font-semibold">{noInitiativeName}</span> gets{' '}
                    {turningPoint === 1 ? '1' : '2'} CP
                  </div>
                </div>
              ) : (
                <div>Choose initiative to see CP summary.</div>
              )}
            </div>
          </section>
        </div>
      </DialogBody>

      <DialogActions>
        <Button
          disabled={!selectedInitiative || !selectedRollWinner}
          onClick={() =>
            selectedInitiative &&
            selectedRollWinner &&
            onResolve({
              initiativePlayer: selectedInitiative,
              rollWinner: selectedRollWinner,
              selectedPlayer1Cards,
              selectedPlayer2Cards,
            })
          }
        >
          Confirm Initiative
        </Button>
      </DialogActions>
    </Dialog>
  )
}
