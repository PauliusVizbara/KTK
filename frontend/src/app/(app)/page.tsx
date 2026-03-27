'use server'
import { ResourceTracker, ScoreTracker, StateTracker, SetupDialog } from '@/components'
import { client } from '@/sanity/client'
import { critOpQuery, teamListQuery, universalEquipmentQuery } from '@/sanity/queries'
import { tacOpQuery } from '@/sanity/queries'
import React from 'react'

export default async function Home() {
  const teamSelectOptions = await client.fetch(teamListQuery)
  const critOps = await client.fetch(critOpQuery)
  const tacOps = await client.fetch(tacOpQuery)
  const universalEquipment = await client.fetch(universalEquipmentQuery)
  return (
    <div className="flex flex-col gap-6">
      <SetupDialog
        initialTeams={teamSelectOptions}
        critOps={critOps}
        tacOps={tacOps}
        universalEquipment={universalEquipment}
      />
      <StateTracker />
      <ScoreTracker />
      <ResourceTracker />
    </div>
  )
}
