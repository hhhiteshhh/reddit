import React from 'react'
import Image from 'next/image'
import {
  HomeIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
} from '@heroicons/react/24/solid'
import {
  BellIcon,
  ChatBubbleBottomCenterIcon,
  GlobeAltIcon,
  PlusIcon,
  SparklesIcon,
  SpeakerWaveIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline'
import { signIn, useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
function Header() {
  const { data: session } = useSession()
  return (
    <div className="flex items-center bg-white px-4 py-2 shadow-sm sticky top-0 z-50">
      <div className="relative h-10 w-20 flex-shrink-0 cursor-pointer">
        <Link href="/">
          <Image
            src="https://links.papareact.com/fqy"
            layout="fill"
            objectFit="contain"
          />
        </Link>
      </div>
      <div className="flex items-center mx-7 xl:min-w-[300px]">
        <HomeIcon className="h-5 w-5" />
        <p className="hidden flex-1 ml-2 lg:inline-flex">Home</p>
        <ChevronDownIcon className="h-5 w-5" />
      </div>

      <form className="flex flex-1 items-center space-x-2 rounded-sm border border-gray-200 bg-gray-100 px-3 py-1">
        <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
        <input
          type="text"
          placeholder="Search Reddit"
          className="outline-none flex-1 bg-transparent"
        />
        <button type="submit" hidden />
      </form>
      <div className=" text-gray-500 space-x-2 items-center mx-5 hidden lg:inline-flex">
        <SparklesIcon className="icon" />
        <GlobeAltIcon className="icon" />
        <VideoCameraIcon className="icon" />
        <hr className="h-10 border-gray-100" />
        <ChatBubbleBottomCenterIcon className="icon" />
        <BellIcon className="icon" />
        <PlusIcon className="icon" />
        <SpeakerWaveIcon className="icon" />
      </div>
      <div className=" ml-5 flex items-center lg:hidden">
        <Bars3Icon className="icon" />
      </div>

      {session ? (
        <div
          onClick={() => signOut()}
          className="hidden lg:flex items-center space-x-2 border border-gray-100 p-2 cursor-pointer"
        >
          <div className="relative h-5 w-5 flex-shrink-0">
            <Image src="https://links.papareact.com/23l" layout="fill" />
          </div>
          <div className="flex-1 text-xs">
            <p className="truncate">{session?.user?.name}</p>
            <p className="text-gray-400">Sign Out</p>
          </div>
          <ChevronDownIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
        </div>
      ) : (
        <div
          onClick={() => signIn()}
          className="hidden lg:flex items-center space-x-2 border border-gray-100 p-2 cursor-pointer"
        >
          <div className="relative h-5 w-5 flex-shrink-0">
            <Image src="https://links.papareact.com/23l" layout="fill" />
          </div>
          <p className="text-gray-400">Sign In</p>
        </div>
      )}
    </div>
  )
}

export default Header
