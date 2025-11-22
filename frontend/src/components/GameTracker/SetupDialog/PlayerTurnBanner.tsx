import React from 'react'
import {clsx} from 'clsx'

interface PlayerTurnBannerProps {
  playerName: string
  className?: string
}

export const PlayerTurnBanner = ({playerName, className}: PlayerTurnBannerProps) => {
  return (
    <div
      className={clsx(
        'w-full bg-orange-500 text-white font-bold text-xl py-4 px-6 text-center uppercase tracking-widest shadow-md',
        className,
      )}
    >
      {playerName} - Eyes Only
    </div>
  )
}
