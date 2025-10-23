import {defineField, defineType} from 'sanity'
import {ProjectsIcon} from '@sanity/icons'

/**
 * Link schema object. This link object lets the user first select the type of link and then
 * then enter the URL, page reference, or post reference - depending on the type selected.
 * Learn more: https://www.sanity.io/docs/object-type
 */

export const operative = defineType({
  name: 'operative',
  title: 'Operative',
  type: 'object',
  icon: ProjectsIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Operative Name',
      type: 'string',
    }),
    defineField({
      name: 'portrait',
      title: 'Portrait',
      type: 'image',
    }),

    defineField({
      name: 'apl',
      title: 'APL',
      type: 'number',
    }),
    defineField({
      name: 'move',
      title: 'Move',
      type: 'number',
    }),
    defineField({
      name: 'save',
      title: 'Save',
      type: 'number',
    }),
    defineField({
      name: 'wounds',
      title: 'Wounds',
      type: 'number',
    }),
    defineField({
      name: 'weapons',
      title: 'Weapons',
      type: 'array',
      of: [{type: 'weapon'}],
    }),
  ],
})
