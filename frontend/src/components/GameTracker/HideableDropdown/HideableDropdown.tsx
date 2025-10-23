import {Button, Dropdown, DropdownButton, DropdownItem, DropdownMenu} from '@/components'
import {Text} from '@/components/text'
import {ChevronDownIcon} from '@heroicons/react/16/solid'
import React from 'react'

type HideableDropdownProps = {
  options: string[]
}

export const HideableDropdown = (props: HideableDropdownProps) => {
  const {options} = props
  const [selectedOption, setSelectedOption] = React.useState<string | null>(null)
  const [isRevealed, setIsRevealed] = React.useState(false)

  const containerClass = 'min-w-20 flex justify-center'
  if (selectedOption) {
    return (
      <Button
        disabled={isRevealed}
        className={containerClass}
        onClick={() => setIsRevealed(true)}
        color="primary"
      >
        {isRevealed ? selectedOption : 'Reveal'}
      </Button>
    )
  }

  return (
    <div className={containerClass}>
      <Dropdown>
        <DropdownButton outline>
          Select
          <ChevronDownIcon />
        </DropdownButton>
        <DropdownMenu>
          {options.map((option) => (
            <DropdownItem key={option} onClick={() => setSelectedOption(option)}>
              {option}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}
