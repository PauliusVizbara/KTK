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
  ],
})
