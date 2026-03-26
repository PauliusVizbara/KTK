import React from 'react'
import { TacOp } from '../../../../sanity.types'
import { PortableText } from '@portabletext/react'

export const TacOpCard = ({ tacOp }: { tacOp: TacOp }) => {
    const { name, archetype, reveal, additionalRules, missionAction, victoryPoints } = tacOp

    return (
        <div className="max-w-md mx-auto max-h-[50vh] sm:max-h-[56vh] overflow-y-auto rounded-2xl bg-zinc-100 border border-[#f05a1a] shadow-lg">
            <div className="rounded-t-2xl bg-[#f05a1a] text-center py-3">
                <h2 className="text-white text-2xl font-black uppercase tracking-wide">{archetype}</h2>
            </div>

            <div className="px-6 py-4 border-b border-zinc-400">
                <h3 className="text-center text-2xl font-black uppercase text-zinc-900 tracking-wide">{name}</h3>
            </div>

            <div className="p-6">
                <h4 className="text-[#f05a1a] font-semibold text-xl uppercase tracking-wide mb-2">Reveal</h4>
                <div className="text-zinc-800 text-base leading-relaxed mb-6">
                    <PortableText value={reveal} />
                </div>

                {additionalRules && (
                    <>
                        <h4 className="text-[#f05a1a] font-semibold text-xl uppercase tracking-wide mb-2">
                            Additional Rules
                        </h4>
                        <div className="text-zinc-800 text-base leading-relaxed mb-6">
                            <PortableText value={additionalRules} />
                        </div>
                    </>
                )}

                {missionAction && (
                    <div className="mb-6">
                        <h4 className="text-[#f05a1a] font-semibold text-xl uppercase tracking-wide mb-2">
                            Mission Action
                        </h4>

                        <div className="border border-[#f05a1a]/60 rounded-sm overflow-hidden bg-zinc-50">
                            <div className="bg-[#ef4e0a] text-white px-3 py-2 flex justify-between items-center">
                                <span className="uppercase text-lg font-bold">{missionAction.name}</span>
                                <span className="text-lg font-bold">{missionAction.apCost ?? 0} APL</span>
                            </div>

                            <div className="px-4 py-3 text-zinc-800 text-base leading-relaxed space-y-2">
                                {missionAction?.description?.map(
                                    (desc) => desc.content && <PortableText key={desc._key} value={desc.content} />,
                                )}
                                {missionAction.limitations && <PortableText value={missionAction.limitations} />}
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <h4 className="text-[#f05a1a] font-semibold text-xl uppercase tracking-wide mb-2">
                        Victory Points
                    </h4>
                    <div className="text-zinc-800 text-base leading-relaxed">
                        <PortableText value={victoryPoints} />
                    </div>
                </div>
            </div>
        </div>
    )
}