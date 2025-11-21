import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

/**
 * Page schema.  Define and edit the fields for the 'page' content type.
 * Learn more: https://www.sanity.io/docs/schema-types
 */

export const critOp = defineType({
  name: 'critOp',
  title: 'Crit Ops',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'additionalRulesText',
      title: 'Additional Rules',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'missionActions',
      title: 'Mission Actions',
      type: 'array',
      of: [{type: 'action'}],
    }),
    defineField({
      name: 'victoryPoints',
      title: 'Victory Points',
      type: 'array',
      of: [{type: 'block'}],
      validation: (Rule) => Rule.required(),
    }),
  ],
})
