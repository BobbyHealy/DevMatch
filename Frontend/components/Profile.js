import React, { Component, useEffect, useState } from "react";
import Router from "next/router";
import { EnvelopeIcon } from "@heroicons/react/20/solid";
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useAuth } from "@/context/AuthContext";
import DeactivateModal from "./DeactivateModal";
import {doc,updateDoc,} from "firebase/firestore";
import { db } from "@/config/firebase";
import {deleteUser, getAuth} from "firebase/auth";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
function Profile() {


  const { user, login, logout, userInfo } = useAuth();
  const currentUser ={
    userID: user.userID !== undefined ? userInfo.userID : "",
    name: userInfo.name !== undefined ? userInfo.name : "Foo Bar",
    email: user.email !== undefined ? user.email : "foo@bar.com",
    rating: userInfo.rating !== undefined ? userInfo.rating : 100,
    profilePic:
          userInfo.profilePic !== undefined ? userInfo.profilePic : "",
    pOwned: userInfo.pOwned !== undefined ? userInfo.pOwned : [],
    pJoined: userInfo.pJoined !== undefined ? userInfo.pJoined : [],
    skills: userInfo.skills !== undefined ? userInfo.skills : [],
    description: userInfo.description !== undefined ? userInfo.description : ""
  }
  const [showModal, setShowModal] = useState(false);
  const [completeUser, setCompleteUser] = useState({
    userId: "",
    name: "Foo Bar",
    email: "foo@bar.com",
    rating: 100,
    profilePic: "",
    pOwned: [""],
    pJoined: [""],
    skills: [""],
    description:""
  });
  const [newSkills, setNewSkills] = useState(undefined);
  const [newName, setNewName] = useState(undefined);
  const [phone, setPhone] = useState("");
  const [des, setDes] = useState(undefined);
  const [edit, setEdit] = useState(false);
  const [pO, setPO] = useState([]);
  const [pJ, setPJ] = useState([]);
  const [projectsO, setProjectsO] = useState([]);
  const [projectsJ, setProjectsJ] = useState([]);
  function refreshPage() {
    window.location.reload(false);
  }
  useEffect(()=>
  {
    setPO(userInfo.pOwned)
    setPJ(userInfo.pJoined)
    
  },[])

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
        description: ""
      });
    } else {
      setCompleteUser(currentUser);
      setNewSkills(
        userInfo.skills !== undefined ? userInfo.skills.join(",") : []
      );
    }
    updateDoc(doc(db, "users", user.uid), {
      currentPage:"Overview"
    })
  }, [user, userInfo]);



  const tabs = [{ name: "Profile", href: "#", current: true }];
  const profileImageURL =
    "https://cdn.britannica.com/79/114979-050-EA390E84/ruins-St-Andrews-Castle-Scotland.jpg";


  useEffect(() => {


    var projects =[]
      if(pO )
      {
        pO.map((project)=>{
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({
          pid: project,
        });
        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
        };
        fetch("http://localhost:3000/api/getProject", requestOptions)
          .then((response) => response.text())
          .then((result) => 
          {
            projects.push(JSON.parse(result))
            if(pO.length===projects.length)
            {
              setProjectsO(projects)
            }
          }
          )
          .catch((err) => {
            console.log(err);
          });
          
        })
        
      }
   
  }, [pO]);

  useEffect(() => {
     var projects =[]

    if (pJ)
    {
      pJ.map((project)=>{
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      var raw = JSON.stringify({
        pid: project,
      });
      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
      };
      fetch("http://localhost:3000/api/getProject", requestOptions)
        .then((response) => response.text())
        .then((result) =>  
        {
          projects.push(JSON.parse(result))
          if(pJ.length===projects.length)
          {
            setProjectsJ(projects)
          }

        })
        .catch((err) => {
          console.log(err);
        });
    })
    }

    
   
  }, [pJ]);
  const handleEdit = () => {
    setEdit(true);
  };
  const deleteUser = async () => {

    const currentUser = getAuth().currentUser
    setShowModal(false)
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      userID: user.uid,
    });
    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      body: raw,
    };
    fetch("http://localhost:3000/api/deleteUser", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((err) => {
        console.log(err);
      });
    
    currentUser.delete().then(() => {
      Router.push('/account/login')
      refreshPage()
    }).catch((error) => {

    });
  }

  const handleSubmit = async (e) => {
    console.log(newName==="")
    const skillsArr = newSkills!== undefined? newSkills.split(","): undefined
    var raw = JSON.stringify({
      userID: user.uid,
      name: newName !== undefined&&newName.trim().length>0 ? newName.trim() : userInfo.name,
      rating: 100,
      skills: skillsArr!== undefined ? skillsArr : userInfo.name,
      pOwned: userInfo.pOwned !== undefined ? userInfo.pOwned : undefined,
      pJoined: userInfo.pJoined !== undefined ? userInfo.pJoined : undefined,
      profilePic: userInfo.profilePic !== undefined ? userInfo.profilePic : undefined,
      description: des !== undefined ? des: userInfo.description
    });

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };
    updateDoc(doc(db, "users", user.uid), {
      displayName: newName !== undefined&&newName.trim().length>0 ? newName.trim() : userInfo.name
    })

    fetch("http://localhost:3000/api/addUser", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        setEdit(false);
      })
      .catch((error) => console.log("error", error));
      setNewName(undefined)
      setDes(undefined)
      setNewSkills(undefined)
      refreshPage()
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
              {projectsO.length>0?projectsO.sort((a,b)=>
              {
                if(a.name<b.name)
                {
                  return -1
                }else
                {
                  return 1
                }
              }).map((project)=>
                        (<li key={project.pid}>{project.name}</li>)):"N/A"}
              </dd>
            </div>

            <div className='sm:col-span-1'>  
              <dt className='text-sm font-medium text-gray-500'>
                {"Joined Projects"}
              </dt>
              <dd className='mt-1 text-sm text-gray-900'>
              {projectsJ.length>0?projectsJ.sort((a,b)=>
              {
                if(a.name<b.name)
                {
                  return -1
                }else
                {
                  return 1
                }
              }).map((project)=>
                        (<li key={project.pid}>{project.name}</li>)): "N/A"}
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
                dangerouslySetInnerHTML={{ __html: userInfo.description }}
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
                  placeholder={completeUser.name}
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
            <div className='sm:col-span-2'>
              <dt className='text-sm font-medium text-gray-500'>About</dt>
              <dd className='mt-1 max-w-prose space-y-5 text-sm text-gray-900'>
                <input
                  type='text'
                  className='bg-transparent border-none outline-none text-black placeholder-gray-300'
                  placeholder={userInfo.description}
                  value={des}
                  onChange={(e) => setDes(e.target.value)}
                />
              </dd>
            </div>
            <div className='sm:col-span-1 py-6'>
                <button
                  type="button"
                  className="rounded-full bg-red-600 py-2 px-3.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                  onClick={() => setShowModal(true)}
                >
                  Deactivate Account
                </button>
            </div>
          </dl>
        )}
      </div>
      <DeactivateModal isVisible={showModal} onClose={() => setShowModal(false)}>
            <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                      Deactivate account
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to deactivate your account? All of your data will be permanently removed
                        from our servers forever. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    onClick={deleteUser}
                  >
                    Deactivate
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
              </div>
      </DeactivateModal>
    </div>
  );
}
export default Profile;
