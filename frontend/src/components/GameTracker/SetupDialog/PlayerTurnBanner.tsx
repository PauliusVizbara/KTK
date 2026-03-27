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
        'w-full bg-orange-500 px-4 py-3 text-center text-base font-bold uppercase tracking-[0.18em] text-white shadow-md sm:px-6 sm:text-lg lg:text-xl',
        className,
      )}
    >
      {playerName} - Eyes Only
    </div>
  )
}
