'use server'
import {ResourceTracker, ScoreTracker, StateTracker, SetupDialog} from '@/components'
import {client} from '@/sanity/client'
import {critOpQuery, teamListQuery, universalEquipmentQuery} from '@/sanity/queries'
import React from 'react'

export default async function Home() {
  const teamSelectOptions = await client.fetch(teamListQuery)
  const critOps = await client.fetch(critOpQuery)
  const universalEquipment = await client.fetch(universalEquipmentQuery)
  return (
    <>
      <SetupDialog
        initialTeams={teamSelectOptions}
        critOps={critOps}
        universalEquipment={universalEquipment}
      />
      <StateTracker />
      <ScoreTracker />
      <ResourceTracker />
    </>
  )
}
