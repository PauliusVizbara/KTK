'use client'
import {Button} from '@/components/button'
import {Dropdown, DropdownButton, DropdownItem, DropdownMenu} from '@/components/dropdown'
import {ChevronDownIcon} from '@heroicons/react/16/solid'
import {useState} from 'react'

export default function GameTracker() {
  const [initiative, setInitiative] = useState<'PLAYER1' | 'PLAYER2'>('PLAYER1')

  const [turn, setTurn] = useState(-1)
  const [score, setScore] = useState({PLAYER1: 0, PLAYER2: 0})
  const [player1Cp, setPlayer1Cp] = useState(0)
  const [player2Cp, setPlayer2Cp] = useState(0)

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center h-12">
        <div className="uppercase font-bold">
          <h1>SCORE {score.PLAYER1}</h1>
        </div>
        <div>
          {[0, 1, 2, 3, 4].map((t) => (
            <Button
              color={turn === t ? 'primary' : 'secondary'}
              key={t}
              onClick={() => setTurn(t)}
              className={`rounded-sm cursor-pointer px-3 py-2 m-2 font-bold ${turn === t ? 'bg-primary text-white' : 'bg-gray-200'}`}
            >
              {t == 0 ? 'Setup' : `${t}`}
            </Button>
          ))}
          <Button
            color="secondary"
            onClick={() => {}}
            className={`rounded-sm cursor-pointer px-3 py-2 m-2 bg-gray-200 text-black font-bold`}
          >
            End game
          </Button>
        </div>
        <div className="uppercase font-bold">
          <h1>SCORE {score.PLAYER2}</h1>
        </div>
      </div>
      <div className=" mt-6 grid grid-cols-[1fr_2fr_2fr_2fr_2fr_2fr_2fr_2fr_2fr_1fr] gap-6 text-center">
        <div className="font-bold col-span-5 flex justify-start">Player 1 </div>
        <div className="font-bold col-span-5 flex justify-end">Player 2</div>

        <div className="font-bold"></div>
        <div className="font-bold ">TP1</div>
        <div className="font-bold ">TP2</div>
        <div className="font-bold ">TP3</div>
        <div className="font-bold  border-r-2">TP4</div>
        <div className="font-bold ">TP4</div>
        <div className="font-bold ">TP3</div>
        <div className="font-bold  ">TP2</div>
        <div className="font-bold  ">TP1</div>
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

        {/* CP/Tacop/Enemies to kill */}
        <div className="font-bold col-span-2">Command Points</div>
        <div className="font-bold col-span-2">
          <Dropdown>
            <DropdownButton outline>
              Select Tac Op.
              <ChevronDownIcon />
            </DropdownButton>
            <DropdownMenu>
              <DropdownItem onClick={() => {}}>Delete</DropdownItem>
              <DropdownItem onClick={() => {}}>Delete</DropdownItem>
              <DropdownItem onClick={() => {}}>Delete</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="font-bold">
          <Dropdown>
            <DropdownButton outline>
              Operatives to kill
              <ChevronDownIcon />
            </DropdownButton>
            <DropdownMenu>
              <DropdownItem onClick={() => {}}>Delete</DropdownItem>
              <DropdownItem onClick={() => {}}>Delete</DropdownItem>
              <DropdownItem onClick={() => {}}>Delete</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="font-bold">
          <Dropdown>
            <DropdownButton outline>
              Operatives to kill
              <ChevronDownIcon />
            </DropdownButton>
            <DropdownMenu>
              <DropdownItem onClick={() => {}}>Delete</DropdownItem>
              <DropdownItem onClick={() => {}}>Delete</DropdownItem>
              <DropdownItem onClick={() => {}}>Delete</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="font-bold col-span-2">
          <Dropdown>
            <DropdownButton outline>
              Select Tac Op.
              <ChevronDownIcon />
            </DropdownButton>
            <DropdownMenu>
              <DropdownItem href="/users/1">View</DropdownItem>
              <DropdownItem href="/users/1/edit">Edit</DropdownItem>
              <DropdownItem onClick={() => {}}>Delete</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="font-bold col-span-2">Command Points</div>

        {/* CP/Primary Op/Operatives killed */}
        <div className="font-bold col-span-2 flex justify-around">
          <Button
            className=""
            disabled={player1Cp <= 0}
            onClick={() => setPlayer1Cp(player1Cp - 1)}
          >
            -
          </Button>
          <h1>{player1Cp}</h1>
          <Button onClick={() => setPlayer1Cp(player1Cp + 1)}>+</Button>
        </div>
        <div className="font-bold col-span-2">
          <Dropdown>
            <DropdownButton outline>
              Select Primary Op.
              <ChevronDownIcon />
            </DropdownButton>
            <DropdownMenu>
              <DropdownItem onClick={() => {}}>Delete</DropdownItem>
              <DropdownItem onClick={() => {}}>Delete</DropdownItem>
              <DropdownItem onClick={() => {}}>Delete</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="font-bold flex justify-around">
          <Button
            className=""
            disabled={player1Cp <= 0}
            onClick={() => setPlayer1Cp(player1Cp - 1)}
          >
            -
          </Button>
          <h1>{player1Cp}</h1>
          <Button onClick={() => setPlayer1Cp(player1Cp + 1)}>+</Button>
        </div>
        <div className="font-bold flex justify-around">
          <Button
            className=""
            disabled={player1Cp <= 0}
            onClick={() => setPlayer1Cp(player1Cp - 1)}
          >
            -
          </Button>
          <h1>{player1Cp}</h1>
          <Button onClick={() => setPlayer1Cp(player1Cp + 1)}>+</Button>
        </div>
        <div className="font-bold col-span-2">
          <Dropdown>
            <DropdownButton outline>
              Select Primary Op.
              <ChevronDownIcon />
            </DropdownButton>
            <DropdownMenu>
              <DropdownItem onClick={() => {}}>Delete</DropdownItem>
              <DropdownItem onClick={() => {}}>Delete</DropdownItem>
              <DropdownItem onClick={() => {}}>Delete</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="font-bold col-span-2 flex justify-around">
          <Button disabled={player2Cp <= 0} onClick={() => setPlayer2Cp(player2Cp - 1)}>
            -
          </Button>
          <h1>{player2Cp}</h1>
          <Button onClick={() => setPlayer2Cp(player2Cp + 1)}>+</Button>
        </div>
      </div>
    </div>
  )
}
