'use client'
import {useState} from 'react'

export default function GameTracker() {
  const [initiative, setInitiative] = useState<'PLAYER1' | 'PLAYER2'>('PLAYER1')
  const [turn, setTurn] = useState(0)
  const [score, setScore] = useState({PLAYER1: 0, PLAYER2: 0})
  return (
    <div className="grid grid-rows-[auto_1fr] grid-cols-[1fr_3fr_1fr]">
      <div className="col-span-3 flex justify-between items-center h-12">
        <div>Turning Point</div>
        <div>
          {[0, 1, 2, 3, 4].map((t) => (
            <button
              key={t}
              onClick={() => setTurn(t)}
              className={`px-3 py-2 m-2 ${turn === t ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex">
          <h2>Player 1</h2>
          <h2>
            | {score.PLAYER1} - {score.PLAYER2} |
          </h2>
          <h2>Player 2</h2>
        </div>
      </div>
      <div>2</div>
      <div>3</div>
      <div>4</div>
      <div>5</div>
    </div>
  )
}
