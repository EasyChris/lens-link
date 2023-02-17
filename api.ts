import { ApolloClient, InMemoryCache, gql, ApolloLink, from, HttpLink } from '@apollo/client'

const API_URL = 'https://api.lens.dev'
// const API_URL = 'https://api-mumbai.lens.dev'
const authLink = new ApolloLink((operation, forward) => {
  // Use the setContext method to set the HTTP headers.
  let token: any = window.sessionStorage.getItem('token');
  if (token) {
    token = JSON.parse(token)
    console.log(token)

  }
  operation.setContext({
    headers: {
      'x-access-token': token ? `Bearer ${token.accessToken}` : '',
      'origin': 'https://lenster.xyz',
      'referer': 'https://lenster.xyz/',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'
    },
  });

  // Call the next link in the middleware chain.
  return forward(operation);
});
/* create the API client */
export const client = new ApolloClient({
  link: from([authLink, new HttpLink({ uri: API_URL })]),

  cache: new InMemoryCache()
})


const types = [
  "CREATED_ON",
  "MOST_FOLLOWERS",
  "LATEST_CREATED",
  "MOST_POSTS",
  "MOST_COMMENTS",
  "MOST_MIRRORS",
  "MOST_PUBLICATION",
  "MOST_COLLECTS",
];

let randomType:any = types[Math.floor(Math.random() * types.length)];

/* define a GraphQL query  */
export const exploreProfiles = gql`
query ExploreProfiles {
  exploreProfiles(request: { sortCriteria: ${randomType} }) {
    items {
      id
      name
      bio
      isDefault
      attributes {
        displayType
        traitType
        key
        value
      }
      followNftAddress
      isFollowedByMe
      isFollowing
      metadata
      handle
      picture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          chainId
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
      }
      coverPicture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          chainId
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
      }
      ownedBy
      dispatcher {
        address
        canUseRelay
      }
      stats {
        totalFollowers
        totalFollowing
        totalPosts
        totalComments
        totalMirrors
        totalPublications
        totalCollects
      }
      followModule {
        ... on FeeFollowModuleSettings {
          type
          contractAddress
          amount {
            asset {
              name
              symbol
              decimals
              address
            }
            value
          }
          recipient
        }
        ... on ProfileFollowModuleSettings {
        type
        }
        ... on RevertFollowModuleSettings {
        type
        }
      }
    }
    pageInfo {
      prev
      next
      totalCount
    }
  }
}

`

// export const getProfile = gql`
// query Profile($handle: Handle!) {
//   profile(request: { handle: $handle }) {
//     id
//     name
//     bio
//     picture {
//       ... on MediaSet {
//         original {
//           url
//         }
//       }
//     }
//     handle
//   }
// }
// `


export const getProfile = gql`
query Profile($handle: Handle!) {
  profile(request: { handle: $handle }) {
    id
    name
    bio
    metadata
    handle
    coverPicture {
      ... on MediaSet{
        original{
          url
        }
      }
    }
    picture {
      ... on MediaSet {
        original {
          url
        }
      }
    }
    handle
    stats{
      id
      totalFollowers
      totalFollowing
      totalPosts
      totalComments
    }
  }
}
`


export const getPublications = gql`
  query Publications($id: ProfileId!, $limit: LimitScalar) {
    publications(request: {
      profileId: $id,
      publicationTypes: [POST],
      limit: $limit
    }) {
      items {
        __typename 
        ... on Post {
          ...PostFields
        }
      }
    }
  }
  fragment PostFields on Post {
    id
    metadata {
      ...MetadataOutputFields
    }
  }
  fragment MetadataOutputFields on MetadataOutput {
    content
  }
`
export const generateChallenge = gql`
query Challenge($request: ChallengeRequest!) {
  challenge(request: $request) {
    text
  }
}`
export const getToken = gql`mutation authenticate($request: SignedAuthChallenge!) {
  authenticate(request: $request) {
    accessToken
    refreshToken
  }
}`
export const getDefaultProfile = gql`query DefaultProfile($address: EthereumAddress!) {
  defaultProfile(request: { ethereumAddress: $address}) {
    id
    name
    bio
    isDefault
    attributes {
      displayType
      traitType
      key
      value
    }
    followNftAddress
    metadata
    handle
    picture {
      ... on NftImage {
        contractAddress
        tokenId
        uri
        chainId
        verified
      }
      ... on MediaSet {
        original {
          url
          mimeType
        }
      }
    }
    coverPicture {
      ... on NftImage {
        contractAddress
        tokenId
        uri
        chainId
        verified
      }
      ... on MediaSet {
        original {
          url
          mimeType
        }
      }
    }
    ownedBy
    dispatcher {
      address
      canUseRelay
    }
    stats {
      totalFollowers
      totalFollowing
      totalPosts
      totalComments
      totalMirrors
      totalPublications
      totalCollects
    }
    followModule {
      ... on FeeFollowModuleSettings {
        type
        contractAddress
        amount {
          asset {
            name
            symbol
            decimals
            address
          }
          value
        }
        recipient
      }
      ... on ProfileFollowModuleSettings {
       type
      }
      ... on RevertFollowModuleSettings {
       type
      }
    }
  }
}`
export const follow = gql`mutation ProxyAction($request: ProxyActionRequest!) {\n  proxyAction(request: $request)\n}`