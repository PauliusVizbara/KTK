'use client'
import {Button, SetupDialog} from '@/components'
import React, {useContext} from 'react'

export const StateTracker = () => {
  const [turn, setTurn] = React.useState(0)

  return (
    <div className="flex justify-between items-center border p-2 border-gray-300">
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
