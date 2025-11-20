'use server'
import {ResourceTracker, ScoreTracker, StateTracker, SetupDialog} from '@/components'
import {sanityFetch} from '@/sanity/live'
import {critOpQuery, teamListQuery} from '@/sanity/queries'
import React from 'react'

export default async function Home() {
  // const {data: teamSelectOptions} = await sanityFetch({query: teamListQuery})
  // const {data: critOps} = await sanityFetch({query: critOpQuery})
  return (
    <>
      {/* <SetupDialog initialTeams={teamSelectOptions} critOps={critOps} /> */}
      <StateTracker />
      <ScoreTracker />
      <ResourceTracker />
    </>
  )
}
