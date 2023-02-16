/* app/page.tsx */
'use client'

import { useEffect, useState } from 'react'
import { client, getProfileByHandle } from '../api'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Home() {
  const [profile, setProfile] = useState<any>(null)
  const router = useRouter()
  const { handle } = router.query

  useEffect(() => {
    fetchProfile()
  }, [handle])

  async function fetchProfile() {
    try {
      let response = await client.query({ query: getProfileByHandle, variables: { handle } })
      let profileData = response.data.getProfileByHandle

      if (profileData) {
        let picture = profileData.picture
        if (picture && picture.original && picture.original.url) {
          if (picture.original.url.startsWith('ipfs://')) {
            let result = picture.original.url.substring(7, picture.original.url.length)
            profileData.avatarUrl = `http://lens.infura-ipfs.io/ipfs/${result}`
          } else {
            profileData.avatarUrl = picture.original.url
          }
        }

        setProfile(profileData)
      }
    } catch (err) {
      console.log({ err })
    }
  }

  if (!profile) {
    return (
      <div className='pt-20'>
        <h1>Loading...</h1>
      </div>
    )
  }

  return (
    <div className='pt-20'>
      <div className='flex flex-col justify-center items-center'>
        <h1 className='text-5xl mb-6 font-bold'>{profile.name}'s Profile 🌿</h1>
        <div className='w-2/3 shadow-md p-6 rounded-lg mb-8 flex flex-col items-center'>
          <img className='w-48 h-48 rounded-full' src={profile.avatarUrl || 'https://picsum.photos/200'} />
          <p className='text-xl text-center mt-6'>{profile.name}</p>
          <p className='text-base text-gray-400 text-center mt-2'>{profile.bio}</p>
          <p className='text-violet-600 text-lg font-medium text-center mt-2 mb-2'>{profile.handle}</p>
          <p className='text-pink-600 text-sm font-medium text-center'>{profile.stats.totalFollowers} followers</p>
        </div>
      </div>
    </div>
  )
}
