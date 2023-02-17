import Link from "next/link";

export default function Relation({user}) {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-y-20 gap-x-8 px-6 lg:px-8 xl:grid-cols-3">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Meet Lens Relation</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Libero fames augue nisl porttitor nisi, quis. Id ac elit odio vitae elementum enim vitae ullamcorper
            suspendisse.
          </p>
        </div>
        <ul role="list" className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2">
          {user.map((person) => (
            <li key={person.name}>
              <Link href={`/${person?.handle}`}>
              <div className="flex items-center gap-x-6">
                <img className="h-16 w-16 rounded-full" src={person.avatarUrl || "https://picsum.photos/200"} alt="" />
                <div>
                  <h3 className="text-base font-semibold leading-7 tracking-tight text-gray-900">{person.handle}</h3>
                  <p className="text-sm font-semibold leading-6 text-gray-600 text-base-1">{person.bio}</p>
                </div>
              </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
