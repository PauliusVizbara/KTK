import {DocumentTextIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const gameResult = defineType({
  name: 'gameResult',
  title: 'Game Results',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({name: 'submittedAt', title: 'Submitted At', type: 'datetime'}),
    defineField({
      name: 'submittedBy',
      title: 'Submitted By',
      type: 'object',
      fields: [
        defineField({name: 'id', title: 'User ID', type: 'string'}),
        defineField({name: 'name', title: 'Display Name', type: 'string'}),
        defineField({name: 'image', title: 'Profile Image URL', type: 'url'}),
      ],
    }),
    defineField({
      name: 'teams',
      title: 'Teams Played',
      type: 'object',
      fields: [
        defineField({
          name: 'player1',
          title: 'Player 1 Team',
          type: 'object',
          fields: [defineField({name: 'name', title: 'Name', type: 'string'})],
        }),
        defineField({
          name: 'player2',
          title: 'Player 2 Team',
          type: 'object',
          fields: [defineField({name: 'name', title: 'Name', type: 'string'})],
        }),
      ],
    }),
    defineField({
      name: 'scores',
      title: 'Scores',
      type: 'object',
      fields: [
        defineField({
          name: 'player1',
          title: 'Player 1 Scores',
          type: 'object',
          fields: [
            defineField({name: 'critOp', title: 'Crit Op', type: 'number'}),
            defineField({name: 'tacOp', title: 'Tac Op', type: 'number'}),
            defineField({name: 'killOp', title: 'Kill Op', type: 'number'}),
            defineField({name: 'primaryBonus', title: 'Primary Bonus', type: 'number'}),
            defineField({name: 'total', title: 'Total', type: 'number'}),
          ],
        }),
        defineField({
          name: 'player2',
          title: 'Player 2 Scores',
          type: 'object',
          fields: [
            defineField({name: 'critOp', title: 'Crit Op', type: 'number'}),
            defineField({name: 'tacOp', title: 'Tac Op', type: 'number'}),
            defineField({name: 'killOp', title: 'Kill Op', type: 'number'}),
            defineField({name: 'primaryBonus', title: 'Primary Bonus', type: 'number'}),
            defineField({name: 'total', title: 'Total', type: 'number'}),
          ],
        }),
      ],
    }),
    defineField({
      name: 'selections',
      title: 'Op Selections',
      type: 'object',
      fields: [
        defineField({name: 'critOp', title: 'Crit Op', type: 'string'}),
        defineField({name: 'player1TacOp', title: 'Player 1 Tac Op', type: 'string'}),
        defineField({name: 'player2TacOp', title: 'Player 2 Tac Op', type: 'string'}),
        defineField({
          name: 'player1PrimaryOp',
          title: 'Player 1 Primary Op',
          type: 'string',
          options: {list: ['critical', 'tactical', 'kill']},
        }),
        defineField({
          name: 'player2PrimaryOp',
          title: 'Player 2 Primary Op',
          type: 'string',
          options: {list: ['critical', 'tactical', 'kill']},
        }),
      ],
    }),
  ],
  preview: {
    select: {
      submittedBy: 'submittedBy.name',
      player1Team: 'teams.player1.name',
      player2Team: 'teams.player2.name',
    },
    prepare(selection) {
      const {submittedBy, player1Team, player2Team} = selection
      return {
        title: `${player1Team ?? 'Player 1'} vs ${player2Team ?? 'Player 2'}`,
        subtitle: submittedBy ? `Submitted by ${submittedBy}` : 'No submission info',
      }
    },
  },
})
