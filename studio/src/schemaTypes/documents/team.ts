import {DocumentTextIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Post schema.  Define and edit the fields for the 'post' content type.
 * Learn more: https://www.sanity.io/docs/schema-types
 */

export const team = defineType({
  name: 'team',
  title: 'Team',
  icon: DocumentTextIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Team Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'operativeCount',
      title: 'Operative Count',
      type: 'number',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'equipment',
      title: 'Equipment',
      type: 'array',
      of: [{type: 'equipment'}],
    }),
  ],
})
