'use client'
import {DialogBody, DialogActions} from '@/components/dialog'
import {Field, Label} from '@/components/fieldset'
import {Dialog, DialogTitle, DialogDescription} from '@/components/dialog'
import React, {useEffect} from 'react'
import {
  useGameTrackerStore,
  useTeamStore,
  useCritOpStore,
  useEquipmentStore,
  useTacOpStore,
} from '@/app/store'
import {Heading} from '@/components/heading'
import {Button, CritOpCard, TacOpCard} from '@/components'
import Image from 'next/image'
import {Select} from '@/components/select'
import EmblaCarousel from '@/components/Common/Carousel/Carousel'
import useEmblaCarousel from 'embla-carousel-react'
import {usePrevNextButtons} from '@/components/Common/Carousel/EmblaCarouselArrowButtons'
import {Divider} from '@/components/divider'
import ReactDOM from 'react-dom'
import {useShallow} from 'zustand/shallow'
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  XMarkIcon,
  ChevronDownIcon,
} from '@heroicons/react/16/solid'
import {CritOp, TacOp, Team, UniversalEquipment} from '../../../../sanity.types'
import {Dropdown, DropdownButton, DropdownItem, DropdownMenu} from '@/components/dropdown'
import {PlayerTurnBanner} from './PlayerTurnBanner'
import {EquipmentAccordion} from './EquipmentAccordion'

interface StepProps {
  onNext: () => void
  onBack: () => void
  onFinish?: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

const getRandomInt = (max: number) => Math.floor(Math.random() * max)

const CarouselStepControls = ({emblaApi, slidesCount}: {emblaApi: any; slidesCount: number}) => {
  const {prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick} =
    usePrevNextButtons(emblaApi)

  return (
    <div className="flex items-center gap-2">
      <Button outline onClick={onPrevButtonClick} disabled={prevBtnDisabled}>
        ←
      </Button>
      <Button
        outline
        className="min-w-24"
        onClick={() => {
          if (slidesCount === 0) return
          emblaApi?.scrollTo(getRandomInt(slidesCount))
        }}
        disabled={slidesCount === 0}
      >
        Random
      </Button>
      <Button outline onClick={onNextButtonClick} disabled={nextBtnDisabled}>
        →
      </Button>
    </div>
  )
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
      <DialogBody className="flex-1 overflow-y-auto">
        <Heading className="mt-6" level={6}>
          Each player selects a kill team for the battle.
        </Heading>
        <div className="mt-6 flex w-full flex-col items-start gap-6 sm:flex-row sm:flex-wrap sm:items-start sm:justify-start sm:gap-8">
          <Field className="w-full max-w-72">
            <Label className="block text-left text-base font-semibold">Player 1</Label>
            <div className="mt-2">
              <Dropdown>
                <DropdownButton
                  outline
                  className="w-full max-w-full justify-between border-2 border-zinc-400 bg-white font-medium shadow-sm"
                >
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
            </div>
          </Field>

          <Field className="w-full max-w-72">
            <Label className="block text-left text-base font-semibold">Player 2</Label>
            <div className="mt-2">
              <Dropdown>
                <DropdownButton
                  outline
                  className="w-full max-w-full justify-between border-2 border-zinc-400 bg-white font-medium shadow-sm"
                >
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
            </div>
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

const SelectTacOpPlayer1Step = ({onNext, onBack}: StepProps) => {
  const tacOps = useTacOpStore((s) => s.tacOps)
  const {player1} = useGameTrackerStore()
  const [emblaRef, emblaApi] = useEmblaCarousel({loop: true, align: 'center'})

  const player1TacOps = React.useMemo(
    () => tacOps.filter((tacOp) => player1.team?.archetypes?.includes(tacOp.archetype)),
    [tacOps, player1.team?.archetypes],
  )

  return (
    <>
      <DialogBody className="flex-1 overflow-y-auto pr-1">
        <div className="space-y-4">
          <PlayerTurnBanner playerName={player1.team?.name || 'Player 1'} />
          {player1TacOps.length > 0 ? (
            <>
              <div className="flex w-full justify-center">
                <CarouselStepControls emblaApi={emblaApi} slidesCount={player1TacOps.length} />
              </div>
              <EmblaCarousel
                emblaRef={emblaRef}
                emblaApi={emblaApi}
                showControls={false}
                viewportClassName="px-2 sm:px-3 md:px-3 lg:px-0"
                slideClassName="basis-[90%] sm:basis-[84%] md:basis-[74%] lg:basis-[62%]"
                slides={player1TacOps.map((tacOp) => (
                  <TacOpCard
                    key={tacOp._id}
                    tacOp={tacOp}
                    className="max-w-[16rem] sm:max-w-[17rem] md:max-w-[18rem] lg:max-w-[19rem]"
                  />
                ))}
              />
            </>
          ) : (
            <p>No Tac Ops available for this team archetype.</p>
          )}
        </div>
      </DialogBody>
      <DialogActions className="w-full justify-end">
        <div className="flex items-center justify-end gap-2">
          <Button onClick={onBack}>Previous</Button>
          <Button
            disabled={player1TacOps.length === 0}
            onClick={() => {
              const selectedTacOp = player1TacOps[emblaApi?.selectedScrollSnap() ?? 0]
              if (!selectedTacOp) return
              player1.setTacOp(selectedTacOp)
              onNext()
            }}
          >
            Next
          </Button>
        </div>
      </DialogActions>
    </>
  )
}

const SelectTacOpPlayer2Step = ({onNext, onBack}: StepProps) => {
  const tacOps = useTacOpStore((s) => s.tacOps)
  const {player2} = useGameTrackerStore()
  const [emblaRef, emblaApi] = useEmblaCarousel({loop: true, align: 'center'})

  const player2TacOps = React.useMemo(
    () => tacOps.filter((tacOp) => player2.team?.archetypes?.includes(tacOp.archetype)),
    [tacOps, player2.team?.archetypes],
  )

  return (
    <>
      <DialogBody className="flex-1 overflow-y-auto pr-1">
        <div className="space-y-4">
          <PlayerTurnBanner playerName={player2.team?.name || 'Player 2'} />
          {player2TacOps.length > 0 ? (
            <>
              <div className="flex w-full justify-center">
                <CarouselStepControls emblaApi={emblaApi} slidesCount={player2TacOps.length} />
              </div>
              <EmblaCarousel
                emblaRef={emblaRef}
                emblaApi={emblaApi}
                showControls={false}
                viewportClassName="px-2 sm:px-3 md:px-3 lg:px-0"
                slideClassName="basis-[90%] sm:basis-[84%] md:basis-[74%] lg:basis-[62%]"
                slides={player2TacOps.map((tacOp) => (
                  <TacOpCard
                    key={tacOp._id}
                    tacOp={tacOp}
                    className="max-w-[16rem] sm:max-w-[17rem] md:max-w-[18rem] lg:max-w-[19rem]"
                  />
                ))}
              />
            </>
          ) : (
            <p>No Tac Ops available for this team archetype.</p>
          )}
        </div>
      </DialogBody>
      <DialogActions className="w-full justify-end">
        <div className="flex items-center justify-end gap-2">
          <Button onClick={onBack}>Previous</Button>
          <Button
            disabled={player2TacOps.length === 0}
            onClick={() => {
              const selectedTacOp = player2TacOps[emblaApi?.selectedScrollSnap() ?? 0]
              if (!selectedTacOp) return
              player2.setTacOp(selectedTacOp)
              onNext()
            }}
          >
            Next
          </Button>
        </div>
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
      <DialogBody className="flex-1 overflow-y-auto">
        <Field className="w-full sm:w-64">
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
        <div className="mb-4 flex w-full justify-center">
          <CarouselStepControls
            emblaApi={emblaApi}
            slidesCount={maps[killzone as keyof typeof maps].length}
          />
        </div>
        <div className="mx-auto w-full max-w-[280px] sm:max-w-[340px] md:max-w-[360px] lg:max-w-[640px]">
          <EmblaCarousel
            emblaRef={emblaRef}
            emblaApi={emblaApi}
            showControls={false}
            slides={maps[killzone as keyof typeof maps].map((map) => (
              <Image
                key={map}
                src={map}
                onClick={() => setZoomedInMap(map)}
                className="mx-auto h-auto w-full rounded-lg"
                width={600}
                height={600}
                alt={''}
                style={{objectFit: 'fill'}}
              />
            ))}
          />
        </div>
      </DialogBody>
      <DialogActions className="w-full justify-end">
        <div className="flex items-center justify-end gap-2">
          <Button onClick={onBack}>Previous</Button>
          <Button
            onClick={() => {
              setMap(maps[killzone as keyof typeof maps][emblaApi?.selectedScrollSnap() ?? 1])
              onNext()
            }}
          >
            Next
          </Button>
        </div>
      </DialogActions>
    </>
  )
}

const SelectCritOpStep = ({onNext, onBack}: StepProps) => {
  const critOps = useCritOpStore((s) => s.critOps)
  const {setCritOp} = useGameTrackerStore()
  const [emblaRef, emblaApi] = useEmblaCarousel({loop: true, align: 'center'})
  return (
    <>
      <DialogBody className="flex-1 overflow-y-auto">
        <div className="mb-4 flex w-full justify-center">
          <CarouselStepControls emblaApi={emblaApi} slidesCount={critOps.length} />
        </div>
        <div className="flex">
          <EmblaCarousel
            emblaRef={emblaRef}
            emblaApi={emblaApi}
            showControls={false}
            viewportClassName="px-2 sm:px-3 md:px-3 lg:px-0"
            slideClassName="basis-[90%] sm:basis-[84%] md:basis-[74%] lg:basis-[62%]"
            slides={critOps.map((critOp) => (
              <CritOpCard
                key={critOp._id}
                critOp={critOp}
                className="max-w-[16rem] sm:max-w-[17rem] md:max-w-[18rem] lg:max-w-[19rem]"
              />
            ))}
          />
        </div>
      </DialogBody>
      <DialogActions className="w-full justify-end">
        <div className="flex items-center justify-end gap-2">
          <Button onClick={onBack}>Previous</Button>
          <Button
            onClick={() => {
              setCritOp(critOps[emblaApi?.selectedScrollSnap() ?? 1])
              onNext()
            }}
          >
            Next
          </Button>
        </div>
      </DialogActions>
    </>
  )
}

const SelectInitiativeStep = ({onBack, onNext}: StepProps) => {
  const gameTrackerStore = useGameTrackerStore()
  const {setInitiativePlayer, player1, player2} = useGameTrackerStore()

  const [setupInitiative, setSetupInitiative] = React.useState<'player1' | 'player2' | null>(null)

  return (
    <>
      <DialogBody className="flex-1 overflow-y-auto">
        <Heading className="mt-6" level={6}>
          Roll-off: the winner decides who has initiative:
        </Heading>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Button
            color={setupInitiative === 'player1' ? 'primary' : 'secondary'}
            onClick={() => setSetupInitiative('player1')}
            className="w-full flex-1 sm:m-2"
          >
            {gameTrackerStore.player1.team?.name}
          </Button>
          <Button
            color={setupInitiative === 'player2' ? 'primary' : 'secondary'}
            onClick={() => setSetupInitiative('player2')}
            className="w-full flex-1 sm:m-2"
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
        <Button
          disabled={!setupInitiative}
          onClick={() => {
            if (!setupInitiative) return
            setInitiativePlayer(setupInitiative)

            if (setupInitiative === 'player1') {
              player1.setHasInitiativeRerollCard(false)
              player2.setHasInitiativeRerollCard(true)
            } else {
              player1.setHasInitiativeRerollCard(true)
              player2.setHasInitiativeRerollCard(false)
            }

            onNext()
          }}
        >
          Next
        </Button>
      </DialogActions>
    </>
  )
}

const SelectOperativesStep = ({onNext, onBack}: StepProps) => {
  const {player1, player2} = useGameTrackerStore()

  return (
    <>
      <DialogBody className="flex-1 overflow-y-auto">
        <div className="mt-4 space-y-8">
          <p>
            Each player secretly selects their operatives for the battle, adhering to the selection
            requirements in their kill team’s rules. They then reveal their selections
            simultaneously.
          </p>

          <p>
            Each player enters the number of operatives they have selected, excluding any operatives
            that are ignored for the Kill Op.
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            {/* Player 1 Counter */}
            <div className="rounded-lg border bg-zinc-50 p-3 sm:p-4">
              <Heading level={6} className="mb-4">
                {player1.team?.name || 'Player 1'}
              </Heading>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm text-zinc-500">Operatives</span>
                <div className="flex items-center gap-2 sm:gap-4">
                  <Button
                    outline
                    onClick={() =>
                      player1.setSelectedOperativeCount(
                        Math.max(5, player1.selectedOperativeCount - 1),
                      )
                    }
                    disabled={player1.selectedOperativeCount <= 5}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center text-xl font-bold sm:text-2xl">
                    {player1.selectedOperativeCount}
                  </span>
                  <Button
                    outline
                    onClick={() =>
                      player1.setSelectedOperativeCount(
                        Math.min(14, player1.selectedOperativeCount + 1),
                      )
                    }
                    disabled={player1.selectedOperativeCount >= 14}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>

            {/* Player 2 Counter */}
            <div className="rounded-lg border bg-zinc-50 p-3 sm:p-4">
              <Heading level={6} className="mb-4">
                {player2.team?.name || 'Player 2'}
              </Heading>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm text-zinc-500">Operatives</span>
                <div className="flex items-center gap-2 sm:gap-4">
                  <Button
                    outline
                    onClick={() =>
                      player2.setSelectedOperativeCount(
                        Math.max(5, player2.selectedOperativeCount - 1),
                      )
                    }
                    disabled={player2.selectedOperativeCount <= 5}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center text-xl font-bold sm:text-2xl">
                    {player2.selectedOperativeCount}
                  </span>
                  <Button
                    outline
                    onClick={() =>
                      player2.setSelectedOperativeCount(
                        Math.min(14, player2.selectedOperativeCount + 1),
                      )
                    }
                    disabled={player2.selectedOperativeCount >= 14}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
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
      <DialogBody className="flex-1 overflow-y-auto">
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
      <DialogBody className="flex-1 overflow-y-auto">
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
      <DialogBody className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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

const SetupEquipmentStep = ({onNext, onBack}: StepProps) => {
  return (
    <>
      <DialogBody className="flex-1 overflow-y-auto">
        <p>
          Each player alternates setting up an item of equipment that’s set up before the battle
          (ladders, etc.), starting with the player with initiative.
        </p>
        <i>Note: it’s item by item, not option by option.</i>
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
      <DialogBody className="flex-1 overflow-y-auto">
        <p>
          Each player alternates setting up one third of their kill team (rounding up), starting
          with the player with initiative. When a player sets up an operative, it must be wholly
          within their drop zone and must be given a Conceal order.
        </p>
      </DialogBody>
      <DialogActions>
        <Button onClick={onBack}>Previous</Button>
        <Button onClick={onFinish}>Finish</Button>
      </DialogActions>
    </>
  )
}

const SETUP_STEPS = [
  {
    title: '1. Set up the Battle',
    description: 'Select the Kill Teams',
    size: '5xl',
    component: SelectTeamsStep,
  },
  {
    title: '1. Set up the Battle',
    description: 'Select the Kill Zone',
    size: '5xl',
    component: SelectKillzoneStep,
  },
  {
    title: '1. Set up the Battle',
    description: 'Select Critical Operation for the battle..',
    size: '5xl',
    component: SelectCritOpStep,
  },
  {
    title: '1. Set up the Battle',
    description: 'Roll-off for initiative',
    size: '3xl',
    component: SelectInitiativeStep,
  },
  {
    title: '2. Select Operatives',
    description: 'Select Operatives',
    size: '5xl',
    component: SelectOperativesStep,
  },
  {
    title: '2. Select Operatives',
    description: 'Player 1 Selects Equipment',
    size: '5xl',
    component: SelectEquipmentPlayer1Step,
  },
  {
    title: '2. Select Operatives',
    description: 'Player 2 Selects Equipment',
    size: '5xl',
    component: SelectEquipmentPlayer2Step,
  },
  {
    title: '2. Select Operatives',
    description: 'Reveal Equipment',
    size: '5xl',
    component: RevealEquipmentStep,
  },
  {
    title: '2. Select Operatives',
    description: 'Player 1 Selects Tac Op',
    size: '5xl',
    component: SelectTacOpPlayer1Step,
  },
  {
    title: '2. Select Operatives',
    description: 'Player 2 Selects Tac Op',
    size: '5xl',
    component: SelectTacOpPlayer2Step,
  },
  {
    title: '3. Set Up Operatives',
    description: 'Set Up Equipment',
    size: '5xl',
    component: SetupEquipmentStep,
  },
  {
    title: '3. Set Up Operatives',
    description: 'Set Up Operatives',
    size: '5xl',
    component: SetupOperativesStep,
  },
] as const

interface Props {
  initialTeams: Team[]
  critOps: CritOp[]
  tacOps: TacOp[]
  universalEquipment: UniversalEquipment[]
}

export const SetupDialog = (props: Props) => {
  const {initialTeams, critOps, tacOps, universalEquipment} = props
  const [step, setStep] = React.useState(0)
  const currentStep = SETUP_STEPS[step]

  const {isSetupOpen, isSetupDone, setIsSetupOpen, setIsSetupDone, resetGameResultUploadState} =
    useGameTrackerStore()
  const {setTeams} = useTeamStore()
  const {setCritOps} = useCritOpStore()
  const {setTacOps} = useTacOpStore()
  const {setUniversalEquipment} = useEquipmentStore()

  useEffect(() => {
    setTeams(initialTeams)
    setCritOps(critOps)
    setTacOps(tacOps)
    setUniversalEquipment(universalEquipment)
  }, [
    initialTeams,
    setTeams,
    critOps,
    setCritOps,
    tacOps,
    setTacOps,
    universalEquipment,
    setUniversalEquipment,
  ])

  useEffect(() => {
    if (isSetupOpen && !isSetupDone) {
      setStep(0)
    }
  }, [isSetupOpen, isSetupDone])

  return (
    <>
      <Dialog
        size={currentStep.size}
        className="flex h-[calc(100dvh-1rem)] max-h-[calc(100dvh-1rem)] min-h-0 flex-col overflow-hidden sm:h-[calc(100dvh-8rem)] sm:max-h-[calc(100dvh-8rem)] lg:h-[85vh] lg:max-h-[85vh]"
        open={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
      >
        <DialogTitle className="text-lg font-bold uppercase sm:text-xl lg:text-2xl">
          {currentStep.title}
        </DialogTitle>
        <DialogDescription>{currentStep.description}</DialogDescription>
        {React.createElement(currentStep.component, {
          onNext: () => setStep(step + 1),
          onBack: () => setStep(step - 1),
          onFinish: () => {
            resetGameResultUploadState()
            setIsSetupDone(true)
            setIsSetupOpen(false)
          },
          isFirstStep: step === 0,
          isLastStep: step === SETUP_STEPS.length - 1,
        })}
      </Dialog>
    </>
  )
}
