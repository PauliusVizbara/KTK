'use client'

import {Avatar} from '@/components/avatar'
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
          {/* <NavbarSection>
            <NavbarItem href="/search" aria-label="Search">
              <MagnifyingGlassIcon />
            </NavbarItem>
            <NavbarItem href="/inbox" aria-label="Inbox">
              <InboxIcon />
            </NavbarItem>
            <Dropdown>
              <DropdownButton as={NavbarItem}>
                <Avatar src="/profile-photo.jpg" square />
              </DropdownButton>
              <DropdownMenu className="min-w-64" anchor="bottom end">
                <DropdownItem href="/my-profile">
                  <UserIcon />
                  <DropdownLabel>My profile</DropdownLabel>
                </DropdownItem>
                <DropdownItem href="/settings">
                  <Cog8ToothIcon />
                  <DropdownLabel>Settings</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href="/privacy-policy">
                  <ShieldCheckIcon />
                  <DropdownLabel>Privacy policy</DropdownLabel>
                </DropdownItem>
                <DropdownItem href="/share-feedback">
                  <LightBulbIcon />
                  <DropdownLabel>Share feedback</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href="/logout">
                  <ArrowRightStartOnRectangleIcon />
                  <DropdownLabel>Sign out</DropdownLabel>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarSection> */}
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
