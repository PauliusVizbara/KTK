'use client'
import {useGameTrackerStore} from '@/app/store'
import {Button} from '@/components'
import React from 'react'

export const StateTracker = () => {
  const [turn, setTurn] = React.useState(0)

  const {isSetupDone, setIsSetupOpen} = useGameTrackerStore()

  if (!isSetupDone) {
    return (
      <div className="flex justify-center items-center">
        <Button onClick={() => setIsSetupOpen(true)}>New Game Setup</Button>
      </div>
    )
  }

  return <div className="flex justify-between items-center"></div>
}
