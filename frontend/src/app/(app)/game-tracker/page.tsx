'use client'
import {useState} from 'react'

export default function GameTracker() {
  const [initiative, setInitiative] = useState<'PLAYER1' | 'PLAYER2'>('PLAYER1')
  return <h1>{initiative}</h1>
}
