import {create} from 'zustand'

interface TeamSelect {
  id: string
  name: string
}

interface TeamStore {
  teamSelectOptions: TeamSelect[]
  setTeamSelectOptions: (data: TeamSelect[]) => void
}

export const useTeamStore = create<TeamStore>((set) => ({
  teamSelectOptions: [],
  setTeamSelectOptions: (data: TeamSelect[]) => {
    set({teamSelectOptions: data})
  },
}))
