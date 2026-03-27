import {Heading} from '@/components/heading'
import {Text} from '@/components/text'
import {client} from '@/sanity/client'
import {gameResultsQuery} from '@/sanity/queries'
import {ChevronDownIcon} from '@heroicons/react/16/solid'
import type {Metadata} from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Stats',
}

type PrimaryOp = 'critical' | 'tactical' | 'kill' | null

type GameResult = {
  _id: string
  submittedAt?: string
  submittedBy?: {
    id?: string | null
    name?: string | null
    email?: string | null
    image?: string | null
  } | null
  teams?: {
    player1?: {name?: string | null}
    player2?: {name?: string | null}
  } | null
  scores?: {
    player1?: {
      critOp?: number
      tacOp?: number
      killOp?: number
      primaryBonus?: number
      total?: number
    }
    player2?: {
      critOp?: number
      tacOp?: number
      killOp?: number
      primaryBonus?: number
      total?: number
    }
  } | null
  selections?: {
    critOp?: string | null
    player1TacOp?: string | null
    player2TacOp?: string | null
    player1PrimaryOp?: PrimaryOp
    player2PrimaryOp?: PrimaryOp
  } | null
}

function formatDate(value?: string) {
  if (!value) return 'Unknown date'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Unknown date'
  return date.toLocaleString()
}

const ACTIVE_SKULL_FILTER =
  'brightness(0) saturate(100%) invert(49%) sepia(94%) saturate(3145%) hue-rotate(2deg) brightness(98%) contrast(94%)'

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

function SkullLine({active, total}: {active: number; total: number}) {
  const activeCount = clamp(active, 0, total)

  return (
    <div className="flex items-center gap-1">
      {Array.from({length: total}).map((_, index) => {
        const isActive = index < activeCount

        return (
          <span
            key={`skull-${total}-${activeCount}-${index}`}
            className="inline-flex h-6 w-6 items-center justify-center"
          >
            <Image
              src="/images/skull.svg"
              alt="Skull"
              width={14}
              height={14}
              className={isActive ? 'opacity-100' : 'opacity-40 grayscale'}
              style={isActive ? {filter: ACTIVE_SKULL_FILTER} : undefined}
            />
          </span>
        )
      })}
    </div>
  )
}

function StaticScoreSkulls({
  points,
  row,
  primaryOp,
  primaryBonus,
}: {
  points: number
  row: Exclude<PrimaryOp, null>
  primaryOp: PrimaryOp
  primaryBonus: number
}) {
  const hasPrimaryBonus = primaryOp === row

  return (
    <div className="flex items-center justify-start gap-2">
      <SkullLine active={points} total={6} />
      {hasPrimaryBonus ? (
        <div className="flex items-center gap-2">
          <span className="text-zinc-500">+</span>
          <SkullLine active={primaryBonus} total={3} />
        </div>
      ) : null}
    </div>
  )
}

export default async function StatsPage() {
  const games = (await client.fetch(gameResultsQuery)) as GameResult[]

  return (
    <div className="space-y-6">
      <div>
        <Heading>Game Stats</Heading>
        <Text className="mt-2 text-zinc-600">Public list of all uploaded game results.</Text>
      </div>

      {games.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
          No uploaded games yet.
        </div>
      ) : (
        <ul className="space-y-4">
          {games.map((game, index) => {
            const uploader = game.submittedBy?.name || 'Unknown uploader'
            const uploaderImage = game.submittedBy?.image || null
            const team1 = game.teams?.player1?.name || 'Player 1'
            const team2 = game.teams?.player2?.name || 'Player 2'
            const p1Crit = game.scores?.player1?.critOp ?? 0
            const p1Tac = game.scores?.player1?.tacOp ?? 0
            const p1Kill = game.scores?.player1?.killOp ?? 0
            const p1Primary = game.scores?.player1?.primaryBonus ?? 0
            const p1Total = game.scores?.player1?.total ?? 0
            const p2Crit = game.scores?.player2?.critOp ?? 0
            const p2Tac = game.scores?.player2?.tacOp ?? 0
            const p2Kill = game.scores?.player2?.killOp ?? 0
            const p2Primary = game.scores?.player2?.primaryBonus ?? 0
            const p2Total = game.scores?.player2?.total ?? 0
            const isTie = p1Total === p2Total
            const p1TextColor = isTie
              ? 'text-zinc-700'
              : p1Total > p2Total
                ? 'text-green-600'
                : 'text-red-600'
            const p2TextColor = isTie
              ? 'text-zinc-700'
              : p2Total > p1Total
                ? 'text-green-600'
                : 'text-red-600'

            return (
              <li key={game._id}>
                <details className="group rounded-lg border border-zinc-300/80 bg-zinc-50 px-4 py-4 shadow-sm sm:px-6 sm:py-5">
                  <summary className="list-none cursor-pointer">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <ChevronDownIcon
                        className="h-7 w-7 shrink-0 text-zinc-500 transition-transform duration-200 group-open:rotate-180"
                        aria-hidden="true"
                      />
                      <div className="flex min-w-0 flex-1 flex-col justify-between gap-5 sm:flex-row sm:items-center">
                        <div className="grid min-w-0 flex-1 grid-cols-[1fr_auto_1fr] items-center gap-x-6 gap-y-1 text-center sm:max-w-xl">
                          <div className="min-w-0">
                            <div
                              className={`truncate text-lg font-bold uppercase tracking-wide sm:text-xl ${p1TextColor}`}
                            >
                              {team1}
                            </div>
                            <div className={`mt-1 text-base font-bold sm:text-lg ${p1TextColor}`}>
                              {p1Total}
                            </div>
                          </div>
                          <div className="flex items-center justify-center text-sm font-semibold uppercase tracking-wider text-zinc-600">
                            Versus
                          </div>
                          <div className="min-w-0">
                            <div
                              className={`truncate text-lg font-bold uppercase tracking-wide sm:text-xl ${p2TextColor}`}
                            >
                              {team2}
                            </div>
                            <div className={`mt-1 text-base font-bold sm:text-lg ${p2TextColor}`}>
                              {p2Total}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-auto">
                          <div className="text-right">
                            <div className="text-sm text-zinc-900">Submitted by:</div>
                            <div className="text-lg font-semibold text-zinc-900">{uploader}</div>
                          </div>
                          <div className="inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-zinc-300 bg-white">
                            {uploaderImage ? (
                              <img
                                src={uploaderImage}
                                alt={uploader}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-base font-bold uppercase text-zinc-700">
                                {uploader.slice(0, 1)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </summary>

                  <div className="mt-5 space-y-4 border-t border-zinc-300 pt-4">
                    <div className="overflow-x-auto rounded-md border border-zinc-200 bg-white">
                      <table className="w-full border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-zinc-200 text-zinc-700">
                            <th className="px-3 py-2 text-left">Track</th>
                            <th className="px-3 py-2 text-center">{team1}</th>
                            <th className="px-3 py-2 text-center">{team2}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-zinc-100">
                            <td className="px-3 py-2">Critical Op</td>
                            <td className="px-3 py-2 text-left font-semibold">
                              <StaticScoreSkulls
                                points={p1Crit}
                                row="critical"
                                primaryOp={game.selections?.player1PrimaryOp ?? null}
                                primaryBonus={p1Primary}
                              />
                            </td>
                            <td className="px-3 py-2 text-left font-semibold">
                              <StaticScoreSkulls
                                points={p2Crit}
                                row="critical"
                                primaryOp={game.selections?.player2PrimaryOp ?? null}
                                primaryBonus={p2Primary}
                              />
                            </td>
                          </tr>
                          <tr className="border-b border-zinc-100">
                            <td className="px-3 py-2">Tactical Op</td>
                            <td className="px-3 py-2 text-left font-semibold">
                              <div className="flex items-center gap-2">
                                <StaticScoreSkulls
                                  points={p1Tac}
                                  row="tactical"
                                  primaryOp={game.selections?.player1PrimaryOp ?? null}
                                  primaryBonus={p1Primary}
                                />
                                <span className="text-xs font-medium text-zinc-600 whitespace-nowrap">
                                  {game.selections?.player1TacOp || 'Not selected'}
                                </span>
                              </div>
                            </td>
                            <td className="px-3 py-2 text-left font-semibold">
                              <div className="flex items-center gap-2">
                                <StaticScoreSkulls
                                  points={p2Tac}
                                  row="tactical"
                                  primaryOp={game.selections?.player2PrimaryOp ?? null}
                                  primaryBonus={p2Primary}
                                />
                                <span className="text-xs font-medium text-zinc-600 whitespace-nowrap">
                                  {game.selections?.player2TacOp || 'Not selected'}
                                </span>
                              </div>
                            </td>
                          </tr>
                          <tr className="border-b border-zinc-100">
                            <td className="px-3 py-2">Kill Op</td>
                            <td className="px-3 py-2 text-left font-semibold">
                              <StaticScoreSkulls
                                points={p1Kill}
                                row="kill"
                                primaryOp={game.selections?.player1PrimaryOp ?? null}
                                primaryBonus={p1Primary}
                              />
                            </td>
                            <td className="px-3 py-2 text-left font-semibold">
                              <StaticScoreSkulls
                                points={p2Kill}
                                row="kill"
                                primaryOp={game.selections?.player2PrimaryOp ?? null}
                                primaryBonus={p2Primary}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="px-3 py-2 font-bold uppercase">Final Total</td>
                            <td className="px-3 py-2 text-center text-base font-bold text-zinc-900">
                              {p1Total}
                            </td>
                            <td className="px-3 py-2 text-center text-base font-bold text-zinc-900">
                              {p2Total}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="grid gap-3 rounded-md border border-zinc-200 bg-white p-3 text-sm text-zinc-700 sm:grid-cols-2">
                      <div>
                        <div className="font-semibold text-zinc-900">Submitted</div>
                        <div>{formatDate(game.submittedAt)}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-zinc-900">Crit Op</div>
                        <div>{game.selections?.critOp || 'Not selected'}</div>
                      </div>
                    </div>
                  </div>
                </details>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
