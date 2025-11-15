import {Checkbox, CheckboxField} from '@/components/checkbox'
import {DialogBody, DialogActions} from '@/components/dialog'
import {Description, Field, FieldGroup, Label} from '@/components/fieldset'
import {Dialog, DialogTitle, DialogDescription} from '@/components/dialog'
import React from 'react'
import {Select, Button} from '@headlessui/react'

export const SetupDialog = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}) => {
  const [step, setStep] = React.useState(0)

  return (
    <Dialog size={step === 0 ? 'screen' : '5xl'} open={isOpen} onClose={() => setIsOpen(false)}>
      <DialogTitle>Refund payment</DialogTitle>
      <DialogDescription>
        The refund will be reflected in the customer’s bank account 2 to 3 business days after
        processing.
      </DialogDescription>
      <DialogBody>
        <FieldGroup>
          <Field>
            <Label>Amount</Label>
          </Field>
          <Field>
            <Label>Reason</Label>
            <Select name="reason" defaultValue="">
              <option value="" disabled>
                Select a reason&hellip;
              </option>
              <option value="duplicate">Duplicate</option>
              <option value="fraudulent">Fraudulent</option>
              <option value="requested_by_customer">Requested by customer</option>
              <option value="other">Other</option>
            </Select>
          </Field>
          <CheckboxField>
            <Checkbox name="notify" />
            <Label>Notify customer</Label>
            <Description>An email notification will be sent to this customer.</Description>
          </CheckboxField>
        </FieldGroup>
      </DialogBody>
      <DialogActions>
        <Button onClick={() => setStep(step + 1)}>Increase {step}</Button>
        <Button onClick={() => setIsOpen(false)}>Cancel</Button>
        <Button onClick={() => setIsOpen(false)}>Refund</Button>
      </DialogActions>
    </Dialog>
  )
}
