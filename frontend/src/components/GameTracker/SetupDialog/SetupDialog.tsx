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

const STEP_TITLES = ['1. Set up the Battle', '1. Set up the Battle', 'Confirm Setup']
const STEP_DESCRIPTIONS = [
  'Select the Kill Teams',
  'Select the Kill Zone',
  'Review and confirm your setup.',
]
const STEP_SIZES = ['5xl', '5xl', '3xl'] as const

const TEAM_OPTIONS = [
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
            options={TEAM_OPTIONS}
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
            options={TEAM_OPTIONS}
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

const SelectKillzoneStep = () => {
  return <div>Select Killzone Step</div>
}

const STEP_COMPONENTS = [SelectTeamsStep, SelectKillzoneStep]
export const SetupDialog = () => {
  const [step, setStep] = React.useState(0)

  const {isSetupOpen, setIsSetupOpen} = useGameTrackerStore()
  return (
    <Dialog size={STEP_SIZES[step]} open={isSetupOpen} onClose={() => setIsSetupOpen(false)}>
      <DialogTitle className="text-4xl uppercase bold">{STEP_TITLES[step]}</DialogTitle>
      <DialogDescription>{STEP_DESCRIPTIONS[step]}</DialogDescription>
      <DialogBody>{React.createElement(STEP_COMPONENTS[step])}</DialogBody>
      <DialogActions>
        <Button onClick={() => setStep(step + 1)}>Next</Button>
      </DialogActions>
    </Dialog>
  )
}
