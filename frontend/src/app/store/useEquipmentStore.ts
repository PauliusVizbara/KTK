import {create} from 'zustand'
import {UniversalEquipment} from '../../../sanity.types'

interface EquipmentStore {
  universalEquipment: UniversalEquipment[]
  setUniversalEquipment: (data: UniversalEquipment[]) => void
}

export const useEquipmentStore = create<EquipmentStore>((set) => ({
  universalEquipment: [],
  setUniversalEquipment: (data: UniversalEquipment[]) => {
    set({universalEquipment: data})
  },
}))
