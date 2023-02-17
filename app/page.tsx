/* app/page.tsx */
'use client'

import { useEffect, useState } from 'react'
import { client, exploreProfiles } from '../api'
import Link from 'next/link'

export default function Home() {
  const [profiles, setProfiles] = useState<any>([])

  useEffect(() => {
    fetchProfiles()
  }, [])

  async function fetchProfiles() {
    try {
      let response = await client.query({ query: exploreProfiles })

      let profileData = await Promise.all(response.data.exploreProfiles.items.map(async profileInfo => {
        let profile = { ...profileInfo }
        let picture = profile.picture

        if (picture && picture.original && picture.original.url) {
          if (picture.original.url.startsWith('ipfs://')) {
            let result = picture.original.url.substring(7, picture.original.url.length)
            profile.avatarUrl = `http://lens.infura-ipfs.io/ipfs/${result}`
          } else {
            profile.avatarUrl = picture.original.url
          }
        }

        return profile
      }))

      setProfiles(profileData)
    } catch (err) {
      console.log({ err })
    }
  }

  return (
    <div className='pt-20 max-w-screen-md mx-auto'>
      <div className='pt-20 container mx-auto'>
        <div className='flex flex-wrap justify-center'>
          {profiles.map((profile, index) => (
            <div key={profile.id} className={`w-full md:w-1/2 shadow-md p-6 rounded-lg mb-8 flex flex-col items-center ${index % 2 === 0 ? "md:pr-4" : "md:pl-4"}`}>
              <img className='w-48 h-48 rounded-full' src={profile.avatarUrl || 'https://picsum.photos/200'} />
              <p className='text-xl text-center mt-6'>{profile.name}</p>
              <p className='text-base text-gray-400 text-center mt-2'>{profile.bio}</p>

              <Link href={`/${profile.handle}`}>
                <p className='cursor-pointer text-violet-600 text-lg font-medium text-center mt-2 mb-2'>{profile.handle}</p>
              </Link>

              <p className='text-pink-600 text-sm font-medium text-center'>{profile.stats.totalFollowers} followers</p>
            </div>
          ))}
        </div>
      </div>

    </div>

  )
}
