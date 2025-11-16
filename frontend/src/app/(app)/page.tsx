import {ResourceTracker, ScoreTracker, StateTracker, SetupDialog} from '@/components'
import {sanityFetch} from '@/sanity/live'
import {teamListQuery} from '@/sanity/queries'
import React from 'react'

export default async function Home() {
  const params = {slug: 'sample-post'}
  // const {data: post} = await sanityFetch({query: postQuery, params})
  const {data: teams} = await sanityFetch({query: teamListQuery})
  console.log(teams)
  return (
    <>
      <pre>{JSON.stringify(teams, null, 2)}</pre>
      <SetupDialog />
      <StateTracker />
      <ScoreTracker />
      <ResourceTracker />
    </>
  )
}
