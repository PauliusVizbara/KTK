'use client'
import {DialogBody, DialogActions} from '@/components/dialog'
import {Field, Label} from '@/components/fieldset'
import {Dialog, DialogTitle, DialogDescription} from '@/components/dialog'
import React, {useEffect} from 'react'
import {useGameTrackerStore, useTeamStore} from '@/app/store'
import {Heading} from '@/components/heading'
import {Combobox, ComboboxLabel, ComboboxOption} from '@/components/combobox'
import {Button} from '@/components'
import Image from 'next/image'
import {Select} from '@/components/select'
import EmblaCarousel from '@/components/Common/Carousel/Carousel'
import {Divider} from '@/components/divider'
import ReactDOM from 'react-dom'

import {ArrowUturnLeftIcon, ArrowUturnRightIcon, XMarkIcon} from '@heroicons/react/16/solid'

const STEP_TITLES = ['1. Set up the Battle', '1. Set up the Battle', '1. Set up the Battle']
const STEP_DESCRIPTIONS = [
  'Select the Kill Teams',
  'Select the Kill Zone',
  'Roll-off for initiative',
]

const STEP_SIZES = ['5xl', '5xl', '3xl'] as const

const SelectTeamsStep = () => {
  const {player1, player2} = useGameTrackerStore()
  const {teamSelectOptions} = useTeamStore()

  return (
    <>
      <Heading className="mt-6" level={6}>
        1. Each player selects a kill team for the battle.
      </Heading>
      <div className="flex">
        <Field className="flex-1 mr-4">
          <Label>Player 1 Team</Label>
          <Combobox
            name="user"
            options={teamSelectOptions}
            onChange={(team) => player1.setTeamId(team?.id ?? null)}
            displayValue={(user) => user?.name}
          >
            {(user) => (
              <ComboboxOption value={user}>
                <ComboboxLabel>{user.name}</ComboboxLabel>
              </ComboboxOption>
            )}
          </Combobox>
        </Field>
        <Field className="flex-1 ml-4">
          <Label>Player 2 Team</Label>
          <Combobox
            name="user"
            options={teamSelectOptions}
            onChange={(team) => player2.setTeamId(team?.id ?? null)}
            displayValue={(user) => user?.name}
          >
            {(user) => (
              <ComboboxOption value={user}>
                <ComboboxLabel>{user.name}</ComboboxLabel>
              </ComboboxOption>
            )}
          </Combobox>
        </Field>
      </div>
    </>
  )
}

const maps = {
  'volkus': [
    '/images/maps/volkus-1.png',
    '/images/maps/volkus-2.png',
    '/images/maps/volkus-3.png',
    '/images/maps/volkus-4.png',
    '/images/maps/volkus-5.png',
    '/images/maps/volkus-6.png',
    '/images/maps/volkus-7.png',
    '/images/maps/volkus-8.png',
    '/images/maps/volkus-9.png',
    '/images/maps/volkus-10.png',
    '/images/maps/volkus-11.png',
    '/images/maps/volkus-12.png',
  ],
  'tomb-world': [
    '/images/maps/tomb-world-1.png',
    '/images/maps/tomb-world-2.png',
    '/images/maps/tomb-world-3.png',
    '/images/maps/tomb-world-4.png',
    '/images/maps/tomb-world-5.png',
    '/images/maps/tomb-world-6.png',
  ],
}
const KILLZONES = [
  {id: 'volkus', name: 'Volkus'},
  {id: 'tomb-world', name: 'Tomb World'},
]

export function MapZoomModal() {
  const selectedMap = useGameTrackerStore((s) => s.selectedMap)
  const clearSelection = useGameTrackerStore((s) => s.clearSelection)

  const [rotation, setRotation] = React.useState(0)

  if (!selectedMap) return null

  return (
    <div className="fixed left-0 w-screen h-screen top-0 inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-20">
      <div className="fixed left-12 top-12 ">
        <div className="fixed top-24 right-12">
          <XMarkIcon className="w-16 h-16 p-4 cursor-pointer text-white" onClick={clearSelection} />
        </div>

        <ArrowUturnLeftIcon
          className="w-16 h-16 p-4 cursor-pointer text-white"
          onClick={(e) => {
            setRotation((r) => r - 90)
            e.stopPropagation()
          }}
        />
      </div>
      <div className="fixed right-12 top-12 ">
        <ArrowUturnRightIcon
          className="w-16 h-16 p-4 cursor-pointer text-white"
          onClick={(e) => {
            setRotation((r) => r + 90)
            e.stopPropagation()
          }}
        />
      </div>

      <img
        onClick={(e) => e.stopPropagation()}
        src={selectedMap}
        className={`max-h-[90vh]  rounded-xl shadow-2xl transition-transform`}
        style={{
          transform: `rotate(${rotation}deg)`,
          maxWidth: `90v${rotation % 180 === 0 ? 'w' : 'h'}`,
        }}
      />
    </div>
  )
}

const SelectKillzoneStep = () => {
  const setSelectedMap = useGameTrackerStore((s) => s.setSelectedMap)
  const [killzone, setKillzone] = React.useState(KILLZONES[0].id)
  return (
    <>
      <Field className="w-1/4">
        <Label>Kill Zone</Label>
        <Select value={killzone} onChange={(e) => setKillzone(e.target.value)} name="killzone">
          {KILLZONES.map((killzone) => (
            <option key={killzone.id} value={killzone.id}>
              {killzone.name}
            </option>
          ))}
        </Select>
      </Field>
      <Divider className="my-6" />
      {ReactDOM.createPortal(<MapZoomModal />, document.body)}
      <EmblaCarousel
        slides={maps[killzone as keyof typeof maps].map((map) => (
          <Image
            src={map}
            onClick={() => setSelectedMap(map)}
            className="w-full h-auto rounded-lg"
            width={600}
            height={600}
            alt={''}
            style={{objectFit: 'fill'}}
          />
        ))}
        options={{loop: true}}
      />
    </>
  )
}

const SelectCritOpStep = () => {
  return (
    <Heading className="mt-6" level={6}>
      3. Select any critical operation rules for the battle.
    </Heading>
  )
}

const SelectInitiativeStep = () => {
  const gameTrackerStore = useGameTrackerStore()

  const [setupInitiative, setSetupInitiative] = React.useState<'player1' | 'player2' | null>(null)

  return (
    <>
      <Heading className="mt-6" level={6}>
        Roll-off: the winner decides who has initiative:
      </Heading>
      <div className="mt-4 flex">
        <Button
          color={setupInitiative === 'player1' ? 'primary' : 'secondary'}
          onClick={() => setSetupInitiative('player1')}
          className="flex-1 m-4"
        >
          {gameTrackerStore.player1.teamId}
        </Button>
        <Button
          color={setupInitiative === 'player2' ? 'primary' : 'secondary'}
          onClick={() => setSetupInitiative('player2')}
          className="flex-1 m-4"
        >
          {gameTrackerStore.player2.teamId}
        </Button>
      </div>
    </>
  )
}

const STEP_COMPONENTS = [
  SelectTeamsStep,
  SelectKillzoneStep,
  SelectCritOpStep,
  SelectInitiativeStep,
]

interface Props {
  initialTeams: {id: string; name: string}[]
}

export const SetupDialog = ({initialTeams}: Props) => {
  const [step, setStep] = React.useState(0)

  const {isSetupOpen, setIsSetupOpen} = useGameTrackerStore()
  const {setTeamSelectOptions} = useTeamStore()

  useEffect(() => {
    setTeamSelectOptions(initialTeams)
  }, [initialTeams])

  return (
    <>
      <Dialog size={STEP_SIZES[step]} open={isSetupOpen} onClose={() => setIsSetupOpen(false)}>
        <DialogTitle className="text-4xl uppercase bold">{STEP_TITLES[step]}</DialogTitle>
        <DialogDescription>{STEP_DESCRIPTIONS[step]}</DialogDescription>
        <DialogBody>{React.createElement(STEP_COMPONENTS[step])}</DialogBody>
        <DialogActions>
          <Button disabled={step === 0} onClick={() => setStep(step - 1)}>
            Previous
          </Button>
          <Button disabled={step === STEP_COMPONENTS.length - 1} onClick={() => setStep(step + 1)}>
            Next
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
