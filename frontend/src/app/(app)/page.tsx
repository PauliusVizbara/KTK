import {ResourceTracker, ScoreTracker, StateTracker, SetupDialog} from '@/components'
import {sanityFetch} from '@/sanity/live'
import {postQuery, teamListQuery} from '@/sanity/queries'
import React from 'react'
import {useTeamStore} from '../store'

export default async function Home() {
  const params = {slug: 'sample-post'}

  const {data: teamSelectOptions} = await sanityFetch({query: teamListQuery})
  // teams.map((team) => console.log(team.name))
  return (
    <>
      <SetupDialog initialTeams={teamSelectOptions} />
      <StateTracker />
      <ScoreTracker />
      <ResourceTracker />
    </>
  )
}
