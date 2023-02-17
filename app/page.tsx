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
import Loading from "./loading";
import Link from "next/link";
import { FaUsers } from "react-icons/fa";
import Nav from './nav'
import Relation from './relation'
import "./styles.css";

export default function Home() {
  const [profiles, setProfiles] = useState<any>([]);

  const [user, setUser] = useState<any>({ name: 'Login' });


  const gradients = [
    // "linear-gradient(to bottom right, #0072C6, #00BFFF)",
    "linear-gradient(to bottom right, #29323c, #485563)",
    // "linear-gradient(to bottom right, #0072ff, #00c6ff)",
    // "linear-gradient(to bottom right, #3f3f3f, #7d7d7d)"
    // "linear-gradient(to bottom right, #fa709a, #fee140)",
    // "linear-gradient(to bottom right, #fa709a, #fee140)",
    // 'linear-gradient(to bottom right, #b92b27, #1565c0)',
    // add more gradients here
  ];


  const [selectedGradient, setSelectedGradient] = useState(
    gradients[Math.floor(Math.random() * gradients.length)]
  );

  useEffect(() => {
    if (process.browser) {
      let user = window.sessionStorage.getItem("user");
      if (user) {
        user = JSON.parse(user);
        console.log(user)
        setUser(user);
      }
    }



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
    setUser(defaultProfile.data.defaultProfile.name);
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

    profiles[index].isFollowedByMe = true;
    setProfiles([...profiles]);
  }

  return (
    <div className="App" style={{ backgroundImage: selectedGradient }}>
      <header className='text-xl font-bold text-center  bg-white text-white flex justify-between items-center py-3 px-6 shadow-lg'>
        <div className='text-black'>LENSLINK</div>
        {user.name === "Login" ? (
          <button className='bg-gradient-to-r from-gray-800 to-black text-white text-sm px-4 py-2 rounded-md' onClick={login}>
            {user?.nane || 'Login'}
          </button>
        ) : (
          <Link href={`/${user?.handle}`}>
            <button className='bg-gradient-to-r from-gray-800 to-black text-white text-sm px-4 py-2 rounded-md'>
              {user.name || 'LensUser'}
            </button>
          </Link>
        )}
      </header>
      <Nav />
      <Relation user={profiles.slice(0, 6)} />
      {profiles.length > 0 ? (
        <div className="pt- max-w-screen-lg mx-auto pb-20">
        <div className="pt-20 container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {profiles.slice(0,24).map((profile, index) => (
              <div
                key={profile.id}
                className="shadow-md p-6 rounded-lg flex flex-col items-center"
                style={{ backgroundColor: "white" }}
              >
                <Link href={`/${profile.handle}`}>
                  <img
                    className="w-48 h-48 rounded-full"
                    src={profile.avatarUrl || "https://picsum.photos/200"}
                  />
                </Link>
                <Link href={`/${profile.handle}`} >
                  <p className="text-xl text-center mt-6">{profile.name}</p>
                </Link>
                <div className="h-16">
                  <p className="text-base-1 text-gray-400 text-center mt-2 overflow-hidden line-clamp-2">
                    {profile.bio}
                  </p>
                </div>
                <p className="text-pink-600 text-sm font-medium text-center mt-auto">
                  <FaUsers className="inline-block mr-2" />
                  {profile.stats.totalFollowers} followers
                </p>
                <div className="pt-5">
                  {profile.isFollowedByMe ? (
                    <p className="text-sm text-gray-400 text-center">
                      Following
                    </p>
                  ) : (
                    // 点击触发followed 并传入profile 作为参数
                    <button
                      onClick={() => followed(profile, index)}
                      className="bg-violet-600 text-white text-sm font-medium px-4 py-2 rounded-full"
                    >
                      Follow
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      ) : (
        <div className="text-center"><Loading /></div>
      )}



    </div>
  );
}
