import React from 'react'
import {CritOp} from '../../../../sanity.types'

import {PortableText} from '@portabletext/react'

export const CritOpCard = ({critOp}: {critOp: CritOp}) => {
  const {name, additionalRulesText, missionActions, victoryPoints} = critOp
  return (
    <div className="mx-auto max-h-[34vh] max-w-[14rem] overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-md sm:max-h-[38vh] sm:max-w-[15rem] md:max-h-[42vh] md:max-w-[17rem] lg:max-h-[46vh] lg:max-w-[18rem] xl:max-h-[60vh] xl:max-w-sm">
      <h2 className="mb-2 rounded-t-xl bg-gray-900 py-2 text-center text-sm font-bold text-white sm:mb-3 sm:py-3 sm:text-base md:text-lg">
        CRIT OP
      </h2>
      <div className="p-2.5 sm:p-3 md:p-4">
        <div className="mb-2 rounded bg-primary px-2 py-1 text-xs font-bold text-white sm:mb-3 sm:px-3 sm:text-sm md:text-base">
          {name}
        </div>
        {additionalRulesText && (
          <>
            <h3 className="mb-2 text-xs font-bold text-primary sm:text-sm">ADDITIONAL RULES</h3>
            <div className="mb-2 text-xs text-gray-700 sm:text-sm">
              <PortableText value={additionalRulesText} />
            </div>
          </>
        )}
      </div>
      <div className="p-2.5 pt-0 sm:p-3 sm:pt-0 md:p-4 md:pt-0">
        {missionActions?.map((action) => (
          <div
            key={action._key}
            className="mb-3 rounded-lg border border-gray-300 p-2.5 sm:p-3 md:p-4"
          >
            <h3 className="mb-2 text-xs font-bold text-primary sm:text-sm">MISSION ACTION</h3>
            <div className="mb-2 flex items-center justify-between gap-2 sm:mb-3">
              <span className="text-xs font-semibold uppercase text-gray-700 sm:text-sm md:text-base">
                {action.name}
              </span>
              <span className="whitespace-nowrap text-xs font-bold sm:text-sm">
                {action.apCost}AP
              </span>
            </div>

            <div className="space-y-2 text-xs text-gray-700 sm:text-sm">
              {action?.description?.map(
                (desc) => desc.content && <PortableText key={desc._key} value={desc.content} />,
              )}
              {action.limitations && <PortableText value={action.limitations} />}
            </div>
          </div>
        ))}

        <div>
          <h3 className="mb-2 text-xs font-bold text-primary sm:text-sm">VICTORY POINTS</h3>
          {victoryPoints && (
            <div className="mb-2 text-xs text-gray-700 sm:text-sm">
              <PortableText value={victoryPoints} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
