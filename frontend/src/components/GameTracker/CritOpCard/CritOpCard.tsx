import React from 'react'
import {CritOp} from '../../../../sanity.types'

import {PortableText} from '@portabletext/react'

export const CritOpCard = ({critOp}: {critOp: CritOp}) => {
  const {name, additionalRulesText, missionActions, victoryPoints} = critOp
  return (
    <div className="max-w-sm mx-auto max-h-[60vh] sm:max-h-160 overflow-y-auto bg-white rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-center text-xl rounded-t-2xl font-bold mb-4 text-white bg-gray-900 py-4">
        CRIT OP
      </h2>
      <div className="p-4">
        <div className="bg-primary text-white font-bold px-3 py-1 rounded mb-4">{name}</div>
        {additionalRulesText && (
          <div className="text-sm text-gray-700 mb-2 list-item">
            <PortableText value={additionalRulesText} />
          </div>
        )}
      </div>
      <div className="p-4">
        {missionActions?.map((action) => (
          <div key={action._key} className="border border-gray-300 rounded-lg p-4 mb-4">
            <h3 className="text-primary font-bold mb-2">MISSION ACTION</h3>
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-700 font-semibold uppercase">{action.name}</span>
              <span className="font-bold">{action.apCost}AP</span>
            </div>

            <div className="space-y-2 text-sm text-gray-700">
              {action.description && <PortableText value={action.description} />}
              {action.limitations && <PortableText value={action.limitations} />}
            </div>
          </div>
        ))}

        <div>
          <h3 className="text-primary font-bold mb-2">VICTORY POINTS</h3>
          {victoryPoints && (
            <div className="text-sm text-gray-700 mb-2">
              <PortableText value={victoryPoints} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
