import {createClient} from 'next-sanity'

import {apiVersion, dataset, projectId, studioUrl} from '@/sanity/api'
import {token} from './token'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  token, // Required if you have a private dataset
  stega: {
    studioUrl,
    // Set logger to 'console' for more verbose logging
    // logger: console,
    filter: (props) => {
      if (props.sourcePath.at(-1) === 'title') {
        return true
      }

      return props.filterDefault(props)
    },
  },
})

export const serverClient = createClient({
  projectId,
  dataset,
  apiVersion,
  perspective: 'published',
  token:
    'sk3UCitWEH7rqceEVWeMQSGBYNJ05ORVvfePuFr8Ve5ZHzfCOGnZ2HuK9y5jrSo5QohYKypxm1vH9ljHBhOEUt5fA9iO0wrYCaGQNfs6chQCknSK1UlKW9i7HmiQ5XimArZnvt7pKsvauAE6Xn1b2RC4sZRMO3fVdXMx0uPXUk0OoNQLXN42', // Required if you have a private dataset
})
