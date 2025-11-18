import {ResourceTracker, ScoreTracker, StateTracker, SetupDialog} from '@/components'
import {sanityFetch} from '@/sanity/live'
import {critOpQuery, postQuery, teamListQuery} from '@/sanity/queries'
import React from 'react'
import {PortableText} from 'next-sanity'

export default async function Home() {
  const params = {slug: 'sample-post'}

  const {data: teamSelectOptions} = await sanityFetch({query: teamListQuery})
  const {data: critOps} = await sanityFetch({query: critOpQuery})
  const firstOp = critOps[0]
  // teams.map((team) => console.log(team.name))
  return (
    <>
      {/* <pre>{JSON.stringify(critOps, null, 2)}</pre> */}
      {firstOp.missionActionDescriptionGreen && (
        <PortableText value={firstOp.missionActionDescriptionGreen} />
      )}
      {firstOp.missionActionDescriptionRed && (
        <PortableText value={firstOp.missionActionDescriptionRed} />
      )}
      <SetupDialog initialTeams={teamSelectOptions} />
      <StateTracker />
      <ScoreTracker />
      <ResourceTracker />
    </>
  )
}
