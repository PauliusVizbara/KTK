'use client'
import {useState} from 'react'

export default function GameTracker() {
  const [initiative, setInitiative] = useState<'PLAYER1' | 'PLAYER2'>('PLAYER1')
  const [turn, setTurn] = useState(0)
  const [score, setScore] = useState({PLAYER1: 0, PLAYER2: 0})
  return (
    <div className="grid grid-rows-[auto_1fr] grid-cols-[1fr_3fr_1fr]">
      <div className="col-span-3 flex justify-between items-center h-12">
        <div className="uppercase font-bold">Turning Point</div>
        <div>
          {[0, 1, 2, 3, 4].map((t) => (
            <button
              key={t}
              onClick={() => setTurn(t)}
              className={`rounded-sm cursor-pointer px-3 py-2 m-2 font-bold ${turn === t ? 'bg-primary text-white' : 'bg-gray-200'}`}
            >
              {t == 0 ? 'Setup' : `${t}`}
            </button>
          ))}
          <button
            onClick={() => {}}
            className={`rounded-sm cursor-pointer px-3 py-2 m-2 bg-gray-200 text-black font-bold`}
          >
            End game
          </button>
        </div>
        <div className="flex">
          <h2>Player 1</h2>
          <h1>
            | {score.PLAYER1} - {score.PLAYER2} |
          </h1>
          <h2>Player 2</h2>
        </div>
      </div>
      <div>2</div>
      <div>3</div>
      <div>4</div>
    </div>
  )
}
