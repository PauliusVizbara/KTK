import '@/styles/tailwind.css'
import type {Metadata} from 'next'
import {draftMode} from 'next/headers'

import {SpeedInsights} from '@vercel/speed-insights/next'
import {VisualEditing} from 'next-sanity'
import {Toaster} from 'sonner'

import DraftModeToast from '@/components/DraftModeToast'
import {SanityLive} from '@/sanity/live'
import {handleError} from '@/app/client-utils'

export const metadata: Metadata = {
  title: {
    template: '%s - KTK',
    default: 'KTK',
  },
  description: '',
}

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const {isEnabled: isDraftMode} = await draftMode()

  return (
    <html
      lang="en"
      className="text-zinc-950 antialiased lg:bg-zinc-100 dark:bg-zinc-900 dark:text-white dark:lg:bg-zinc-950"
    >
      <head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body>
        <section className="min-h-screen">
          {/* The <Toaster> component is responsible for rendering toast notifications used in /app/client-utils.ts and /app/components/DraftModeToast.tsx */}
          <Toaster />
          {isDraftMode && (
            <>
              <DraftModeToast />
              {/*  Enable Visual Editing, only to be rendered when Draft Mode is enabled */}
              <VisualEditing />
            </>
          )}
          {/* The <SanityLive> component is responsible for making all sanityFetch calls in your application live, so should always be rendered. */}
          <SanityLive onError={handleError} />
          <main className="">{children}</main>
        </section>
        <SpeedInsights />
      </body>
    </html>
  )
}
