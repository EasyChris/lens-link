/* app/page.tsx */
'use client'

import { useEffect, useState } from 'react'
import { client, exploreProfiles } from '../api'
import Link from 'next/link'
import { FaUsers } from 'react-icons/fa';
import './styles.css';

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
      <header className='text-3xl font-bold text-center mb-10'>LINK MORE LENSER</header>
      <div className='pt-20 container mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {profiles.map((profile, index) => (
            <Link href={`/${profile.handle}`}>
              <div key={profile.id} className='shadow-md p-6 rounded-lg flex flex-col items-center'>
                <img className='w-48 h-48 rounded-full' src={profile.avatarUrl || 'https://picsum.photos/200'} />
                <p className='text-xl text-center mt-6'>{profile.name}</p>
                <div className='h-16'>
                  <p className='text-base text-gray-400 text-center mt-2 overflow-hidden line-clamp-2'>{profile.bio}</p>
                </div>
                <p className='text-pink-600 text-sm font-medium text-center mt-auto'>
                  <FaUsers className="inline-block mr-2" />
                  {profile.stats.totalFollowers} followers
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>


  )
}
