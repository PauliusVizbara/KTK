'use client'
import React from 'react'
import {useGameTrackerStore} from '@/app/store'
import Image from 'next/image'

type PlayerScores = {
  crit: number[][]
  tac: number[][]
}

const SCORING_TP_INDICES = [1, 2, 3] as const
const TP_LABELS = ['TP2', 'TP3', 'TP4'] as const
const CRIT_TAC_CAPS = [0, 2, 2, 2]
const MAX_CRIT_TAC_TOTAL = 6

const KILL_GRADE_THRESHOLDS: Record<number, [number, number, number, number, number]> = {
  5: [1, 2, 3, 4, 5],
  6: [1, 2, 4, 5, 6],
  7: [1, 3, 4, 6, 7],
  8: [2, 3, 5, 6, 8],
  9: [2, 4, 5, 7, 9],
  10: [2, 4, 6, 8, 10],
  11: [2, 4, 7, 9, 11],
  12: [2, 5, 7, 10, 12],
  13: [3, 5, 8, 10, 13],
  14: [3, 6, 8, 11, 14],
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const EMPTY_SKULL_SELECTIONS = [
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
] as number[][]

const getTrackPointsByTp = (track: number[][]) =>
  track.map((tpSkulls, tpIndex) => clamp(sum(tpSkulls), 0, CRIT_TAC_CAPS[tpIndex]))

const getTrackTotal = (track: number[][]) =>
  Math.min(MAX_CRIT_TAC_TOTAL, sum(getTrackPointsByTp(track)))

const getKillGrade = (enemyStartingOperatives: number, enemyKilled: number) => {
  const thresholds = KILL_GRADE_THRESHOLDS[enemyStartingOperatives]
  let grade = 0
  thresholds.forEach((requiredKills, index) => {
    if (enemyKilled >= requiredKills) {
      grade = index + 1
    }
  })
  return grade
}

const getKillOpPoints = (
  playerKillGrade: number,
  opponentKillGrade: number,
): {gradePoints: number; hasComparisonPoint: boolean; total: number} => {
  const gradePoints = clamp(playerKillGrade, 0, 5)
  const hasComparisonPoint = playerKillGrade > opponentKillGrade
  const total = gradePoints + (hasComparisonPoint ? 1 : 0)

  return {gradePoints, hasComparisonPoint, total}
}

const getKillsToNextGrade = (enemyStartingOperatives: number, enemyKilled: number) => {
  const thresholds = KILL_GRADE_THRESHOLDS[enemyStartingOperatives]
  const nextThreshold = thresholds.find((requiredKills) => enemyKilled < requiredKills)
  return nextThreshold === undefined ? 0 : nextThreshold - enemyKilled
}

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0)

const ScoreTable = ({
  title,
  data,
  onDataChange,
  enemyStartingOperatives,
  enemyKillsTotal,
  onSetEnemyKillsTotal,
  killOpGradePoints,
  killOpHasComparisonPoint,
}: {
  title: string
  data: PlayerScores
  onDataChange: React.Dispatch<React.SetStateAction<PlayerScores>>
  enemyStartingOperatives: number
  enemyKillsTotal: number
  onSetEnemyKillsTotal: (nextTotal: number) => void
  killOpGradePoints: number
  killOpHasComparisonPoint: boolean
}) => {
  const toggleCritTacSkull = (key: 'crit' | 'tac', tpIndex: number, skullIndex: number) => {
    const capForTurn = CRIT_TAC_CAPS[tpIndex]
    if (capForTurn === 0) return

    const currentTrack = data[key]
    const isSelected = currentTrack[tpIndex][skullIndex] === 1

    const nextTrack = currentTrack.map((tpSkulls) => [...tpSkulls])

    if (isSelected) {
      nextTrack[tpIndex][skullIndex] = 0
      onDataChange({...data, [key]: nextTrack})
      return
    }

    const currentTotal = getTrackTotal(currentTrack)
    const selectedInTurn = sum(currentTrack[tpIndex])

    if (currentTotal >= MAX_CRIT_TAC_TOTAL || selectedInTurn >= capForTurn) {
      return
    }

    nextTrack[tpIndex][skullIndex] = 1
    onDataChange({...data, [key]: nextTrack})
  }

  const killsToNextGrade = getKillsToNextGrade(enemyStartingOperatives, enemyKillsTotal)

  const adjustEnemyKillsTotal = (delta: number) => {
    onSetEnemyKillsTotal(clamp(enemyKillsTotal + delta, 0, enemyStartingOperatives))
  }

  const renderKillOpSkulls = () => (
    <div className="flex items-center gap-1">
      {Array.from({length: 6}).map((_, index) => {
        const isActive = index < 5 ? index < killOpGradePoints : killOpHasComparisonPoint
        return (
          <span
            key={`kill-op-${index}`}
            className={`inline-flex h-8 w-8 items-center justify-center ${index === 5 ? 'ml-2' : ''}`}
          >
            <Image
              src="/images/skull.svg"
              alt="Skull"
              width={18}
              height={18}
              className={isActive ? 'opacity-100' : 'opacity-25 grayscale'}
              style={
                isActive
                  ? {
                      filter:
                        'brightness(0) saturate(100%) invert(49%) sepia(94%) saturate(3145%) hue-rotate(2deg) brightness(98%) contrast(94%)',
                    }
                  : undefined
              }
            />
          </span>
        )
      })}
    </div>
  )

  const renderSkullSelector = (key: 'crit' | 'tac', tpIndex: number, tpSkulls: number[]) => {
    const skullCount = CRIT_TAC_CAPS[tpIndex]

    if (skullCount === 0) {
      return <span className="text-zinc-300">-</span>
    }

    return (
      <div className="flex items-center justify-center gap-1">
        {Array.from({length: skullCount}).map((_, skullIndex) => {
          const isActive = tpSkulls[skullIndex] === 1

          return (
            <button
              key={`${key}-${tpIndex}-${skullIndex}`}
              type="button"
              onClick={() => toggleCritTacSkull(key, tpIndex, skullIndex)}
              className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md"
              aria-label={`Toggle ${key} TP${tpIndex + 1} skull ${skullIndex + 1}`}
            >
              <Image
                src="/images/skull.svg"
                alt="Skull"
                width={20}
                height={20}
                className={isActive ? 'opacity-100' : 'opacity-35 grayscale'}
                style={
                  isActive
                    ? {
                        filter:
                          'brightness(0) saturate(100%) invert(49%) sepia(94%) saturate(3145%) hue-rotate(2deg) brightness(98%) contrast(94%)',
                      }
                    : undefined
                }
              />
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="mb-3 text-sm font-bold uppercase tracking-wide text-zinc-700">{title}</div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-zinc-600">
              <th className="px-2 py-2 text-left font-semibold uppercase">Track</th>
              {TP_LABELS.map((label) => (
                <th key={label} className="px-2 py-2 text-center font-semibold uppercase">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-zinc-100">
              <td className="px-2 py-2 font-medium text-zinc-700">Critical Op</td>
              {SCORING_TP_INDICES.map((tpIndex) => (
                <td key={`crit-${tpIndex}`} className="px-2 py-2 text-center">
                  {renderSkullSelector('crit', tpIndex, data.crit[tpIndex])}
                </td>
              ))}
            </tr>

            <tr className="border-b border-zinc-100">
              <td className="px-2 py-2 font-medium text-zinc-700">Tactical Op</td>
              {SCORING_TP_INDICES.map((tpIndex) => (
                <td key={`tac-${tpIndex}`} className="px-2 py-2 text-center">
                  {renderSkullSelector('tac', tpIndex, data.tac[tpIndex])}
                </td>
              ))}
            </tr>

            <tr className="border-b border-zinc-100">
              <td className="px-2 py-2 font-medium text-zinc-700">Kill Op</td>
              <td colSpan={3} className="px-2 py-2">
                <div className="flex flex-col items-center text-sm text-zinc-700">
                  <div className="flex flex-wrap items-center justify-center gap-8">
                    {renderKillOpSkulls()}
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Operatives killed</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            className="inline-flex h-8 w-8 items-center justify-center rounded border border-zinc-300 bg-white text-base font-semibold text-zinc-700 hover:bg-zinc-50"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              adjustEnemyKillsTotal(-1)
                            }}
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-lg font-bold text-zinc-900">
                            {enemyKillsTotal}
                          </span>
                          <button
                            type="button"
                            className="inline-flex h-8 w-8 items-center justify-center rounded border border-zinc-300 bg-white text-base font-semibold text-zinc-700 hover:bg-zinc-50"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              adjustEnemyKillsTotal(1)
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <span className="text-center text-xs italic text-zinc-600">
                        Kills to next grade: {killsToNextGrade}
                      </span>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export const ScoreTracker = () => {
  const {isSetupDone, player1, player2} = useGameTrackerStore()

  const [player1Scores, setPlayer1Scores] = React.useState<PlayerScores>({
    crit: EMPTY_SKULL_SELECTIONS.map((tp) => [...tp]),
    tac: EMPTY_SKULL_SELECTIONS.map((tp) => [...tp]),
  })

  const [player2Scores, setPlayer2Scores] = React.useState<PlayerScores>({
    crit: EMPTY_SKULL_SELECTIONS.map((tp) => [...tp]),
    tac: EMPTY_SKULL_SELECTIONS.map((tp) => [...tp]),
  })

  const player1EnemyStartingOperatives = clamp(player2.selectedOperativeCount || 10, 5, 14)
  const player2EnemyStartingOperatives = clamp(player1.selectedOperativeCount || 10, 5, 14)

  const player1KillGrade = React.useMemo(
    () => getKillGrade(player1EnemyStartingOperatives, player1.enemyKilledOperatives),
    [player1EnemyStartingOperatives, player1.enemyKilledOperatives],
  )
  const player2KillGrade = React.useMemo(
    () => getKillGrade(player2EnemyStartingOperatives, player2.enemyKilledOperatives),
    [player2EnemyStartingOperatives, player2.enemyKilledOperatives],
  )

  const player1KillOp = React.useMemo(
    () => getKillOpPoints(player1KillGrade, player2KillGrade),
    [player1KillGrade, player2KillGrade],
  )
  const player2KillOp = React.useMemo(
    () => getKillOpPoints(player2KillGrade, player1KillGrade),
    [player1KillGrade, player2KillGrade],
  )

  const player1CritTotal = getTrackTotal(player1Scores.crit)
  const player1TacTotal = getTrackTotal(player1Scores.tac)
  const player2CritTotal = getTrackTotal(player2Scores.crit)
  const player2TacTotal = getTrackTotal(player2Scores.tac)

  const player1Total = player1CritTotal + player1TacTotal + player1KillOp.total
  const player2Total = player2CritTotal + player2TacTotal + player2KillOp.total

  React.useEffect(() => {
    if (player1.score !== player1Total) {
      player1.setScore(player1Total)
    }

    if (player2.score !== player2Total) {
      player2.setScore(player2Total)
    }

    if (player1.critOpPoints !== player1CritTotal) {
      player1.setCritOpPoints(player1CritTotal)
    }

    if (player1.tacOpPoints !== player1TacTotal) {
      player1.setTacOpPoints(player1TacTotal)
    }

    if (player1.killOpPoints !== player1KillOp.total) {
      player1.setKillOpPoints(player1KillOp.total)
    }

    if (player2.critOpPoints !== player2CritTotal) {
      player2.setCritOpPoints(player2CritTotal)
    }

    if (player2.tacOpPoints !== player2TacTotal) {
      player2.setTacOpPoints(player2TacTotal)
    }

    if (player2.killOpPoints !== player2KillOp.total) {
      player2.setKillOpPoints(player2KillOp.total)
    }
  }, [
    player1.score,
    player2.score,
    player1.setScore,
    player2.setScore,
    player1Total,
    player2Total,
    player1CritTotal,
    player1TacTotal,
    player1KillOp.total,
    player2CritTotal,
    player2TacTotal,
    player2KillOp.total,
    player1.critOpPoints,
    player1.tacOpPoints,
    player1.killOpPoints,
    player1.setCritOpPoints,
    player1.setTacOpPoints,
    player1.setKillOpPoints,
    player2.critOpPoints,
    player2.tacOpPoints,
    player2.killOpPoints,
    player2.setCritOpPoints,
    player2.setTacOpPoints,
    player2.setKillOpPoints,
  ])

  if (!isSetupDone) {
    return null
  }

  return (
    <div className="w-full rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ScoreTable
          title={player1.team?.name ?? 'Player 1'}
          data={player1Scores}
          onDataChange={setPlayer1Scores}
          enemyStartingOperatives={player1EnemyStartingOperatives}
          enemyKillsTotal={player1.enemyKilledOperatives}
          onSetEnemyKillsTotal={player1.setEnemyKilledOperatives}
          killOpGradePoints={player1KillOp.gradePoints}
          killOpHasComparisonPoint={player1KillOp.hasComparisonPoint}
        />
        <ScoreTable
          title={player2.team?.name ?? 'Player 2'}
          data={player2Scores}
          onDataChange={setPlayer2Scores}
          enemyStartingOperatives={player2EnemyStartingOperatives}
          enemyKillsTotal={player2.enemyKilledOperatives}
          onSetEnemyKillsTotal={player2.setEnemyKilledOperatives}
          killOpGradePoints={player2KillOp.gradePoints}
          killOpHasComparisonPoint={player2KillOp.hasComparisonPoint}
        />
      </div>
    </div>
  )
}
