import type {NextAuthOptions} from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.AUTH_DISCORD_ID ?? process.env.DISCORD_CLIENT_ID ?? '',
      clientSecret: process.env.AUTH_DISCORD_SECRET ?? process.env.DISCORD_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          scope: 'identify',
        },
      },
      profile(profile) {
        const discordProfile = profile as {
          id: string
          username?: string
          global_name?: string | null
          avatar?: string | null
        }

        const avatarExt = discordProfile.avatar?.startsWith('a_') ? 'gif' : 'png'
        const image = discordProfile.avatar
          ? `https://cdn.discordapp.com/avatars/${discordProfile.id}/${discordProfile.avatar}.${avatarExt}`
          : null

        return {
          id: discordProfile.id,
          name: discordProfile.global_name ?? discordProfile.username ?? 'Discord User',
          image,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({token, user}) {
      if (user) {
        ;(token as {id?: string}).id = user.id
      }
      return token
    },
    async session({session, token}) {
      if (session.user) {
        ;(session.user as {id?: string}).id = (token as {id?: string}).id ?? token.sub ?? undefined
      }
      return session
    },
  },
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
}
