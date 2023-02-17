import { CalendarDaysIcon, HandRaisedIcon } from '@heroicons/react/24/outline'
import { FiExternalLink } from 'react-icons/fi';
import { FaUserFriends } from 'react-icons/fa';

export default function Nav() {
  return (
    <div className="relative isolate overflow-hidden bg-white-900 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-y-16 gap-x-8 lg:max-w-none lg:grid-cols-2">
          <div className="max-w-xl lg:max-w-lg">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Claim your LensLink 🌿</h2>
            <p className="mt-4 text-lg leading-8 text-gray-300">
              Everything you are. In one, simple link in Lens.
            </p>
            <div className="mt-6 flex max-w-md gap-x-4">
              <label htmlFor="email-address" className="sr-only">
                Lens Handle 
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="min-w-0 flex-auto rounded-md border border-white/10 bg-white/5 px-[calc(theme(spacing.4)-1px)] py-[calc(theme(spacing[1.5])-1px)] text-base leading-7 text-white placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter your Lens handle"
              />
              <button
                type="submit"
                className="flex-none rounded-md bg-indigo-500 py-1.5 px-3.5 text-base font-semibold leading-7 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                LensLink
              </button>
            </div>
          </div>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
            <div className="flex flex-col items-start">
              <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                <FaUserFriends size={24} className="text-white" />
              </div>
              <dt className="mt-4 font-semibold text-white">Link Everything</dt>
              <dd className="mt-2 leading-7 text-slate-300">
                
                "Bring Your Online Presence Together: Build a Conversion-Optimized Landing Page with Your Lenster, Twitter"
              </dd>
            </div>
            <div className="flex flex-col items-start">
              <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                {/* <HandRaisedIcon className="h-6 w-6 text-white" aria-hidden="true" /> */}
                <FiExternalLink size={24} className="text-white" />
              </div>
              <dt className="mt-4 font-semibold text-white">Create LensLink</dt>
              <dd className="mt-2 leading-7 text-slate-300">
              "Create Your LensLink in Minutes - A Step-by-Step Guide  - All in One Link in LensLink."
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <svg
        className="absolute top-0 left-1/2 -z-10 h-[42.375rem] -translate-x-1/2 blur-3xl xl:-top-6"
        viewBox="0 0 1155 678"
        fill="none"
      >
        <path
          fill="url(#09dbde42-e95c-4b47-a4d6-0c523c2fca9a)"
          fillOpacity=".3"
          d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
        />
        <defs>
          <linearGradient
            id="09dbde42-e95c-4b47-a4d6-0c523c2fca9a"
            x1="1155.49"
            x2="-78.208"
            y1=".177"
            y2="474.645"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#9089FC" />
            <stop offset={1} stopColor="#FF80B5" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}