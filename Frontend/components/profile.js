import React, { Component, useState } from "react";
import Router from "next/router";
import { EnvelopeIcon } from "@heroicons/react/20/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Profile() {
  const [skills, setSkills] = useState(["TestSkill", "TesSkill2"]);
  const [projects, setProject] = useState(["Project", "Project2"]);
  const skillList = skills.map((skill) => <li>{skill}</li>);
  const projectList = projects.map((p) => <li>{p}</li>);
  const tabs = [{ name: "Profile", href: "#", current: true }];
  const profileImageURL =
    "https://cdn.britannica.com/79/114979-050-EA390E84/ruins-St-Andrews-Castle-Scotland.jpg";
  const user = {
    name: "Auden Huang",
    imageUrl:
      "https://media.licdn.com/dms/image/C4D03AQHHZKUrMMhCsQ/profile-displayphoto-shrink_800_800/0/1610704750210?e=2147483647&v=beta&t=OHuErweO0MQ3CeXJlSKkBpu-FOxPQh1sjcuVOQVTZb8",
    description:
      "A third year CS student looking fro projectmate for CS307 Project",
    infos: {
      Phone: "(765) 418-0737",
      Email: "huan1908@purdeu.edu",
      Rating: 5,
      Skills: skillList,
      Project: projectList,
    },
  };
  const redirectToDM = () => {
    Router.push("./dm");
  };
  return (
    <div className=''>
      <div className=''>
        <div>
          <div>
            <img
              className='h-32 w-full object-cover lg:h-48'
              src={profileImageURL}
              alt=''
            />
          </div>
          <div className='mx-auto max-w-5xl px-4 sm:px-6 lg:px-8'>
            <div className='-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5'>
              <div className='flex'>
                <img
                  className='h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32'
                  src={user.imageUrl}
                  alt=''
                />
              </div>
              <a
                href='/account/profilePic'
                className='font-medium text-left text-indigo-600 text-'
              >
                editPhoto
              </a>

              <div className='mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1'>
                <div className='mt-6 min-w-0 flex-1 sm:hidden 2xl:block'>
                  <h1 className='truncate text-2xl font-bold text-gray-900'>
                    {user.name}
                  </h1>
                </div>
                <div className='justify-stretch mt-6 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4'>
                  <button
                    type='button'
                    className='inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2'
                    onClick={redirectToDM}
                  >
                    <EnvelopeIcon
                      className='-ml-1 mr-2 h-5 w-5 text-gray-400'
                      aria-hidden='true'
                    />
                    <span>DMs</span>
                  </button>
                </div>
                <a
                  href='/account/updateProfile'
                  className='font-medium text-left text-indigo-600 text-'
                >
                  editProfile
                </a>
              </div>
            </div>
            <div className='mt-6 hidden min-w-0 flex-1 sm:block 2xl:hidden'>
              <h1 className='truncate text-2xl font-bold text-gray-900'>
                {user.name}
              </h1>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className='mt-6 sm:mt-2 2xl:mt-5'>
          <div className='border-b border-gray-200'>
            <div className='mx-auto max-w-5xl px-4 sm:px-6 lg:px-8'>
              <nav className='-mb-px flex space-x-8' aria-label='Tabs'>
                {tabs.map((tab) => (
                  <a
                    key={tab.name}
                    href={tab.href}
                    className={classNames(
                      tab.current
                        ? "border-pink-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                      "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium"
                    )}
                    aria-current={tab.current ? "page" : undefined}
                  >
                    {tab.name}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
        {/* <div className="mx-auto mt-6 max-w-5xl px-4 sm:px-6 lg:px-8">

            </div> */}
        {/* Description list */}
        <div className='mx-auto mt-6 max-w-5xl px-4 sm:px-6 lg:px-8'>
          <dl className='grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2'>
            {Object.keys(user.infos).map((info) => (
              <div key={info} className='sm:col-span-1'>
                <dt className='text-sm font-medium text-gray-500'>{info}</dt>
                <dd className='mt-1 text-sm text-gray-900'>
                  {user.infos[info]}
                </dd>
              </div>
            ))}
            <div className='sm:col-span-2'>
              <dt className='text-sm font-medium text-gray-500'>About</dt>
              <dd
                className='mt-1 max-w-prose space-y-5 text-sm text-gray-900'
                dangerouslySetInnerHTML={{ __html: user.description }}
              />
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
export default Profile;
