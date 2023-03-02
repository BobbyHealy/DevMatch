import { Fragment } from "react";
import { Menu, Popover, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import UserComponent from "@/components/UserComponent";
import ProjComponent from "@/components/ProjectComponent";
import Router from "next/router";
import ProjectDashBoard from "@/components/projectDashBoard";
import Header from "@/components/header";
import { projectExamplesArray } from "@/mockup_data/project_array";
import { userExampleArray } from "@/mockup_data/user_array";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Feed() {
  return (
    <div className='min-h-screen bg-gray-100'>
      <div className='sticky top-0 z-30'>
        <Header />
      </div>

      <div className='py-6'>
        <div className='mx-auto max-w-3xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-8 lg:px-8'>
          <div className='hidden lg:col-span-3 lg:block xl:col-span-2'>
            <nav
              aria-label='Sidebar'
              className='sticky top-6 divide-y divide-gray-300'
            >
              {/* Left */}
            </nav>
          </div>
          <main className='lg:col-span-9 xl:col-span-6'>
            {/* Update this to use API + map to generate a bunch of enties of either User or Project components */}
            {/* ProjComponent on feed example */}
            {projectExamplesArray.map((e, i) => {
              return (
                <div key={e.toString() + i} className='pb-6'>
                  <ProjComponent project={e} />
                </div>
              );
            })}
            {/* UserComponent on feed example */}
            {userExampleArray.map((e, i) => {
              return (
                <div key={e.toString() + i} className='pb-6'>
                  <UserComponent user={e} />
                </div>
              );
            })}
          </main>
          <aside className='hidden xl:col-span-4 xl:block'>
            <div className='sticky top-6 space-y-4 h-full'>
              {/* Right */}
              <div className='sticky top-24 z-30'>
                <ProjectDashBoard />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
