'use server'
import {ResourceTracker, ScoreTracker, StateTracker, SetupDialog} from '@/components'
import {client} from '@/sanity/client'
import {critOpQuery, teamListQuery} from '@/sanity/queries'
import React from 'react'

export default async function Home() {
  const teamSelectOptions = await client.fetch(teamListQuery)
  const critOps = await client.fetch(critOpQuery)
  return (
    <>
      <SetupDialog initialTeams={teamSelectOptions} critOps={critOps} />
      <StateTracker />
      <ScoreTracker />
      <ResourceTracker />
    </>
  )
}
