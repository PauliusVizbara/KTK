'use client'
import {useGameTrackerStore} from '@/app/store'
import {Button} from '@/components'
import React from 'react'

export const StateTracker = () => {
  const [turn, setTurn] = React.useState(0)

  const {isSetupDone, setIsSetupOpen} = useGameTrackerStore()

  if (!isSetupDone) {
    return (
      <div className="flex justify-center items-center">
        <Button onClick={() => setIsSetupOpen(true)}>New Game Setup</Button>
      </div>
    )
  }

  return (
    <div className="flex justify-between items-center">
      <div className="uppercase font-bold">
        <h1>SCORE 1</h1>
      </div>
      <div>
        {[0, 1, 2, 3, 4].map((t) => (
          <Button
            color={turn === t ? 'primary' : 'secondary'}
            key={t}
            onClick={() => setTurn(t)}
            className={`cursor-pointer px-3 py-2 m-2 font-bold ${turn === t ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            {t == 0 ? 'Setup' : `${t}`}
          </Button>
        ))}
        <Button
          color="secondary"
          onClick={() => {}}
          className={`cursor-pointer px-3 py-2 m-2 bg-gray-200 text-black font-bold`}
        >
          End game
        </Button>
      </div>
      <div className="uppercase font-bold">
        <h1>SCORE 2</h1>
      </div>
    </div>
  )
}
