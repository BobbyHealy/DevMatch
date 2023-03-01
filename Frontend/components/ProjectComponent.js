import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { EnvelopeIcon } from "@heroicons/react/20/solid";
import { UserGroupIcon } from "@heroicons/react/24/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const project = {
    name: 'DevMatch',
    owner: 'John Doe',
    avatar:'https://logopond.com/avatar/257420/logopond.png',
    banner:'https://cdn.pixabay.com/photo/2015/11/19/08/52/banner-1050629__340.jpg',
    banner2:'https://w0.peakpx.com/wallpaper/630/104/HD-wallpaper-vector-sunset-orange-sun-sunset-painted-sunset-vector-landscape-seascape.jpg',
}

export default function ProjComponent() {
  return (
    <div className='bg-grey rounded-lg'>
      <h1>
        <img
          className='h-18 w-full object-cover lg:h-24 rounded-t-lg'
          src={project.banner2}
          alt=''
        />
      </h1>
      <div className="bg-white px-4 py-5 sm:py-6 rounded-lg">
        <div className='flex space-x-3'>
            <div className='flex-shrink-0'>
              <img
                  className='h-10 w-10 rounded-full'
                  src={project.avatar}
                  alt=''
              />
            </div>
            <div className='min-w-0 flex-1'>
              <p className='text-sm font-semibold text-gray-900'>
                  <a href='#' className='hover:underline'>
                  {project.name}
                  </a>
              </p>
              <p className='text-sm text-gray-500'>
                  <a href='#' className='hover:underline'>
                  Owner: {project.owner}
                  </a>
              </p>
              <p className='text-sm text-gray-500'>
                  <a href='#' className='hover:underline'>
                  Skills Needed: React, Javascript, 
                  </a>
              </p>
              <p className='text-sm text-gray-500'>
                  <a href='#' className='hover:underline'>
                  Other members: User1, User2, User3
                  </a>
              </p>
            </div>
            <div className='flex flex-shrink-0 self-center'>
              <button
                type='button'
                className='inline-flex items-center rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
                Join
                <UserGroupIcon className='ml-2 -mr-1 h-5 w-5' aria-hidden='true' />
              </button>
            </div>
            <div className='flex flex-shrink-0 self-center'>
              <button
                  type='button'
                  className='inline-flex items-center rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
                  Message
                  <EnvelopeIcon className='ml-2 -mr-1 h-5 w-5' aria-hidden='true' />
              </button>
              
            </div>
        </div>
      </div>
    </div>
  );
}