import {useLiveMode} from '@sanity/react-loader'
import {useMemo} from 'react'

import {getClient} from '~/sanity/client'
import {STUDIO_BASEPATH} from '~/sanity/constants'

export function SanityLiveMode() {
  // Create the live client inside the component to ensure lazy initialization works
  const liveClient = useMemo(
    () =>
      getClient().withConfig({
        stega: {
          enabled: true,
          studioUrl: STUDIO_BASEPATH,
        },
      }),
    [],
  )

  useLiveMode({client: liveClient})

  return null
}
