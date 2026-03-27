'use client'
import React from 'react'
import {useGameTrackerStore} from '@/app/store'
import Image from 'next/image'
import {Button} from '@/components'

type PlayerScores = {
  crit: number[][]
  tac: number[][]
  enemyKillsByTp: number[]
}

const TP_LABELS = ['TP1', 'TP2', 'TP3', 'TP4'] as const
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

const getKillGradeByTp = (enemyStartingOperatives: number, enemyKillsByTp: number[]) => {
  let cumulativeKills = 0
  return enemyKillsByTp.map((kills) => {
    cumulativeKills += kills
    return getKillGrade(enemyStartingOperatives, cumulativeKills)
  })
}

const getKillOpPointsByTp = (
  playerKillGrades: number[],
  opponentKillGrades: number[],
): {pointsByTp: number[]; total: number} => {
  const pointsByTp = [0, 0, 0, 0]

  for (let tp = 0; tp < 4; tp += 1) {
    const previousGrade = tp === 0 ? 0 : playerKillGrades[tp - 1]
    const gradeGain = Math.max(0, playerKillGrades[tp] - previousGrade)
    pointsByTp[tp] += gradeGain
  }

  if (playerKillGrades[3] > opponentKillGrades[3]) {
    pointsByTp[3] += 1
  }

  const total = Math.min(
    6,
    pointsByTp.reduce((sum, points) => sum + points, 0),
  )
  return {pointsByTp, total}
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
  killOpTotal,
}: {
  title: string
  data: PlayerScores
  onDataChange: (next: PlayerScores) => void
  enemyStartingOperatives: number
  killOpTotal: number
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

  const enemyKillsTotal = sum(data.enemyKillsByTp)
  const killsToNextGrade = getKillsToNextGrade(enemyStartingOperatives, enemyKillsTotal)

  const adjustEnemyKillsTotal = (delta: number) => {
    const nextTotal = clamp(enemyKillsTotal + delta, 0, enemyStartingOperatives)
    onDataChange({...data, enemyKillsByTp: [0, 0, 0, nextTotal]})
  }

  const renderKillOpSkulls = () => (
    <div className="flex items-center gap-1">
      {Array.from({length: 6}).map((_, index) => {
        const isActive = index < killOpTotal
        return (
          <span
            key={`kill-op-${index}`}
            className="inline-flex h-8 w-8 items-center justify-center"
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
              {data.crit.map((tpSkulls, tpIndex) => (
                <td key={`crit-${tpIndex}`} className="px-2 py-2 text-center">
                  {renderSkullSelector('crit', tpIndex, tpSkulls)}
                </td>
              ))}
            </tr>

            <tr className="border-b border-zinc-100">
              <td className="px-2 py-2 font-medium text-zinc-700">Tactical Op</td>
              {data.tac.map((tpSkulls, tpIndex) => (
                <td key={`tac-${tpIndex}`} className="px-2 py-2 text-center">
                  {renderSkullSelector('tac', tpIndex, tpSkulls)}
                </td>
              ))}
            </tr>

            <tr className="border-b border-zinc-100">
              <td className="px-2 py-2 font-medium text-zinc-700">Kill Op</td>
              <td colSpan={4} className="px-2 py-2">
                <div className="flex flex-col items-center text-sm text-zinc-700">
                  <div className="flex flex-wrap items-center justify-center gap-8">
                    {renderKillOpSkulls()}
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Operatives killed</span>
                        <div className="flex items-center gap-1">
                          <Button outline onClick={() => adjustEnemyKillsTotal(-1)}>
                            -
                          </Button>
                          <span className="w-8 text-center text-lg font-bold">
                            {enemyKillsTotal}
                          </span>
                          <Button outline onClick={() => adjustEnemyKillsTotal(1)}>
                            +
                          </Button>
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
    enemyKillsByTp: [0, 0, 0, 0],
  })

  const [player2Scores, setPlayer2Scores] = React.useState<PlayerScores>({
    crit: EMPTY_SKULL_SELECTIONS.map((tp) => [...tp]),
    tac: EMPTY_SKULL_SELECTIONS.map((tp) => [...tp]),
    enemyKillsByTp: [0, 0, 0, 0],
  })

  const player1EnemyStartingOperatives = clamp(player2.selectedOperativeCount || 10, 5, 14)
  const player2EnemyStartingOperatives = clamp(player1.selectedOperativeCount || 10, 5, 14)

  const player1KillGrades = React.useMemo(
    () => getKillGradeByTp(player1EnemyStartingOperatives, player1Scores.enemyKillsByTp),
    [player1EnemyStartingOperatives, player1Scores.enemyKillsByTp],
  )
  const player2KillGrades = React.useMemo(
    () => getKillGradeByTp(player2EnemyStartingOperatives, player2Scores.enemyKillsByTp),
    [player2EnemyStartingOperatives, player2Scores.enemyKillsByTp],
  )

  const player1KillOp = React.useMemo(
    () => getKillOpPointsByTp(player1KillGrades, player2KillGrades),
    [player1KillGrades, player2KillGrades],
  )
  const player2KillOp = React.useMemo(
    () => getKillOpPointsByTp(player2KillGrades, player1KillGrades),
    [player1KillGrades, player2KillGrades],
  )

  const player1Total =
    getTrackTotal(player1Scores.crit) + getTrackTotal(player1Scores.tac) + player1KillOp.total
  const player2Total =
    getTrackTotal(player2Scores.crit) + getTrackTotal(player2Scores.tac) + player2KillOp.total

  React.useEffect(() => {
    if (player1.score !== player1Total) {
      player1.setScore(player1Total)
    }

    if (player2.score !== player2Total) {
      player2.setScore(player2Total)
    }
  }, [player1.score, player2.score, player1.setScore, player2.setScore, player1Total, player2Total])

  if (!isSetupDone) {
    return null
  }

  return (
    <div className="w-full rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ScoreTable
          title={player1.team?.name ?? 'Player 1'}
          data={player1Scores}
          onDataChange={setPlayer1Scores}
          enemyStartingOperatives={player1EnemyStartingOperatives}
          killOpTotal={player1KillOp.total}
        />
        <ScoreTable
          title={player2.team?.name ?? 'Player 2'}
          data={player2Scores}
          onDataChange={setPlayer2Scores}
          enemyStartingOperatives={player2EnemyStartingOperatives}
          killOpTotal={player2KillOp.total}
        />
      </div>
    </div>
  )
}
