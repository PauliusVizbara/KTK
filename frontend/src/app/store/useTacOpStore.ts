import { create } from 'zustand'
import { TacOp } from '../../../sanity.types'

interface TacOpState {
    tacOps: TacOp[]
    setTacOps: (tacOps: TacOp[]) => void
}

export const useTacOpStore = create<TacOpState>((set) => ({
    tacOps: [],
    setTacOps: (tacOps) => set({ tacOps }),
}))