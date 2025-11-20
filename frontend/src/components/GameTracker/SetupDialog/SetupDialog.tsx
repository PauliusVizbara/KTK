'use client'
import {DialogBody, DialogActions} from '@/components/dialog'
import {Field, Label} from '@/components/fieldset'
import {Dialog, DialogTitle, DialogDescription} from '@/components/dialog'
import React, {useEffect} from 'react'
import {useGameTrackerStore, useTeamStore, useCritOpStore} from '@/app/store'
import {Heading} from '@/components/heading'
import {Combobox, ComboboxLabel, ComboboxOption} from '@/components/combobox'
import {Button, CritOpCard} from '@/components'
import Image from 'next/image'
import {Select} from '@/components/select'
import EmblaCarousel from '@/components/Common/Carousel/Carousel'
import useEmblaCarousel from 'embla-carousel-react'
import {Divider} from '@/components/divider'
import ReactDOM from 'react-dom'

import {ArrowUturnLeftIcon, ArrowUturnRightIcon, XMarkIcon} from '@heroicons/react/16/solid'
import {CritOp} from '../../../../sanity.types'
const STEP_TITLES = [
  '1. Set up the Battle',
  '1. Set up the Battle',
  '1. Set up the Battle',
  '1. Set up the Battle',
  '2. Select Operatives',
  '2. Select Operatives',
  '2. Select Operatives',
  '3. Set Up Operatives',
  '3. Set Up Operatives',
]
const STEP_DESCRIPTIONS = [
  'Select the Kill Teams',
  'Select the Kill Zone',
  'Select any critical operation rules for the battle.',
  'Roll-off for initiative',
  'Select Operatives',
  'Select Equipment',
  'Select Tac Ops',
  'Set Up Equipment',
  'Set Up Operatives',
]

const STEP_SIZES = ['5xl', '5xl', '5xl', '3xl', '5xl', '5xl', '5xl', '5xl', '5xl'] as const

interface StepProps {
  onNext: () => void
  onBack: () => void
  onFinish?: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

const SelectTeamsStep = ({onNext, onBack, isFirstStep}: StepProps) => {
  const {player1, player2} = useGameTrackerStore()
  const {teamSelectOptions} = useTeamStore()

  return (
    <>
      <DialogBody>
        <Heading className="mt-6" level={6}>
          1. Each player selects a kill team for the battle.
        </Heading>
        <div className="flex">
          <Field className="flex-1 mr-4">
            <Label>Player 1 Team</Label>
            <Combobox
              name="user"
              options={teamSelectOptions}
              onChange={(team) =>
                player1.setTeamSelection({name: team?.name ?? null, id: team?.id ?? null})
              }
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
              onChange={(team) =>
                player2.setTeamSelection({name: team?.name ?? null, id: team?.id ?? null})
              }
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
      </DialogBody>
      <DialogActions>
        <Button disabled={!player1.teamSelection.id || !player2.teamSelection.id} onClick={onNext}>
          Next
        </Button>
      </DialogActions>
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

export function MapZoomModal({
  selectedMap,
  clearSelection,
}: {
  selectedMap: string | null
  clearSelection: () => void
}) {
  const [rotation, setRotation] = React.useState(0)

  if (!selectedMap) return null

  return (
    <div
      onClick={clearSelection}
      className="fixed left-0 w-screen h-screen top-0 inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-20"
    >
      <div className="fixed left-6 top-12 ">
        <ArrowUturnLeftIcon
          className="w-16 h-16 p-4 cursor-pointer text-white"
          onClick={(e) => {
            setRotation((r) => r - 90)
            e.stopPropagation()
          }}
        />
      </div>
      <div className="fixed right-6 top-24 ">
        <ArrowUturnRightIcon
          className="w-16 h-16 p-4 cursor-pointer text-white"
          onClick={(e) => {
            setRotation((r) => r + 90)
            e.stopPropagation()
          }}
        />
      </div>
      <div className="fixed top-6 right-6">
        <XMarkIcon className="w-16 h-16 p-4 cursor-pointer text-white" onClick={clearSelection} />
      </div>
      <img
        src={selectedMap}
        className={`rounded-xl shadow-2xl transition-transform`}
        style={{
          transform: `rotate(${rotation}deg)`,
          maxWidth: `90v${rotation % 180 === 0 ? 'w' : 'h'}`,
          maxHeight: `90v${rotation % 180 === 0 ? 'h' : 'w'}`,
        }}
      />
    </div>
  )
}

const SelectKillzoneStep = ({onNext, onBack}: StepProps) => {
  const [killzone, setKillzone] = React.useState(KILLZONES[0].id)
  const {setMap} = useGameTrackerStore()
  const [zoomedInMap, setZoomedInMap] = React.useState<string | null>(null)
  const [emblaRef, emblaApi] = useEmblaCarousel({loop: true})
  return (
    <>
      <DialogBody>
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
        {ReactDOM.createPortal(
          <MapZoomModal selectedMap={zoomedInMap} clearSelection={() => setZoomedInMap(null)} />,
          document.body,
        )}
        <EmblaCarousel
          emblaRef={emblaRef}
          emblaApi={emblaApi}
          slides={maps[killzone as keyof typeof maps].map((map) => (
            <Image
              src={map}
              onClick={() => setZoomedInMap(map)}
              className="w-full h-auto rounded-lg"
              width={600}
              height={600}
              alt={''}
              style={{objectFit: 'fill'}}
            />
          ))}
        />
      </DialogBody>
      <DialogActions>
        <Button onClick={onBack}>Previous</Button>
        <Button
          onClick={() => {
            setMap(maps[killzone as keyof typeof maps][(emblaApi?.selectedScrollSnap() ?? 1) - 1])
            onNext()
          }}
        >
          Next
        </Button>
      </DialogActions>
    </>
  )
}

const SelectCritOpStep = ({onNext, onBack}: StepProps) => {
  const critOps = useCritOpStore((s) => s.critOps)
  const {setCritOp} = useGameTrackerStore()
  const [emblaRef, emblaApi] = useEmblaCarousel({loop: true})
  return (
    <>
      <DialogBody>
        <div className="mt-4 flex">
          <EmblaCarousel
            emblaRef={emblaRef}
            emblaApi={emblaApi}
            slides={critOps.map((critOp) => (
              <CritOpCard key={critOp._id} critOp={critOp} />
            ))}
          />
        </div>
      </DialogBody>
      <DialogActions>
        <Button onClick={onBack}>Previous</Button>
        <Button
          onClick={() => {
            setCritOp(critOps[(emblaApi?.selectedScrollSnap() ?? 1) - 1])
            onNext()
          }}
        >
          Next
        </Button>
      </DialogActions>
    </>
  )
}

const SelectInitiativeStep = ({onBack, onFinish}: StepProps) => {
  const gameTrackerStore = useGameTrackerStore()

  const [setupInitiative, setSetupInitiative] = React.useState<'player1' | 'player2' | null>(null)

  return (
    <>
      <DialogBody>
        <Heading className="mt-6" level={6}>
          Roll-off: the winner decides who has initiative:
        </Heading>
        <div className="mt-4 flex">
          <Button
            color={setupInitiative === 'player1' ? 'primary' : 'secondary'}
            onClick={() => setSetupInitiative('player1')}
            className="flex-1 m-4"
          >
            {gameTrackerStore.player1.teamSelection.name}
          </Button>
          <Button
            color={setupInitiative === 'player2' ? 'primary' : 'secondary'}
            onClick={() => setSetupInitiative('player2')}
            className="flex-1 m-4"
          >
            {gameTrackerStore.player2.teamSelection.name}
          </Button>
        </div>

        {setupInitiative && (
          <ul className="list-disc list-inside">
            <li>
              {setupInitiative === 'player1'
                ? gameTrackerStore.player1.teamSelection.name
                : gameTrackerStore.player2.teamSelection.name}{' '}
              selects one drop zone.
            </li>
            <li>
              {setupInitiative === 'player1'
                ? gameTrackerStore.player2.teamSelection.name
                : gameTrackerStore.player1.teamSelection.name}{' '}
              has the other drop zone and gains the Re-roll initiative card.
            </li>
          </ul>
        )}
      </DialogBody>
      <DialogActions>
        <Button onClick={onBack}>Previous</Button>
        <Button onClick={onFinish}>Finish</Button>
      </DialogActions>
    </>
  )
}

const SelectOperativesStep = ({onNext, onBack}: StepProps) => {
  return (
    <>
      <DialogBody>
        <Heading className="mt-6" level={6}>
          Select Operatives
        </Heading>
        <div className="mt-4">
          <p>Content for selecting operatives goes here.</p>
        </div>
      </DialogBody>
      <DialogActions>
        <Button onClick={onBack}>Previous</Button>
        <Button onClick={onNext}>Next</Button>
      </DialogActions>
    </>
  )
}

const SelectEquipmentStep = ({onNext, onBack}: StepProps) => {
  return (
    <>
      <DialogBody>
        <Heading className="mt-6" level={6}>
          Select Equipment
        </Heading>
        <div className="mt-4">
          <p>Content for selecting equipment goes here.</p>
        </div>
      </DialogBody>
      <DialogActions>
        <Button onClick={onBack}>Previous</Button>
        <Button onClick={onNext}>Next</Button>
      </DialogActions>
    </>
  )
}

const SelectTacOpStep = ({onNext, onBack}: StepProps) => {
  return (
    <>
      <DialogBody>
        <Heading className="mt-6" level={6}>
          Select Tac Ops
        </Heading>
        <div className="mt-4">
          <p>Content for selecting Tac Ops goes here.</p>
        </div>
      </DialogBody>
      <DialogActions>
        <Button onClick={onBack}>Previous</Button>
        <Button onClick={onNext}>Next</Button>
      </DialogActions>
    </>
  )
}

const SetupEquipmentStep = ({onNext, onBack}: StepProps) => {
  return (
    <>
      <DialogBody>
        <Heading className="mt-6" level={6}>
          Set Up Equipment
        </Heading>
        <div className="mt-4">
          <p>Content for setting up equipment goes here.</p>
        </div>
      </DialogBody>
      <DialogActions>
        <Button onClick={onBack}>Previous</Button>
        <Button onClick={onNext}>Next</Button>
      </DialogActions>
    </>
  )
}

const SetupOperativesStep = ({onNext, onBack}: StepProps) => {
  return (
    <>
      <DialogBody>
        <Heading className="mt-6" level={6}>
          Set Up Operatives
        </Heading>
        <div className="mt-4">
          <p>Content for setting up operatives goes here.</p>
        </div>
      </DialogBody>
      <DialogActions>
        <Button onClick={onBack}>Previous</Button>
        <Button onClick={onNext}>Next</Button>
      </DialogActions>
    </>
  )
}

const STEP_COMPONENTS = [
  SelectTeamsStep,
  SelectKillzoneStep,
  SelectCritOpStep,
  SelectInitiativeStep,
  SelectOperativesStep,
  SelectEquipmentStep,
  SelectTacOpStep,
  SetupEquipmentStep,
  SetupOperativesStep,
]

interface Props {
  initialTeams: {id: string; name: string}[]
  critOps: CritOp[]
}

export const SetupDialog = ({initialTeams, critOps}: Props) => {
  const [step, setStep] = React.useState(0)

  const {isSetupOpen, setIsSetupOpen, setIsSetupDone} = useGameTrackerStore()
  const {setTeamSelectOptions} = useTeamStore()
  const {setCritOps} = useCritOpStore()

  useEffect(() => {
    setTeamSelectOptions(initialTeams)
    setCritOps(critOps)
  }, [initialTeams, setTeamSelectOptions, critOps, setCritOps])

  return (
    <>
      <Dialog size={STEP_SIZES[step]} open={isSetupOpen} onClose={() => setIsSetupOpen(false)}>
        <DialogTitle className="text-4xl uppercase bold">{STEP_TITLES[step]}</DialogTitle>
        <DialogDescription>{STEP_DESCRIPTIONS[step]}</DialogDescription>
        {React.createElement(STEP_COMPONENTS[step], {
          onNext: () => setStep(step + 1),
          onBack: () => setStep(step - 1),
          onFinish: () => {
            setIsSetupDone(true)
            setIsSetupOpen(false)
          },
          isFirstStep: step === 0,
          isLastStep: step === STEP_COMPONENTS.length - 1,
        })}
      </Dialog>
    </>
  )
}
