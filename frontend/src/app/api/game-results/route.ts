import {NextResponse} from 'next/server'
import {getServerSession} from 'next-auth'
import {createClient} from 'next-sanity'
import {z} from 'zod'

import {authOptions} from '@/auth'
import {apiVersion, dataset, projectId} from '@/sanity/api'

const payloadSchema = z.object({
  gameSessionId: z.string().min(8),
  teams: z.object({
    player1: z.object({name: z.string()}),
    player2: z.object({name: z.string()}),
  }),
  scores: z.object({
    player1: z.object({
      critOp: z.number().int().nonnegative(),
      tacOp: z.number().int().nonnegative(),
      killOp: z.number().int().nonnegative(),
      primaryBonus: z.number().int().nonnegative(),
      total: z.number().int().nonnegative(),
    }),
    player2: z.object({
      critOp: z.number().int().nonnegative(),
      tacOp: z.number().int().nonnegative(),
      killOp: z.number().int().nonnegative(),
      primaryBonus: z.number().int().nonnegative(),
      total: z.number().int().nonnegative(),
    }),
  }),
  selections: z.object({
    critOp: z.string().nullable(),
    player1TacOp: z.string().nullable(),
    player2TacOp: z.string().nullable(),
    player1PrimaryOp: z.enum(['critical', 'tactical', 'kill']).nullable(),
    player2PrimaryOp: z.enum(['critical', 'tactical', 'kill']).nullable(),
  }),
})

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({error: 'Unauthorized'}, {status: 401})
  }

  const writeToken = process.env.SANITY_API_WRITE_TOKEN ?? process.env.SANITY_API_READ_TOKEN
  if (!writeToken) {
    return NextResponse.json({error: 'Missing SANITY_API_WRITE_TOKEN'}, {status: 500})
  }

  const body = await request.json().catch(() => null)
  const parsed = payloadSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({error: 'Invalid payload'}, {status: 400})
  }

  const payload = parsed.data
  const documentId = `gameResult.${payload.gameSessionId}`

  const sanity = createClient({
    projectId,
    dataset,
    apiVersion,
    token: writeToken,
    useCdn: false,
  })

  const existing = await sanity.fetch<string | null>(
    '*[_type == "gameResult" && _id == $id][0]._id',
    {id: documentId},
  )

  if (existing) {
    return NextResponse.json({error: 'This game has already been uploaded.'}, {status: 409})
  }

  const submittedBy = {
    id: (session.user as {id?: string}).id ?? null,
    name: session.user.name ?? null,
    email: session.user.email ?? null,
    image: session.user.image ?? null,
  }

  const created = await sanity.create({
    _id: documentId,
    _type: 'gameResult',
    submittedAt: new Date().toISOString(),
    submittedBy,
    teams: payload.teams,
    scores: payload.scores,
    selections: payload.selections,
  })

  return NextResponse.json({ok: true, id: created._id})
}
