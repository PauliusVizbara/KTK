import {create} from 'zustand'
import {CritOp} from '../../../sanity.types'

interface CritOpState {
  critOps: CritOp[]
  setCritOps: (critOps: CritOp[]) => void
}

export const useCritOpStore = create<CritOpState>((set) => ({
  critOps: [],
  setCritOps: (critOps) => set({critOps}),
}))
