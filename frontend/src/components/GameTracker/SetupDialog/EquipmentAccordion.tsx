import React, {useState} from 'react'
import {clsx} from 'clsx'
import {Equipment, Weapon, Action} from '../../../../sanity.types'
import {Checkbox} from '@/components/checkbox'
import {ChevronDownIcon, ChevronUpIcon} from '@heroicons/react/16/solid'
import {PortableText} from '@portabletext/react'

interface EquipmentAccordionProps {
  equipment: (Equipment & {id: string})[]
  selectedIds: string[]
  onToggle: (id: string) => void
  maxSelection?: number
}

const WeaponDisplay = ({weapon}: {weapon: Weapon}) => {
  return (
    <div className="mb-4">
      <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 text-sm font-bold uppercase border-b-2 border-orange-500 mb-1 pb-1">
        <div>Name</div>
        <div className="w-8 text-center">Atk</div>
        <div className="w-8 text-center">Hit</div>
        <div className="w-12 text-center">Dmg</div>
      </div>
      <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 text-sm font-bold items-center">
        <div className="flex items-center">
          {weapon.type === 'ranged' && <span className="text-orange-500 mr-1">⌖</span>}
          {weapon.type === 'melee' && <span className="text-orange-500 mr-1">⚔</span>}
          {weapon.name}
        </div>
        <div className="w-8 text-center">{weapon.atk}</div>
        <div className="w-8 text-center">{weapon.hit}+</div>
        <div className="w-12 text-center">
          {weapon.damageNormal}/{weapon.damageCritical}
        </div>
      </div>
      <div className="border-b border-orange-500 my-1"></div>
      <div className="text-sm">
        <span className="font-bold">WR: </span>
        {weapon.rules}
      </div>
    </div>
  )
}

const ActionDisplay = ({action}: {action: Action}) => {
  return (
    <div className="border border-orange-500 rounded-lg overflow-hidden mb-4">
      <div className="bg-orange-500 text-white px-3 py-1 flex justify-between items-center font-bold uppercase">
        <span>{action.name}</span>
        <span>{action.apCost} AP</span>
      </div>
      <div className="p-3 bg-slate-50 text-sm">
        {/* Description with Green Arrows */}
        {action.description && (
          <div className="space-y-2">
            {/* We render portable text but customize list items if possible, 
                    or just assume it's blocks and we style them. 
                    Since the schema has 'description' as array of blocks, we use PortableText.
                    To get the "Green Arrow" effect, we might need to customize the components.
                */}
            <PortableText
              value={action.description}
              components={{
                block: {
                  normal: ({children}) => (
                    <div className="flex items-start">
                      <span className="text-green-600 mr-2 transform scale-x-75">▶</span>
                      <div>{children}</div>
                    </div>
                  ),
                },
              }}
            />
          </div>
        )}

        {/* Limitations with Red Diamond */}
        {action.limitations && (
          <div className="mt-3 pt-2 border-t border-slate-200">
            <PortableText
              value={action.limitations}
              components={{
                block: {
                  normal: ({children}) => (
                    <div className="flex items-start">
                      <span className="text-red-600 mr-2 text-xs">◆</span>
                      <div className="italic">{children}</div>
                    </div>
                  ),
                },
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export const EquipmentAccordion = ({
  equipment,
  selectedIds,
  onToggle,
  maxSelection = 4,
}: EquipmentAccordionProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
      {equipment.map((item) => {
        const isSelected = selectedIds.includes(item.id)
        const isExpanded = expandedId === item.id
        const isDisabled = !isSelected && selectedIds.length >= maxSelection

        return (
          <div
            key={item.id}
            className={clsx(
              'border rounded-lg overflow-hidden transition-colors',
              isSelected ? 'border-orange-500 bg-orange-50/50' : 'border-zinc-200 bg-white',
            )}
          >
            <div className="flex items-center p-3 cursor-pointer hover:bg-zinc-50">
              <div className="flex items-center h-5" onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={isSelected}
                  onChange={() => !isDisabled && onToggle(item.id)}
                  disabled={isDisabled}
                  color="orange"
                />
              </div>
              <div
                className="flex-1 ml-3 font-bold uppercase text-zinc-800 select-none"
                onClick={() => handleToggleExpand(item.id)}
              >
                {item.name}
              </div>
              <div onClick={() => handleToggleExpand(item.id)}>
                {isExpanded ? (
                  <ChevronUpIcon className="w-5 h-5 text-zinc-400" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-zinc-400" />
                )}
              </div>
            </div>

            {isExpanded && (
              <div className="px-4 pb-4 pt-0 text-sm text-zinc-600 border-t border-zinc-100 mt-2">
                <div className="mt-2 italic mb-4">{item.description}</div>

                {item.weapons?.map((weapon) => (
                  <WeaponDisplay key={weapon._key} weapon={weapon} />
                ))}

                {item.actions?.map((action) => (
                  <ActionDisplay key={action._key} action={action} />
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
