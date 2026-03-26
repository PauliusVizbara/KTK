import { DocumentTextIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const TEAM_ARCHETYPE_OPTIONS = [
  { title: 'Infiltration', value: 'Infiltration' },
  { title: 'Recon', value: 'Recon' },
  { title: 'Seek & Destroy', value: 'Seek & Destroy' },
  { title: 'Security', value: 'Security' },
]

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
      name: 'archetypes',
      title: 'Archetypes',
      type: 'array',
      of: [
        {
          type: 'string',
          options: {
            list: TEAM_ARCHETYPE_OPTIONS,
          },
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'equipment',
      title: 'Equipment',
      type: 'array',
      of: [{ type: 'equipment' }],
    }),
  ],
})
