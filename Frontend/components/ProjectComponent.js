import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { EnvelopeIcon } from "@heroicons/react/20/solid";
import { UserGroupIcon } from "@heroicons/react/24/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const default_project = {
  name: "The project",
  owners: ["1029292"],
  members: ["1212121", "423432423243", "42343243423"],
  skills: ["JavaScript", "HTML"],
  avatar: "https://logopond.com/avatar/257420/logopond.png",
  profile_picture:
    "https://i.pinimg.com/474x/97/aa/84/97aa847d061a14894178805f1d551500.jpg",
  banner_picture:
    "https://t4.ftcdn.net/jpg/04/95/28/65/360_F_495286577_rpsT2Shmr6g81hOhGXALhxWOfx1vOQBa.jpg",
};

export default function ProjComponent(props) {
  const { project = default_project, ...restProps } = props;
  return (
    <div className='bg-grey rounded-lg'>
      <h1>
        <img
          className='h-18 w-full object-cover lg:h-24 rounded-t-lg'
          src={project.banner_picture}
          alt=''
        />
      </h1>
      <div className='bg-white px-4 py-5 sm:py-6 rounded-lg'>
        <div className='flex space-x-3'>
          <div className='flex-shrink-0'>
            <img
              className='h-10 w-10 rounded-full'
              src={project.profile_picture}
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
                Owner: {project.owners[0]}
              </a>
            </p>
            <div className='text-sm text-gray-500'>
              <a href='#' className='hover:underline'>
                Skills Needed:{" "}
                {project.skills.map((e, i) => (
                  <p key={i}>{e + " "}</p>
                ))}
              </a>
            </div>
            <div className='text-sm text-gray-500'>
              <a href='#' className='hover:underline'>
                Other members:{" "}
                {project.members.map((e, i) => (
                  <p key={i}>{e + " "}</p>
                ))}
              </a>
            </div>
          </div>
          <div className='flex flex-shrink-0 self-center'>
            <button
              type='button'
              className='inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
            >
              Join
              <UserGroupIcon
                className='ml-2 -mr-1 h-5 w-5'
                aria-hidden='true'
              />
            </button>
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
    </div>
  );
}
