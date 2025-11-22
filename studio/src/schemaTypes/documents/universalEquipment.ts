import {DocumentTextIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const universalEquipment = defineType({
  name: 'universalEquipment',
  title: 'Universal Equipment',
  icon: DocumentTextIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'equipment',
      title: 'Equipment',
      type: 'equipment',
    }),
    defineField({
      name: 'amount',
      title: 'Amount',
      type: 'number',
    }),
  ],

  preview: {
    select: {
      name: 'equipment.name',
      amount: 'amount',
    },
    prepare(selection) {
      const {name, amount} = selection
      return {
        title: `${amount}X ${name}`,
      }
    },
  },
})
