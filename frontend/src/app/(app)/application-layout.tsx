'use client'

import {Avatar} from '@/components/avatar'
import {Button} from '@/components'
import {DropdownDivider, DropdownItem, DropdownLabel, DropdownMenu} from '@/components/dropdown'
import {Heading} from '@/components/heading'
import {Navbar, NavbarDivider, NavbarItem, NavbarSection, NavbarSpacer} from '@/components/navbar'
import {
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarItem,
  SidebarSection,
} from '@/components/sidebar'
import {StackedLayout} from '@/components/stacked-layout'
import {getEvents} from '@/data'
import {Cog8ToothIcon, PlusIcon} from '@heroicons/react/16/solid'
import {usePathname} from 'next/navigation'
import {signIn, signOut, useSession} from 'next-auth/react'

const navItems = [
  {label: 'Game Tracker', url: '/'},
  {label: 'Stats', url: '/stats'},
]

function TeamDropdownMenu() {
  return (
    <DropdownMenu className="min-w-80 lg:min-w-64" anchor="bottom start">
      <DropdownItem href="/teams/1/settings">
        <Cog8ToothIcon />
        <DropdownLabel>Settings</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href="/teams/1">
        <Avatar slot="icon" src="/tailwind-logo.svg" />
        <DropdownLabel>Tailwind Labs</DropdownLabel>
      </DropdownItem>
      <DropdownItem href="/teams/2">
        <Avatar slot="icon" initials="WC" className="bg-purple-500 text-white" />
        <DropdownLabel>Workcation</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href="/teams/create">
        <PlusIcon />
        <DropdownLabel>New team&hellip;</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  )
}

export function ApplicationLayout({
  events,
  children,
}: {
  events: Awaited<ReturnType<typeof getEvents>>
  children: React.ReactNode
}) {
  let pathname = usePathname()
  const {data: session, status} = useSession()

  const profileName = session?.user?.name || 'Discord User'
  const profileImage = session?.user?.image || null

  return (
    <StackedLayout
      navbar={
        <Navbar>
          <Heading level={2}>Kill Team Kaunas</Heading>
          <NavbarDivider className="max-lg:hidden" />
          <NavbarSection className="max-lg:hidden">
            {navItems.map(({label, url}) => (
              <NavbarItem current={pathname === url} key={label} href={url}>
                {label}
              </NavbarItem>
            ))}
          </NavbarSection>
          <NavbarSpacer />
          <NavbarSection>
            {status === 'authenticated' ? (
              <div className="flex items-center gap-3">
                <Avatar
                  src={profileImage}
                  initials={profileName.slice(0, 1).toUpperCase()}
                  alt={profileName}
                  className="size-8 bg-zinc-200"
                />
                <div className="hidden text-right sm:block">
                  <div className="text-sm font-semibold text-zinc-900">{profileName}</div>
                </div>
                <Button outline onClick={() => signOut({callbackUrl: '/'})}>
                  Sign out
                </Button>
              </div>
            ) : (
              <Button onClick={() => signIn('discord', {callbackUrl: '/'})}>Login</Button>
            )}
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <Heading level={2}>Kill Team Kaunas</Heading>
          </SidebarHeader>
          <SidebarBody>
            <SidebarSection>
              {navItems.map(({label, url}) => (
                <SidebarItem key={label} href={url}>
                  {label}
                </SidebarItem>
              ))}
            </SidebarSection>
          </SidebarBody>
        </Sidebar>
      }
    >
      {children}
    </StackedLayout>
  )
}
