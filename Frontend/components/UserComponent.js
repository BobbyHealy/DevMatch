import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { EnvelopeIcon } from "@heroicons/react/20/solid";
import {
  CodeBracketIcon,
  EllipsisVerticalIcon,
  FlagIcon,
  StarIcon,
} from "@heroicons/react/20/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function UserComponent() {
  return (
    <div className='bg-white px-4 py-5 sm:px-6 rounded-lg'>
      <div className='flex space-x-3'>
        <div className='flex-shrink-0'>
          <img
            className='h-10 w-10 rounded-full'
            src='https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
            alt=''
          />
        </div>
        <div className='min-w-0 flex-1'>
          <p className='text-sm font-semibold text-gray-900'>
            <a href='#' className='hover:underline'>
              User Name
            </a>
          </p>
          <p className='text-sm text-gray-500'>
            <a href='#' className='hover:underline'>
              Rating: 4
            </a>
          </p>
          <p className='text-sm text-gray-500'>
            <a href='#' className='hover:underline'>
              Skill List: JavaScript, CSS, HTML
            </a>
          </p>
          <p className='text-sm text-gray-500'>
            <a href='#' className='hover:underline'>
              Other Projects: 1, 2, 3
            </a>
          </p>
        </div>
        <div className='flex flex-shrink-0 self-center'>
          <button
            type='button'
            className='inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
          >
            Message
            <EnvelopeIcon className='ml-2 -mr-1 h-5 w-5' aria-hidden='true' />
          </button>
        </div>
      </div>
    </div>
  );
}
