/* app/page.tsx */
"use client";

import { useEffect, useState } from "react";
import {
  client,
  exploreProfiles,
  generateChallenge,
  getToken,
  getDefaultProfile,
  follow,
} from "../api";
import Link from "next/link";
import { FaUsers } from 'react-icons/fa';
import './styles.css';

export default function Home() {
  const [profiles, setProfiles] = useState<any>([]);

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function fetchProfiles() {
    try {
      let response = await client.query({ query: exploreProfiles });

      let profileData = await Promise.all(
        response.data.exploreProfiles.items.map(async (profileInfo) => {
          let profile = { ...profileInfo };
          let picture = profile.picture;

          if (picture && picture.original && picture.original.url) {
            if (picture.original.url.startsWith("ipfs://")) {
              let result = picture.original.url.substring(
                7,
                picture.original.url.length
              );
              profile.avatarUrl = `http://lens.infura-ipfs.io/ipfs/${result}`;
            } else {
              profile.avatarUrl = picture.original.url;
            }
          }

          return profile;
        })
      );

      setProfiles(profileData);
    } catch (err) {
      console.log({ err });
    }
  }
  async function login() {
    let w = window as any;
    if (typeof w.ethereum == "undefined") {
      console.log("MetaMask is installed!");
      return;
    }
    const accounts = await w.ethereum.request({
      method: "eth_requestAccounts",
    });
    const address = accounts[0];

    let response = await client.query({
      query: generateChallenge,
      variables: {
        request: {
          address,
        },
      },
    });
    // 调用MetaMask签名
    const signature = await w.ethereum.request({
      method: "personal_sign",
      params: [response.data.challenge.text, address],
    });
    // apollo 通过签名和地址获取token
    const result = await client.mutate({
      mutation: getToken,
      variables: {
        request: {
          address,
          signature,
        },
      },
    });
    window.sessionStorage.setItem(
      "token",
      JSON.stringify(result.data.authenticate)
    );
    //
    const defaultProfile = await client.query({
      query: getDefaultProfile,
      variables: {
        address,
      },
    });
    window.sessionStorage.setItem(
      "user",
      JSON.stringify(defaultProfile.data.defaultProfile)
    );
  }
  async function followed(profile: any, index: number) {
    console.log("followed");
    let user: any = window.sessionStorage.getItem("user");
    //如果为空 提示登录 否则 parse成对象
    if (!user) {
      alert("请先登录");
      return;
    }
    console.log(profile);
    await client.mutate({
      mutation: follow,
      variables: {
        request: {
          follow: {
            freeFollow: {
              profileId: profile.id,
            },
          },
        },
      },
    });
    // 更新profiles 

    useEffect(() => {
    profiles[index].isFollowedByMe = true;
    setProfiles([...profiles]);
    }, []);
    
  }

  return (
    <div className='pt-20 max-w-screen-md mx-auto'>
      <button onClick={login}>登录</button>

      <header className='text-3xl font-bold text-center mb-10'>LINK MORE LENSER</header>
      <div className='pt-20 container mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {profiles.map((profile, index) => (
            <Link href={`/${profile.handle}`} key={profile.id}>
              <div key={profile.id} className='shadow-md p-6 rounded-lg flex flex-col items-center'>
                {/* 如果isFollow为false显示关注按钮 */}
              {profile.isFollowedByMe ? (
                <p className="text-sm text-gray-400 text-center">Following</p>
              ) : (
                // 点击触发followed 并传入profile 作为参数
                <button
                  onClick={() => followed(profile, index)}
                  className="bg-violet-600 text-white text-sm font-medium px-4 py-2 rounded-full"
                >
                  Follow
                </button>
              )}
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
