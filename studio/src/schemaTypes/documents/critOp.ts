import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

/**
 * Page schema.  Define and edit the fields for the 'page' content type.
 * Learn more: https://www.sanity.io/docs/schema-types
 */

export const critOp = defineType({
  name: 'critOp',
  title: 'Critical Operation',
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
      name: 'loreText',
      title: 'Lore Text',
      type: 'string',
    }),
    defineField({
      name: 'additionalRulesTxt',
      title: 'Additional Rules',
      type: 'array', 
      of: [{type: 'block'}]
    }),
    defineField({
      name: 'missionActionName',
      title: 'Mission Action Name',
      type: 'string', 
    }),
    defineField({
      name: 'missionActionApCost',
      title: 'Mission Action AP Cost',
      type: 'number', 
    }),
    defineField({
      name: 'missionActionDescriptionGreen',
      title: 'Mission Action Green Description',
      type: 'array', 
      of: [{type: 'block'}]
    }),
    defineField({
      name: 'missionActionDescriptionRed',
      title: 'Mission Action Red Description',
      type: 'array', 
      of: [{type: 'block'}]
    }),
    defineField({
      name: 'victoryPoints',
      title: 'Victory Points',
      type: 'array', 
      of: [{type: 'block'}]
    })]
})
