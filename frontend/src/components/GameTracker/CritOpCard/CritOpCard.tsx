import React from 'react'
import {CritOp} from '../../../../sanity.types'

export const CritOpCard = ({critOp}: {critOp: CritOp}) => {
  const {name, missionAction, victoryPoints} = critOp
  return (
    <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-center text-xl rounded-t-2xl font-bold mb-4 text-white bg-gray-900 py-4">
        CRIT OP
      </h2>
      <div className="p-4">
        <div className="bg-primary text-white font-bold px-3 py-1 rounded mb-4">{name}</div>

        <div className="border border-gray-300 rounded-lg p-4 mb-4">
          <h3 className="text-primary font-bold mb-2">MISSION ACTION</h3>
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-700 font-semibold">SECURE</span>
            <span className="font-bold">1AP</span>
          </div>

          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">▲</span>
              <span>
                One objective marker the active operative controls is secured by your kill team
                until your opponent’s kill team secures that objective marker.
              </span>
            </li>

            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">◆</span>
              <span>
                An operative cannot perform this action during the first turning point, or while
                within control range of an enemy operative.
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-primary font-bold mb-2">VICTORY POINTS</h3>
          <p className="text-sm text-gray-700 mb-2">
            At the end of each turning point after the first:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>If any objective markers are secured by your kill team, you score 1VP.</li>
            <li>
              If more objective markers are secured by your kill team than your opponent’s kill
              team, you score 1VP.
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
