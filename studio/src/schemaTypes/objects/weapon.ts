import {defineField, defineType} from 'sanity'
import {BasketIcon} from '@sanity/icons'

/**
 * Link schema object. This link object lets the user first select the type of link and then
 * then enter the URL, page reference, or post reference - depending on the type selected.
 * Learn more: https://www.sanity.io/docs/object-type
 */

export const weapon = defineType({
  name: 'weapon',
  title: 'Weapon',
  type: 'object',
  icon: BasketIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Weapon Name',
      type: 'string',
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {title: 'Ranged', value: 'ranged'},
          {title: 'Melee', value: 'melee'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'rules',
      title: 'Weapon Rules',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Severe', value: 'severe'},
          {title: 'Lethal', value: 'lethal'},
        ],
      },
    }),
  ],
  preview: {
    select: {
      name: 'name',
      type: 'type',
    },
    prepare(selection) {
      const {name, type} = selection
      return {
        title: `${name} (${type})`,
      }
    },
  },
})
