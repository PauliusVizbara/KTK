import {defineField, defineType} from 'sanity'
import {BasketIcon} from '@sanity/icons'

export const equipment = defineType({
  name: 'equipment',
  title: 'Equipment',
  type: 'object',
  icon: BasketIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'weapon',
      title: 'Weapon',
      type: 'weapon',
    }),
    defineField({
      name: 'action',
      title: 'Action',
      type: 'action',
    }),
  ],
  preview: {
    select: {
      name: 'name',
    },
    prepare(selection) {
      const {name} = selection
      return {
        title: name,
      }
    },
  },
})
