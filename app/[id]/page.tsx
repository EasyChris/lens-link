/* app/profile/[id]/page.tsx */
'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation';
import { client, getPublications, getProfile } from '../../api'
import Avatar from './avatar';
import { FaGithub, FaTwitter, FaBlog } from "react-icons/fa";
import { FcApproval, } from "react-icons/fc";
import { IoMdPeople } from "react-icons/io"
import { AiOutlineUsergroupAdd, AiOutlineFileText, AiOutlineComment } from 'react-icons/ai'

export default function Profile() {
  /* create initial state to hold user profile and array of publications */
  const [profile, setProfile] = useState<any>()
  const [publications, setPublications] = useState<any>([])
  /* using the router we can get the lens handle from the route path */
  const pathName = usePathname()
  const handle = pathName?.split('/')[1]
  console.log('handle', handle)

  useEffect(() => {
    if (handle) {
      fetchProfile()
    }
  }, [handle])

  async function fetchProfile() {
    try {
      /* fetch the user profile using their handle */
      const returnedProfile = await client.query({
        query: getProfile,
        variables: { handle }
      })
      const profileData = { ...returnedProfile.data.profile }
      /* format their picture if it is not in the right format */
      const picture = profileData.picture
      if (picture && picture.original && picture.original.url) {
        if (picture.original.url.startsWith('ipfs://')) {
          let result = picture.original.url.substring(7, picture.original.url.length)
          profileData.avatarUrl = `http://lens.infura-ipfs.io/ipfs/${result}`
        } else {
          profileData.avatarUrl = profileData.picture.original.url
        }
      }
      const coverPicture = profileData.coverPicture
      if (coverPicture && coverPicture.original && coverPicture.original.url) {
        if (coverPicture.original.url.startsWith('ipfs://')) {
          let result = coverPicture.original.url.substring(7, coverPicture.original.url.length)
          profileData.coverPictureUrl = `http://lens.infura-ipfs.io/ipfs/${result}`
        } else {
          profileData.coverPictureUrl = profileData.coverPicture.original.url
        }
      }

      const stats = profileData.stats
      if (stats) {
        profileData.followers = stats.totalFollowers
        profileData.following = stats.totalFollowing
        profileData.posts = stats.totalPosts
        profileData.comments = stats.totalComments
      }


      setProfile(profileData)
      /* fetch the user's publications from the Lens API and set them in the state */
      const pubs = await client.query({
        query: getPublications,
        variables: {
          id: profileData.id, limit: 50
        }
      })
      setPublications(pubs.data.publications.items)
    } catch (err) {
      console.log('error fetching profile...', err)
    }
  }

  if (!profile) return null
  console.log(profile.coverPictureUrl)
  return (
    <div className="App" style={{ backgroundImage: `url(${profile.coverPictureUrl})` }}>
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 mr-4">
              <img
                src={profile.avatarUrl}
                alt="Profile"
                className="w-full h-full rounded-full"
              />
            </div>
            <div>
              <div className="flex items-center">
                <div className="font-bold text-lg">{profile.handle}</div>
                <FcApproval size={24} className="ml-2" />
              </div>
              <div className="text-gray-500">THE LENSLINK</div>
            </div>
          </div>
          <div className="mb-4 flex justify-center">
            <div className="mr-4 flex items-center justify-center" style={{ width: '50%' }}>
              <AiOutlineUsergroupAdd size={24} className="text-blue-500 mr-2" style={{ color: '#214f28' }} />
              <span className="text-gray-500">{profile.following}</span>
            </div>
            <div className="mr-4 flex items-center justify-center" style={{ width: '50%' }}>
              <IoMdPeople size={24} className="text-blue-500 mr-2" style={{ color: '#214f28' }} />
              <span className="text-gray-500">{profile.followers}</span>
            </div>
          </div>
          <div className="mb-4 flex justify-center">
            <div className="mr-4 flex items-center justify-center" style={{ width: '50%' }}>
              <AiOutlineFileText size={24} className="text-blue-500 mr-2" style={{ color: '#214f28' }} />
              <span className="text-gray-500">{profile.posts}</span>
            </div>
            <div className="mr-4 flex items-center justify-center" style={{ width: '50%' }}>
              <AiOutlineComment size={24} className="text-blue-500 mr-2" style={{ color: '#214f28' }} />
              <span className="text-gray-500">{profile.comments}</span>
            </div>
          </div>

          <div className='mb-6' style={{ borderLeft: '5px solid #214f28', paddingLeft: '10px' }}>
            {profile.bio}
          </div>
          <div className="mb-6">
            <a
              href="https://github.com/Easychris"
              target="_blank"
              rel="noreferrer"
              className="flex items-center mb-4"
            >
              <div className="w-8 h-8 mr-4">
                <FaGithub size={24} className="text-gray-500" />
              </div>
              <div className="font-medium">github</div>
            </a>
            <a
              href="https://twitter.com/Easyplux"
              target="_blank"
              rel="noreferrer"
              className="flex items-center mb-4"
            >
              <div className="w-8 h-8 mr-4">
                <FaTwitter size={24} className="text-gray-500" />
              </div>
              <div className="font-medium">twitter</div>
            </a>
            <a
              href="https://afox.cc"
              target="_blank"
              rel="noreferrer"
              className="flex items-center mb-4"
            >
              <div className="w-8 h-8 mr-4">
                <FaBlog size={24} className="text-gray-500" />
              </div>
              <div className="font-medium">blog</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}