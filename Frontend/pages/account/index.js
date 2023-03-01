import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  CalendarIcon,
  ChartBarIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Profile from "../../components/Profile";
import DMs from "../../components/DMs";
import ManageProjects from "@/components/ManageProjects";

const navigation = [
  { name: "Overview", href: "#", icon: HomeIcon, current: true },
  { name: "DMs", href: "#", icon: UsersIcon, current: false },
  { name: "Manage Projects", href: "#", icon: UsersIcon, current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Overview");

  const selectedTabContent = () => {
    switch (selectedTab) {
      case "Overview":
        <Profile />;
        break;
      case "DMs":
        <DMs />;
        break;
      case "Manage Projects":
        <ManageProjects/>;
        break;

      default:
        <Profile />;
        break;
    }
  };

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as='div'
            className='relative z-40 lg:hidden'
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter='transition-opacity ease-linear duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='transition-opacity ease-linear duration-300'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <div className='fixed inset-0 bg-gray-600 bg-opacity-75' />
            </Transition.Child>

            <div className='fixed inset-0 z-40 flex'>
              <Transition.Child
                as={Fragment}
                enter='transition ease-in-out duration-300 transform'
                enterFrom='-translate-x-full'
                enterTo='translate-x-0'
                leave='transition ease-in-out duration-300 transform'
                leaveFrom='translate-x-0'
                leaveTo='-translate-x-full'
              >
                <Dialog.Panel className='relative flex w-full max-w-xs flex-1 flex-col bg-gray-800'>
                  <Transition.Child
                    as={Fragment}
                    enter='ease-in-out duration-300'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in-out duration-300'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                  >
                    <div className='absolute top-0 right-0 -mr-12 pt-2'>
                      <button
                        type='button'
                        className='ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className='sr-only'>Close sidebar</span>
                        <XMarkIcon
                          className='h-6 w-6 text-white'
                          aria-hidden='true'
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className='h-0 flex-1 overflow-y-auto pt-5 pb-4'>
                    <div className='flex flex-shrink-0 items-center px-4'>
                      <h2 className='text-3xl font-bold tracking-tight text-orange-400'>
                        DevMatch
                      </h2>
                    </div>
                    <nav className='mt-5 space-y-1 px-2'>
                      {navigation.map((item) => (
                        <div
                          key={item.name}
                          onClick={() => {
                            setSelectedTab(item.name);
                          }}
                          className={classNames(
                            item.name === selectedTab
                              ? "bg-gray-900 text-white"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white",
                            "group flex items-center rounded-md px-2 py-2 text-base font-medium"
                          )}
                        >
                          <item.icon
                            className={classNames(
                              item.name === selectedTab
                                ? "text-gray-300"
                                : "text-gray-400 group-hover:text-gray-300",
                              "mr-4 h-6 w-6 flex-shrink-0"
                            )}
                            aria-hidden='true'
                          />
                          {item.name}
                        </div>
                      ))}
                    </nav>
                  </div>
                  <div className='flex flex-shrink-0 bg-gray-700 p-4'>
                    <a
                      href='/feed'
                      className='group block w-full flex-shrink-0'
                    >
                      <h3 className='text-l text-white'>Back to feed</h3>
                    </a>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className='w-14 flex-shrink-0'>
                {/* Force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className='hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col'>
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className='flex min-h-0 flex-1 flex-col bg-gray-800'>
            <div className='flex flex-1 flex-col overflow-y-auto pt-5 pb-4'>
              <div className='flex flex-shrink-0 items-center px-4'>
                <h2 className='text-3xl font-bold tracking-tight text-orange-400 '>
                  DevMatch
                </h2>
              </div>
              <nav className='mt-5 flex-1 space-y-1 px-2'>
                {navigation.map((item) => (
                  <div
                    key={item.name}
                    onClick={() => {
                      setSelectedTab(item.name);
                    }}
                    className={classNames(
                      item.name == selectedTab
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "group flex items-center rounded-md px-2 py-2 text-sm font-medium"
                    )}
                  >
                    <item.icon
                      className={classNames(
                        item.name == selectedTab
                          ? "text-gray-300"
                          : "text-gray-400 group-hover:text-gray-300",
                        "mr-3 h-6 w-6 flex-shrink-0"
                      )}
                      aria-hidden='true'
                    />
                    {item.name}
                  </div>
                ))}
              </nav>
            </div>
            <div className='flex flex-shrink-0 bg-gray-700 p-4'>
              <a href='/feed' className='group block w-full flex-shrink-0'>
                <h3 className='text-l text-white'>Back to feed</h3>
              </a>
            </div>
          </div>
        </div>
        <div className='flex flex-1 flex-col lg:pl-64'>
          <div className='sticky top-0 z-10 bg-gray-100 pl-1 pt-1 sm:pl-3 sm:pt-3 lg:hidden'>
            <button
              type='button'
              className='-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'
              onClick={() => setSidebarOpen(true)}
            >
              <span className='sr-only'>Open sidebar</span>
              <Bars3Icon className='h-6 w-6' aria-hidden='true' />
            </button>
          </div>
          <main className='flex-1'>
            {selectedTab === "Overview" ? (
              <Profile />
            ) : selectedTab === "DMs" ? (
              <DMs />
            ) : selectedTab === "Manage Projects" ? (
                <ManageProjects />
            ) : (
              <></>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
