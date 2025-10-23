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
      name: 'name',
      title: 'Weapon Name',
      type: 'string',
    }),
    defineField({
      name: 'atk',
      title: 'ATK',
      type: 'number',
    }),
    defineField({
      name: 'hit',
      title: 'HIT',
      type: 'number',
    }),
    defineField({
      name: 'dmg_normal',
      title: 'Normal Damage',
      type: 'number',
    }),
    defineField({
      name: 'dmg_critical',
      title: 'Critical Damage',
      type: 'number',
    }),
    defineField({
      name: 'severe',
      title: 'Severe',
      type: 'boolean',
    }),
    defineField({
      name: 'range',
      title: 'Range',
      type: 'number',
    }),
    defineField({
      name: 'rending',
      title: 'Rending',
      type: 'boolean',
    }),
  ],
  preview: {
    select: {
      name: 'name',
      type: 'type',
      atk: 'atk',
      hit: 'hit',
      dmg_normal: 'dmg_normal',
      dmg_critical: 'dmg_critical',
    },
    prepare(selection) {
      const {name, type, atk, hit, dmg_normal, dmg_critical} = selection
      return {
        title: `${type === 'ranged' ? '🔫' : '⚔️'} ${name} ${atk} ${hit} ${dmg_normal}/${dmg_critical}`,
      }
    },
  },
})
