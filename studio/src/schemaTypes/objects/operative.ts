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
      name: 'wounds',
      title: 'Wounds',
      type: 'number',
    }),
  ],
})
