import React, { Component, useEffect, useState } from "react";
import Router from "next/router";
import { EnvelopeIcon } from "@heroicons/react/20/solid";
import { useAuth } from "@/context/AuthContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
function Profile() {
  const { user, login, logout, userInfo } = useAuth();
  const [completeUser, setCompleteUser] = useState({
    userId: "",
    name: "Foo Bar",
    email: "foo@bar.com",
    rating: 100,
    profilePic: "",
    pOwned: [""],
    pJoined: [""],
    skills: [""],
  });

  const [newSkills, setNewSkills] = useState([]);
  const [newName, setNewName] = useState([]);
  const [phone, setPhone] = useState("");
  const [des, setDes] = useState("");
  const [edit, setEdit] = useState(false);
  const [projects, setProject] = useState(["Project", "Project2"]);

  useEffect(() => {
    if (user === null && userInfo === null) {
      Router.push("/account/login");
    } else if (userInfo === null) {
      setCompleteUser({
        userID: user.userID !== undefined ? user.userID : "",
        name: "Foo Bar",
        email: user.email !== undefined ? user.email : "foo@bar.com",
        rating: 100,
        profilePic: "",
        pOwned: [],
        pJoined: [],
        skills: [],
      });
    } else {
      setCompleteUser({
        userID: user.userID !== undefined ? user.userID : "",
        name: userInfo.name !== undefined ? userInfo.name : "Foo Bar",
        email: user.email !== undefined ? user.email : "foo@bar.com",
        rating: userInfo.rating !== undefined ? userInfo.rating : 100,
        profilePic:
          userInfo.profilePic !== undefined ? userInfo.profilePic : "",
        pOwned: userInfo.pOwned !== undefined ? userInfo.pOwned : [],
        pJoined: userInfo.pJoined !== undefined ? userInfo.pJoined : [],
        skills: userInfo.skills !== undefined ? userInfo.skills : [],
      });
      setNewSkills(userInfo.skills !== undefined ? userInfo.skills : []);
    }
  }, [user, userInfo]);

  const projectList = projects.map((p) => <li>{p}</li>);
  const tabs = [{ name: "Profile", href: "#", current: true }];
  const profileImageURL =
    "https://cdn.britannica.com/79/114979-050-EA390E84/ruins-St-Andrews-Castle-Scotland.jpg";
  const fake = {
    name: "Auden Huang",
    imageUrl:
      "https://media.licdn.com/dms/image/C4D03AQHHZKUrMMhCsQ/profile-displayphoto-shrink_800_800/0/1610704750210?e=2147483647&v=beta&t=OHuErweO0MQ3CeXJlSKkBpu-FOxPQh1sjcuVOQVTZb8",
    description:
      "A third year CS student looking fro projectmate for CS307 Project",
    infos: {
      Phone: "(765) 418-0737",
      Email: "dnaidsu",
      Rating: 5,
      Project: projectList,
    },
  };
  const handleEdit = () => {
    setEdit(true);
  };

  const handleSubmit = async (e) => {
    const skillsArr = newSkills.split(",");
    var raw = JSON.stringify({
      userID: user.uid,
      name: newName,
      rating: 100,
      skills: skillsArr,
      pOwned: user.pOwned !== undefined ? user.pOwned : undefined,
      pJoined: user.pJoined !== undefined ? user.pJoined : undefined,
      profilePic: user.profilePic !== undefined ? user.profilePic : undefined,
    });

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    fetch("http://localhost:3000/api/addUser", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        setEdit(false);
      })
      .catch((error) => console.log("error", error));
  };

  // const handleSubmit = () => {
  //   setEdit(false);
  // };
  const handleCancel = () => {
    setEdit(false);
  };

  return (
    <div className='relative'>
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
                src={completeUser.profilePic}
                alt=''
              />
            </div>
            <a
              href='/account/profilePic'
              className='font-medium text-left text-indigo-600 '
            >
              Edit Photo
            </a>

            <div className='mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1'>
              <div className='mt-6 min-w-0 flex-1 sm:hidden 2xl:block'>
                <h1 className='truncate text-2xl font-bold text-gray-900'>
                  {completeUser.name}
                </h1>
              </div>
              {!edit && (
                <span
                  className='font-medium text-left text-indigo-600'
                  onClick={handleEdit}
                >
                  Edit Profile
                </span>
              )}
              {edit && (
                <div className='flex h-12 p-2 gap-2  items-center gap-2'>
                  <button
                    className=' rounded-md border bg-white text-black my-1 py-1 px-4 text-sm shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                    onClick={handleSubmit}
                  >
                    {" "}
                    Submit
                  </button>
                  <button
                    className=' rounded-md border bg-white text-black my-1 py-1 px-4 text-sm shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                    onClick={handleCancel}
                  >
                    {" "}
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className='mt-6 hidden min-w-0 flex-1 sm:block 2xl:hidden'>
            <h1 className='truncate text-2xl font-bold text-gray-900'>
              {completeUser.name}
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
      <div className='flex mx-auto mt-6 max-w-5xl px-4 sm:px-6 lg:px-8'>
        {!edit && (
          <dl className='grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2'>
            <div className='sm:col-span-1'>
              <dt className='text-sm font-medium text-gray-500'>{"Email"}</dt>
              <dd className='mt-1 text-sm text-gray-900'>
                {completeUser.email}
              </dd>
            </div>

            <div className='sm:col-span-1'>
              <dt className='text-sm font-medium text-gray-500'>{"Skills"}</dt>
              <dd className='mt-1 text-sm text-gray-900'>
                {completeUser.skills !== null
                  ? completeUser.skills.join(", ")
                  : "N/a"}
              </dd>
            </div>

            <div className='sm:col-span-1'>
              <dt className='text-sm font-medium text-gray-500'>
                {"Owned Projects"}
              </dt>
              <dd className='mt-1 text-sm text-gray-900'>
                {completeUser.pOwned !== null
                  ? completeUser.pOwned.join(", ")
                  : "N/a"}
              </dd>
            </div>

            <div className='sm:col-span-1'>
              <dt className='text-sm font-medium text-gray-500'>
                {"Joined Projects"}
              </dt>
              <dd className='mt-1 text-sm text-gray-900'>
                {completeUser.pJoined !== null
                  ? completeUser.pJoined.join(", ")
                  : "N/a"}
              </dd>
            </div>

            <div className='sm:col-span-1'>
              <dt className='text-sm font-medium text-gray-500'>{"Rating"}</dt>
              <dd className='mt-1 text-sm text-gray-900'>
                {completeUser.rating}
              </dd>
            </div>

            <div className='sm:col-span-2'>
              <dt className='text-sm font-medium text-gray-500'>About</dt>
              <dd
                className='mt-1 max-w-prose space-y-5 text-sm text-gray-900'
                dangerouslySetInnerHTML={{ __html: fake.description }}
              />
            </div>
          </dl>
        )}
        {edit && (
          <dl className='grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2'>
            <div className='sm:col-span-1'>
              <dt className='text-sm font-medium text-gray-500'>Name</dt>
              <dd className='mt-1 text-sm text-gray-900'>
                <input
                  type='text'
                  className='bg-transparent border-none outline-none text-black placeholder-gray-300'
                  placeholder={newName}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </dd>
            </div>
            <div className='sm:col-span-1'>
              <dt className='text-sm font-medium text-gray-500'>Email</dt>
              <dd className='mt-1 text-sm text-gray-900'>
                {completeUser.email}
              </dd>
            </div>
            <div className='sm:col-span-1'>
              <dt className='text-sm font-medium text-gray-500'>Rating</dt>
              <dd className='mt-1 text-sm text-gray-900'>
                {completeUser.rating}
              </dd>
            </div>
            <div className='sm:col-span-1'>
              <dt className='text-sm font-medium text-gray-500'>Skills</dt>
              <dd className='mt-1 text-sm text-gray-900'>
                <input
                  type='text'
                  className='bg-transparent border-none outline-none text-black placeholder-gray-300'
                  placeholder={completeUser.skills}
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                />
              </dd>
            </div>
            <div className='sm:col-span-1'>
              <dt className='text-sm font-medium text-gray-500'>Projects</dt>
              <dd className='mt-1 text-sm text-gray-900'>
                {completeUser.pOwned}
              </dd>
            </div>
            <div className='sm:col-span-2'>
              <dt className='text-sm font-medium text-gray-500'>About</dt>
              <dd className='mt-1 max-w-prose space-y-5 text-sm text-gray-900'>
                <input
                  type='text'
                  className='bg-transparent border-none outline-none text-black placeholder-gray-300'
                  placeholder={user.description}
                  onChange={(e) => setDes(e.target.value)}
                />
              </dd>
            </div>
          </dl>
        )}
      </div>
    </div>
  );
}
export default Profile;
