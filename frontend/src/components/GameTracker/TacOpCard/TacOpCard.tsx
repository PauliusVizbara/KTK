import React from 'react'
import {TacOp} from '../../../../sanity.types'
import clsx from 'clsx'
import {PortableText} from '@portabletext/react'

export const TacOpCard = ({tacOp, className}: {tacOp: TacOp; className?: string}) => {
  const {name, archetype, reveal, additionalRules, missionAction, victoryPoints} = tacOp

  return (
    <div
      className={clsx(
        'mx-auto max-h-[34vh] max-w-[14rem] overflow-y-auto rounded-xl border border-[#f05a1a] bg-zinc-100 shadow-lg sm:max-h-[38vh] sm:max-w-[15rem] md:max-h-[42vh] md:max-w-[17rem] lg:max-h-[46vh] lg:max-w-[18rem] xl:max-h-[60vh] xl:max-w-sm',
        className,
      )}
    >
      <div className="rounded-t-xl bg-[#f05a1a] py-1.5 text-center sm:py-2">
        <h2 className="text-sm font-black uppercase tracking-wide text-white sm:text-base md:text-lg">
          {archetype}
        </h2>
      </div>

      <div className="border-b border-zinc-400 px-3 py-2 sm:px-4 sm:py-3 md:px-5">
        <h3 className="text-center text-base font-black uppercase tracking-wide text-zinc-900 sm:text-lg md:text-xl">
          {name}
        </h3>
      </div>

      <div className="p-3 sm:p-4 md:p-5">
        <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#f05a1a] sm:text-base md:text-lg">
          Reveal
        </h4>
        <div className="mb-4 text-xs leading-relaxed text-zinc-800 sm:mb-5 sm:text-sm md:text-base">
          <PortableText value={reveal} />
        </div>

        {additionalRules && (
          <>
            <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#f05a1a] sm:text-base md:text-lg">
              Additional Rules
            </h4>
            <div className="mb-4 text-xs leading-relaxed text-zinc-800 sm:mb-5 sm:text-sm md:text-base">
              <PortableText value={additionalRules} />
            </div>
          </>
        )}

        {missionAction && (
          <div className="mb-4 sm:mb-5">
            <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#f05a1a] sm:text-base md:text-lg">
              Mission Action
            </h4>

            <div className="border border-[#f05a1a]/60 rounded-sm overflow-hidden bg-zinc-50">
              <div className="flex items-center justify-between gap-2 bg-[#ef4e0a] px-2 py-1.5 text-white sm:px-3 sm:py-2">
                <span className="text-xs font-bold uppercase sm:text-sm md:text-base">
                  {missionAction.name}
                </span>
                <span className="whitespace-nowrap text-xs font-bold sm:text-sm md:text-base">
                  {missionAction.apCost ?? 0} APL
                </span>
              </div>

              <div className="space-y-2 px-2 py-2 text-xs leading-relaxed text-zinc-800 sm:px-3 sm:py-3 sm:text-sm md:px-4 md:text-base">
                {missionAction?.description?.map(
                  (desc) => desc.content && <PortableText key={desc._key} value={desc.content} />,
                )}
                {missionAction.limitations && <PortableText value={missionAction.limitations} />}
              </div>
            </div>
          </div>
        )}

        <div>
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#f05a1a] sm:text-base md:text-lg">
            Victory Points
          </h4>
          <div className="text-xs leading-relaxed text-zinc-800 sm:text-sm md:text-base">
            <PortableText value={victoryPoints} />
          </div>
        </div>
      </div>
    </div>
  )
}
