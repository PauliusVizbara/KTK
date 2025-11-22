import {create} from 'zustand'
import {Team} from '../../../sanity.types'

interface TeamStore {
  teams: Team[]
  teamSelectOptions: Array<{id: string; name: string}>
  setTeams: (data: Team[]) => void
  getTeamById: (id: string) => Team | undefined
}

export const useTeamStore = create<TeamStore>((set, get) => ({
  teams: [],
  teamSelectOptions: [],
  setTeams: (data: Team[]) => {
    set({teams: data})
    set({teamSelectOptions: data.map((team) => ({id: team._id, name: team.name}))})
  },
  getTeamById: (id: string) => {
    return get().teams.find((team) => team._id === id)
  },
}))
