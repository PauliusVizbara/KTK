'use client'
import {useGameTrackerStore} from '@/app/store'
import {Button} from '@/components'
import {MinusIcon, PlusIcon} from '@heroicons/react/16/solid'
import React from 'react'

const PlayerResource = ({
  name,
  cp,
  setCp,
}: {
  name: string | null
  cp: number
  setCp: (cp: number) => void
}) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-sm font-bold text-zinc-500">{name || 'Player'}</div>
      <div className="flex items-center gap-4">
        <Button onClick={() => setCp(Math.max(0, cp - 1))}>
          <MinusIcon className="w-4 h-4" />
        </Button>
        <div className="text-2xl font-bold w-8 text-center">{cp}</div>
        <Button onClick={() => setCp(cp + 1)}>
          <PlusIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

export const ResourceTracker = () => {
  const {player1, player2} = useGameTrackerStore()

  return (
    <div className="flex flex-col items-center w-full p-4 bg-white shadow rounded-lg border border-zinc-200">
      <div className="text-sm font-bold uppercase text-zinc-500 mb-4">Command Points</div>
      <div className="flex justify-around w-full">
        <PlayerResource name={player1.team.name} cp={player1.cp} setCp={player1.setCp} />
        <div className="w-px bg-zinc-200 mx-4" />
        <PlayerResource name={player2.team.name} cp={player2.cp} setCp={player2.setCp} />
      </div>
    </div>
  )
}
