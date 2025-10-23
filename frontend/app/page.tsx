import {settingsQuery} from '@/sanity/queries'
import {sanityFetch} from '@/sanity/live'
import {BeakerIcon} from '@heroicons/react/24/solid'
export default async function Page() {
  const {data: settings} = await sanityFetch({
    query: settingsQuery,
  })

  return (
    <div>
      <BeakerIcon className="w-4 h-4 text-blue-500" />
      <p>Hello world</p>
    </div>
  )
}
