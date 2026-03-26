import { defineField, defineType } from 'sanity'
import { DocumentIcon } from '@sanity/icons'
import { TEAM_ARCHETYPE_OPTIONS } from './team'

export const tacOp = defineType({
  name: 'tacOp',
  title: 'Tac Ops',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'archetype',
      title: 'Archetype',
      type: 'string',
      options: {
        list: TEAM_ARCHETYPE_OPTIONS,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'reveal',
      title: 'Reveal',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'additionalRules',
      title: 'Additional Rules',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'missionAction',
      title: 'Mission Action',
      type: 'action',
    }),
    defineField({
      name: 'victoryPoints',
      title: 'Victory Points',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      name: 'name',
      archetype: 'archetype',
    },
    prepare(selection) {
      const { name, archetype } = selection
      return {
        title: `(${archetype}) ${name}`,
      }
    },
  },
})