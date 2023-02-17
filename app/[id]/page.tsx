/* app/profile/[id]/page.tsx */
'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation';
import { client, getPublications, getProfile } from '../../api'
import Avatar from './avatar';
import { FaGithub, FaTwitter, FaBlog } from "react-icons/fa";
import { RiCameraLensFill } from 'react-icons/ri'
import { FcApproval, } from "react-icons/fc";
import { IoMdPeople } from "react-icons/io"
import { AiOutlineUsergroupAdd, AiOutlineFileText, AiOutlineComment } from 'react-icons/ai'
import './styles.css';

const gradients = [
  'linear-gradient(to bottom right, #8E2DE2, #4A00E0)',
  'linear-gradient(to bottom right, #fa709a, #fee140)',
  'linear-gradient(to bottom right, #4b6cb7, #182848)',
  'linear-gradient(to bottom right, #b92b27, #1565c0)',
  // add more gradients here
];



export default function Profile() {
  /* create initial state to hold user profile and array of publications */
  const [profile, setProfile] = useState<any>()
  const [publications, setPublications] = useState<any>([])
  /* using the router we can get the lens handle from the route path */
  const pathName = usePathname()
  const handle = pathName?.split('/')[1]
  const [selectedGradient, setSelectedGradient] = useState(gradients[Math.floor(Math.random() * gradients.length)]);


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
      let showKeys = [
        {
          name: 'app',
          app: 'Lenster',
          link: 'https://lenster.xyz/u/',
          icon: 'RiCameraLensFill',
        },
        {
          name: 'twitter',
          app: 'Twitter',
          link: 'https://twitter.com/',
          icon: 'FaTwitter',
        },
        {
          name: 'website',
          app: 'Website',
          link: '',
          icon: 'FaBlog',
        }
      ]
      const metaUrl = profileData.metadata
      // axios call to get the metadata
      if (metaUrl) {
        const response = await fetch(metaUrl)
        const data = await response.json()
        console.log(data)
        let attributes: any = data.attributes
        //get all attributes  filter value is [] or ''
        let attributesFilter = attributes.filter((attribute: any) => attribute.value !== '' && attribute.value !== '[]')
        // filter out the keys that are not in the showKeys if in the showKeys then add the link
        let attributesFilterL2 = attributesFilter.map((attribute: any) => {
          let key = attribute.key
          let value = attribute.value
          let showKey = showKeys.find((showKey: any) => showKey.name === key)
          if (showKey) {
            attribute.link = `${showKey.link}${value}`
            if (attribute.key === 'app') {
              attribute.link = `${showKey.link}${handle}`
            }
            attribute.icon = showKey.icon
          }
          return attribute
        })
        // filter attributesFilterL2 if icon key is not exist
        let attributesFilterL3 = attributesFilterL2.filter((attribute: any) => attribute.icon)
        profileData.attributes = attributesFilterL3
      }

      console.log(profileData.attributes)



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
  return (
    <div className="App" style={{ backgroundImage: selectedGradient }}>
      <div className="gradients-selector">
        <div className="gradient-1" onClick={() => setSelectedGradient('linear-gradient(to bottom right, #8E2DE2, #4A00E0)')}></div>
        <div className="gradient-2" onClick={() => setSelectedGradient('linear-gradient(to bottom right, #fa709a, #fee140)')}></div>
        <div className="gradient-3" onClick={() => setSelectedGradient('linear-gradient(to bottom right, #2c3e50, #bdc3c7)')}></div>
      </div>

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
            {profile.attributes.map((attribute, index) => (
              <a
                key={index}
                href={attribute.link}
                target="_blank"
                rel="noreferrer"
                className="flex items-center mb-4"
              >
                <div className="w-8 h-8 mr-4 flex items-center justify-center">
                  {attribute.icon === "RiCameraLensFill" && <RiCameraLensFill size={24} className="text-gray-500" />}
                  {attribute.icon === "FaTwitter" && <FaTwitter size={24} className="text-gray-500" />}
                  {attribute.icon === "FaBlog" && <FaBlog size={24} className="text-gray-500" />}
                </div>
                <div className="font-medium">{attribute.value}</div>
              </a>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}