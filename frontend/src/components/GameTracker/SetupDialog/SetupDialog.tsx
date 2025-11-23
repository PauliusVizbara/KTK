'use client'
import {DialogBody, DialogActions} from '@/components/dialog'
import {Field, Label} from '@/components/fieldset'
import {Dialog, DialogTitle, DialogDescription} from '@/components/dialog'
import React, {useEffect} from 'react'
import {useGameTrackerStore, useTeamStore, useCritOpStore, useEquipmentStore} from '@/app/store'
import {Heading} from '@/components/heading'
import {Button, CritOpCard} from '@/components'
import Image from 'next/image'
import {Select} from '@/components/select'
import EmblaCarousel from '@/components/Common/Carousel/Carousel'
import useEmblaCarousel from 'embla-carousel-react'
import {Divider} from '@/components/divider'
import ReactDOM from 'react-dom'
import {useShallow} from 'zustand/shallow'
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  XMarkIcon,
  ChevronDownIcon,
} from '@heroicons/react/16/solid'
import {CritOp, Team, TeamListQueryResult, UniversalEquipment} from '../../../../sanity.types'
import {Dropdown, DropdownButton, DropdownItem, DropdownMenu} from '@/components/dropdown'
import {PlayerTurnBanner} from './PlayerTurnBanner'
import {EquipmentAccordion} from './EquipmentAccordion'
const STEP_TITLES = [
  '1. Set up the Battle',
  '1. Set up the Battle',
  '1. Set up the Battle',
  '1. Set up the Battle',
  '2. Select Equipment',
  '2. Select Equipment',
  '2. Select Equipment',
  '2. Select Tac Ops',
  '3. Set Up Equipment',
  '3. Set Up Operatives',
]
const STEP_DESCRIPTIONS = [
  'Select the Kill Teams',
  'Select the Kill Zone',
  'Select any critical operation rules for the battle.',
  'Roll-off for initiative',
  'Select Operatives',
  'Player 1 Selects Equipment',
  'Player 2 Selects Equipment',
  'Reveal Equipment',
  'Select Tac Ops',
  'Set Up Equipment',
  'Set Up Operatives',
]

const STEP_SIZES = [
  '5xl',
  '5xl',
  '5xl',
  '3xl',
  '5xl',
  '5xl',
  '5xl',
  '5xl',
  '5xl',
  '5xl',
  '5xl',
] as const

interface StepProps {
  onNext: () => void
  onBack: () => void
  onFinish?: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

const SelectTeamsStep = ({onNext, onBack, isFirstStep}: StepProps) => {
  const {player1, player2} = useGameTrackerStore()
  const [player1Selection, setPlayer1Selection] = React.useState<{
    id: string | null
    name: string | null
  } | null>(null)
  const [player2Selection, setPlayer2Selection] = React.useState<{
    id: string | null
    name: string | null
  } | null>(null)
  const {teamSelectOptions, getTeamById} = useTeamStore()
  return (
    <>
      <DialogBody>
        <Heading className="mt-6" level={6}>
          1. Each player selects a kill team for the battle.
        </Heading>
        <div className="flex gap-4">
          <Field className="flex-1">
            <Label>Player 1 Team</Label>
            <Dropdown>
              <DropdownButton outline className="w-full justify-between">
                {player1Selection?.name || 'Select Team'}
                <ChevronDownIcon />
              </DropdownButton>
              <DropdownMenu className="max-h-60 overflow-auto">
                {teamSelectOptions.map((team) => (
                  <DropdownItem
                    key={team.id}
                    onClick={() => setPlayer1Selection({name: team.name, id: team.id})}
                  >
                    {team.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </Field>
          <Field className="flex-1">
            <Label>Player 2 Team</Label>
            <Dropdown>
              <DropdownButton outline className="w-full justify-between">
                {player2Selection?.name || 'Select Team'}
                <ChevronDownIcon />
              </DropdownButton>
              <DropdownMenu className="max-h-60 overflow-auto">
                {teamSelectOptions.map((team) => (
                  <DropdownItem
                    key={team.id}
                    onClick={() => setPlayer2Selection({name: team.name, id: team.id})}
                  >
                    {team.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </Field>
        </div>
      </DialogBody>
      <DialogActions>
        <Button
          disabled={!player1Selection?.id || !player2Selection?.id}
          onClick={() => {
            onNext()
            player1.setTeam(getTeamById(player1Selection?.id ?? '') ?? null)
            player2.setTeam(getTeamById(player2Selection?.id ?? '') ?? null)
          }}
        >
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
      <Image
        width={1000}
        height={700}
        alt="Zoomed in map"
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
              key={map}
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
            setMap(maps[killzone as keyof typeof maps][emblaApi?.selectedScrollSnap() ?? 1])
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
            setCritOp(critOps[emblaApi?.selectedScrollSnap() ?? 1])
            onNext()
          }}
        >
          Next
        </Button>
      </DialogActions>
    </>
  )
}

const SelectInitiativeStep = ({onBack, onNext}: StepProps) => {
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
            {gameTrackerStore.player1.team?.name}
          </Button>
          <Button
            color={setupInitiative === 'player2' ? 'primary' : 'secondary'}
            onClick={() => setSetupInitiative('player2')}
            className="flex-1 m-4"
          >
            {gameTrackerStore.player2.team?.name}
          </Button>
        </div>

        {setupInitiative && (
          <ul className="list-disc list-inside">
            <li>
              {setupInitiative === 'player1'
                ? gameTrackerStore.player1.team?.name
                : gameTrackerStore.player2.team?.name}{' '}
              selects one drop zone.
            </li>
            <li>
              {setupInitiative === 'player1'
                ? gameTrackerStore.player2.team?.name
                : gameTrackerStore.player1.team?.name}{' '}
              has the other drop zone and gains the Re-roll initiative card.
            </li>
          </ul>
        )}
      </DialogBody>
      <DialogActions>
        <Button onClick={onBack}>Previous</Button>
        <Button onClick={onNext}>Next</Button>
      </DialogActions>
    </>
  )
}

const SelectOperativesStep = ({onNext, onBack}: StepProps) => {
  return (
    <>
      <DialogBody>
        <div className="mt-4">
          <p>
            Each player secretly selects their operatives for the battle, adhering to the selection
            requirements in their kill team’s rules. They then reveal their selections
            simultaneously.
          </p>
        </div>
      </DialogBody>
      <DialogActions>
        <Button onClick={onBack}>Previous</Button>
        <Button onClick={onNext}>Next</Button>
      </DialogActions>
    </>
  )
}

const useEquipmentData = () => {
  const {player1, player2} = useGameTrackerStore()
  const {universalEquipment} = useEquipmentStore()

  const p1TeamEquipment = React.useMemo(() => {
    return (
      player1.team?.equipment?.map((e) => ({
        ...e,
        id: e._key,
      })) ?? []
    )
  }, [player1.team])

  const p2TeamEquipment = React.useMemo(() => {
    return (
      player2.team?.equipment?.map((e) => ({
        ...e,
        id: e._key,
      })) ?? []
    )
  }, [player2.team])

  const universalEquipmentList = React.useMemo(() => {
    return universalEquipment.map((u) => ({
      ...u.equipment!,
      id: u._id,
      name: `${u.amount}X ${u.equipment!.name}`,
    }))
  }, [universalEquipment])

  const p1AllEquipment = [...p1TeamEquipment, ...universalEquipmentList]
  const p2AllEquipment = [...p2TeamEquipment, ...universalEquipmentList]

  return {p1AllEquipment, p2AllEquipment, player1, player2}
}

const SelectEquipmentPlayer1Step = ({onNext, onBack}: StepProps) => {
  const {p1AllEquipment, player1} = useEquipmentData()

  const p1Selection = React.useMemo(
    () => player1.equipment.map((e: any) => e.id),
    [player1.equipment],
  )

  const handleToggle = (id: string) => {
    if (p1Selection.includes(id)) {
      player1.setEquipment(player1.equipment.filter((e: any) => e.id !== id))
    } else {
      const item = p1AllEquipment.find((e) => e.id === id)
      if (item) {
        player1.setEquipment([...player1.equipment, item])
      }
    }
  }

  return (
    <>
      <DialogBody>
        <div className="space-y-4">
          <PlayerTurnBanner playerName={player1.team?.name || 'Player 1'} />
          <Heading level={6}>Select up to 4 equipment items</Heading>
          <EquipmentAccordion
            equipment={p1AllEquipment}
            selectedIds={p1Selection}
            onToggle={handleToggle}
          />
        </div>
      </DialogBody>
      <DialogActions>
        <Button onClick={onBack}>Previous</Button>
        <Button onClick={onNext}>Next</Button>
      </DialogActions>
    </>
  )
}

const SelectEquipmentPlayer2Step = ({onNext, onBack}: StepProps) => {
  const {p2AllEquipment, player2} = useEquipmentData()

  const p2Selection = React.useMemo(
    () => player2.equipment.map((e: any) => e.id),
    [player2.equipment],
  )

  const handleToggle = (id: string) => {
    if (p2Selection.includes(id)) {
      player2.setEquipment(player2.equipment.filter((e: any) => e.id !== id))
    } else {
      const item = p2AllEquipment.find((e) => e.id === id)
      if (item) {
        player2.setEquipment([...player2.equipment, item])
      }
    }
  }

  return (
    <>
      <DialogBody>
        <div className="space-y-4">
          <PlayerTurnBanner playerName={player2.team?.name || 'Player 2'} />
          <Heading level={6}>Select up to 4 equipment items</Heading>
          <EquipmentAccordion
            equipment={p2AllEquipment}
            selectedIds={p2Selection}
            onToggle={handleToggle}
          />
        </div>
      </DialogBody>
      <DialogActions>
        <Button onClick={onBack}>Previous</Button>
        <Button onClick={onNext}>Next</Button>
      </DialogActions>
    </>
  )
}

const RevealEquipmentStep = ({onNext, onBack}: StepProps) => {
  const {p1AllEquipment, p2AllEquipment, player1, player2} = useEquipmentData()

  const p1Selection = React.useMemo(
    () => player1.equipment.map((e: any) => e.id),
    [player1.equipment],
  )
  const p2Selection = React.useMemo(
    () => player2.equipment.map((e: any) => e.id),
    [player2.equipment],
  )

  return (
    <>
      <DialogBody>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <Heading level={6} className="mb-4">
              {player1.team?.name} Selections
            </Heading>
            <EquipmentAccordion
              equipment={p1AllEquipment.filter((e) => p1Selection.includes(e.id))}
              selectedIds={[]}
              onToggle={() => {}}
              readOnly
            />
          </div>
          <div>
            <Heading level={6} className="mb-4">
              {player2.team?.name} Selections
            </Heading>
            <EquipmentAccordion
              equipment={p2AllEquipment.filter((e) => p2Selection.includes(e.id))}
              selectedIds={[]}
              onToggle={() => {}}
              readOnly
            />
          </div>
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

const SetupOperativesStep = ({onFinish, onBack}: StepProps) => {
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
        <Button onClick={onFinish}>Finish</Button>
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
  SelectEquipmentPlayer1Step,
  SelectEquipmentPlayer2Step,
  RevealEquipmentStep,
  SelectTacOpStep,
  SetupEquipmentStep,
  SetupOperativesStep,
]

interface Props {
  initialTeams: Team[]
  critOps: CritOp[]
  universalEquipment: UniversalEquipment[]
}

export const SetupDialog = (props: Props) => {
  const {initialTeams, critOps, universalEquipment} = props
  const [step, setStep] = React.useState(0)

  const {isSetupOpen, setIsSetupOpen, setIsSetupDone} = useGameTrackerStore()
  const {setTeams} = useTeamStore()
  const {setCritOps} = useCritOpStore()
  const {setUniversalEquipment} = useEquipmentStore()

  useEffect(() => {
    setTeams(initialTeams)
    setCritOps(critOps)
    setUniversalEquipment(universalEquipment)
  }, [initialTeams, setTeams, critOps, setCritOps, universalEquipment, setUniversalEquipment])

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
