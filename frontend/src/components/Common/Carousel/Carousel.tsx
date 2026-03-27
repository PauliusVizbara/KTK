import React from 'react'
import clsx from 'clsx'

import {DotButton, useDotButton} from './EmblaCarouselDotButton'
import {PrevButton, NextButton, usePrevNextButtons} from './EmblaCarouselArrowButtons'

import {Button} from '../Button/Button'

type PropType = {
  slides: React.ReactElement[]
  emblaRef: any
  emblaApi: any
  showControls?: boolean
  slideClassName?: string
  viewportClassName?: string
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max)
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const {slides, emblaRef, emblaApi, showControls = true, slideClassName, viewportClassName} = props

  const {prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick} =
    usePrevNextButtons(emblaApi)

  return (
    <div className="flex flex-col max-w-full">
      <section className="embla">
        <div className={clsx('embla__viewport', viewportClassName)} ref={emblaRef}>
          <div className="embla__container">
            {slides.map((el, index) => (
              <div className={`embla__slide ${slideClassName ?? 'basis-full sm:basis-[70%]'}`} key={index}>
                {el}
              </div>
            ))}
          </div>
        </div>
      </section>

      {showControls && (
        <div className="w-full flex justify-between mt-8 items-center">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <Button
            className="w-32 h-fit"
            onClick={() => {
              emblaApi?.scrollTo(getRandomInt(slides.length))
            }}
          >
            Random
          </Button>
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
      )}
    </div>
  )
}

export default EmblaCarousel
