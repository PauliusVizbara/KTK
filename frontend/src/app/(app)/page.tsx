'use client'
import {ResourceTracker, ScoreTracker, StateTracker, SetupDialog} from '@/components'
import React, {createContext} from 'react'

export default function Home() {
  const params = {slug: 'sample-post'}
  // const {data: post} = await sanityFetch({query: postQuery, params})

  return (
    <>
      <SetupDialog />
      <StateTracker />
      <ScoreTracker />
      <ResourceTracker />
    </>
  )
}
