'use client'
import {useState} from 'react'

export default function GameTracker() {
  const [initiative, setInitiative] = useState<'PLAYER1' | 'PLAYER2'>('PLAYER1')
  const [turn, setTurn] = useState(-1)
  const [score, setScore] = useState({PLAYER1: 0, PLAYER2: 0})
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center h-12">
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
          <h1>
            Player 1 | {score.PLAYER1} - {score.PLAYER2} | Player 2
          </h1>
        </div>
      </div>
      <div className=" mt-6 grid grid-cols-[1fr_2fr_2fr_2fr_2fr_2fr_2fr_2fr_2fr_1fr] gap-6 text-center">
        <div className="font-bold"></div>
        <div className="font-bold">TP1</div>
        <div className="font-bold">TP2</div>
        <div className="font-bold">TP3</div>
        <div className="font-bold border-r-2">TP4</div>
        <div className="font-bold">TP4</div>
        <div className="font-bold">TP3</div>
        <div className="font-bold">TP2</div>
        <div className="font-bold">TP1</div>
        <div className="font-bold"></div>

        <div className="font-bold">Crit Op.</div>
        <div className="font-bold"></div>
        <div className="font-bold">O O</div>
        <div className="font-bold">O O</div>
        <div className="font-bold border-r-2">O O</div>
        <div className="font-bold">O O</div>
        <div className="font-bold">O O</div>
        <div className="font-bold">O O</div>
        <div className="font-bold">O O</div>
        <div className="font-bold">Crit Op.</div>

        <div className="font-bold">Tac Op.</div>
        <div className="font-bold"></div>
        <div className="font-bold">O O</div>
        <div className="font-bold">O O</div>
        <div className="font-bold border-r-2">O O</div>
        <div className="font-bold">O O</div>
        <div className="font-bold">O O</div>
        <div className="font-bold">O O</div>
        <div className="font-bold">O O</div>
        <div className="font-bold">Tac Op.</div>

        <div className="font-bold">Kill Op.</div>
        <div className="font-bold"></div>
        <div className="font-bold">O O</div>
        <div className="font-bold">O O</div>
        <div className="font-bold border-r-2">O O</div>
        <div className="font-bold">O O</div>
        <div className="font-bold">O O</div>
        <div className="font-bold">O O</div>
        <div className="font-bold">O O</div>
        <div className="font-bold">Kill Op.</div>

        <div className="font-bold col-span-2">Command Points</div>
        <div className="font-bold col-span-2">Tac Op.</div>
        <div className="font-bold">Enemy operatives</div>
        <div className="font-bold">Enemy operatives</div>
        <div className="font-bold col-span-2">Tac Op.</div>
        <div className="font-bold col-span-2">Command Points</div>
      </div>
    </div>
  )
}
