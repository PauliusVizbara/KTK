'use client'
import {Checkbox, CheckboxField, CheckboxGroup} from '@/components/checkbox'
import {DialogBody, DialogActions} from '@/components/dialog'
import {Description, Field, FieldGroup, Label} from '@/components/fieldset'
import {Dialog, DialogTitle, DialogDescription} from '@/components/dialog'
import React from 'react'
import {useGameTrackerStore} from '@/app/store'
import {Heading} from '@/components/heading'
import {Combobox, ComboboxLabel, ComboboxOption} from '@/components/combobox'
import {Button} from '@/components'
import Image from 'next/image'
import {Select} from '@/components/select'

const STEP_TITLES = ['1. Set up the Battle', '1. Set up the Battle', 'Confirm Setup']
const STEP_DESCRIPTIONS = [
  'Select the Kill Teams',
  'Select the Kill Zone',
  'Review and confirm your setup.',
]
const STEP_SIZES = ['5xl', 'screen', '3xl'] as const

const TEAMS = [
  {id: 'team-1', name: 'Team Alpha'},
  {id: 'team-2', name: 'Team Bravo'},
  {id: 'team-3', name: 'Team Charlie'},
]

const SelectTeamsStep = () => {
  const {player1, player2} = useGameTrackerStore()
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
            options={TEAMS}
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
            options={TEAMS}
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

const maps = [
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
]

const KILLZONES = [
  {id: 'killzone-1', name: 'Killzone Alpha'},
  {id: 'killzone-2', name: 'Killzone Bravo'},
]

const SelectKillzoneStep = () => {
  const [selectedMap, setSelectedMap] = React.useState<string | null>(null)
  const [killzone, setKillzone] = React.useState<string | null>(null)
  return (
    <>
      <Field className="w-1/4">
        <Label>Kill Zone</Label>
        <Select name="killzone">
          {KILLZONES.map((killzone) => (
            <option key={killzone.id} value={killzone.id}>
              {killzone.name}
            </option>
          ))}
        </Select>
      </Field>

      <div className="overflow-y-auto">
        <div className="grid grid-cols-6 gap-4 ">
          {maps.map((map) => (
            <div
              key={map}
              className={`border-4 rounded-lg cursor-pointer transition
            ${selectedMap === map ? 'border-blue-500' : 'border-transparent'}
          `}
              onClick={() => setSelectedMap(map)}
            >
              <Image
                src={map}
                className="w-full h-auto rounded-lg"
                width={600}
                height={100}
                alt={''}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

const STEP_COMPONENTS = [SelectTeamsStep, SelectKillzoneStep, SelectTeamsStep]
export const SetupDialog = () => {
  const [step, setStep] = React.useState(0)

  const {isSetupOpen, setIsSetupOpen} = useGameTrackerStore()
  return (
    <Dialog
      className="h-[80vh]"
      size={STEP_SIZES[step]}
      open={isSetupOpen}
      onClose={() => setIsSetupOpen(false)}
    >
      <DialogTitle className="text-4xl uppercase bold">{STEP_TITLES[step]}</DialogTitle>
      <DialogDescription>{STEP_DESCRIPTIONS[step]}</DialogDescription>
      <DialogBody>{React.createElement(STEP_COMPONENTS[step])}</DialogBody>
      <DialogActions>
        <Button onClick={() => setStep(step + 1)}>Next</Button>
      </DialogActions>
    </Dialog>
  )
}
