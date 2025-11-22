import {operative} from './objects/operative'
import {weapon} from './objects/weapon'
import {action} from './objects/action'
import {team} from './documents/team'
import {critOp} from './documents/critOp'
import {equipment} from './objects/equipment'
import {universalEquipment} from './documents/universalEquipment'

// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/schema-types

export const schemaTypes = [
  // Documents
  team,
  critOp,
  universalEquipment,
  // Objects
  operative,
  weapon,
  action,
  equipment,
]
