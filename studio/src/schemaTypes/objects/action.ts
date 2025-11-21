import {defineField, defineType} from 'sanity'

export const action = defineType({
  name: 'action',
  title: 'Action',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'apCost',
      title: 'AP Cost',
      type: 'number',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'section',
          title: 'Section',
          fields: [
            {
              name: 'content',
              title: 'Content',
              type: 'array',
              of: [{type: 'block'}],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'limitations',
      title: 'Limitations',
      type: 'array',
      of: [{type: 'block'}],
    }),
  ],
  preview: {
    select: {
      name: 'name',
      ap: 'apCost',
    },
    prepare(selection) {
      const {name, ap} = selection
      return {
        title: `${name} (${ap} AP)`,
      }
    },
  },
})
