import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Router from "next/router";
import { InputText } from "primereact/inputtext";
import Scrumboard from "@/components/Scrumboard";
import { useRouter } from "next/router";
import { storage } from "@/config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/context/AuthContext";
import GroupChat from "@/components/GroupChat";

import {
  Bars3Icon,
  ClipboardIcon,
  FolderIcon,
  HomeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useSearchParams } from "react-router-dom";

const navigation = [
  { name: "Overview", href: "#", icon: HomeIcon, current: false },
  { name: "ScrumBoard", href: "#Scrum", icon: ClipboardIcon, current: false },
  { name: "GroupChat", href: "#GC", icon: ClipboardIcon, current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function projectSpace() {
  const {userInfo} = useAuth();
  const[icon, setIcon] = useState(null)
  const[iconURL, setIconUrl] = useState(null)
  const[banner, setBanner] = useState(null)
  const[bannerURL, setBannerURL] = useState(null)
  const [newSkills, setNewSkills] = useState();
  const [edit, setEdit] = useState(false);
  const [members, setMembers] = useState(["Auden Huang", "Jerry Martin"]);

  const [des, setDes] = useState("");
  const [name, setName] = useState("");
  const [projectD, setProject] = useState("");
  const router = useRouter();
  const { pid } = router.query;

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      pid: pid,
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };
    fetch("http://localhost:3000/api/getProject", requestOptions)
      .then((response) => response.text())
      .then((result) => setProject(JSON.parse(result)))
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    setNewSkills(
      projectD.skills !== undefined ? projectD.skills.join(",") : []
    );
    setName(projectD.name);
  }, [projectD]);

  const project = {
    name: "DevMatch",
    owner: "John Doe",
    avatar: "https://logopond.com/avatar/257420/logopond.png",
    banner:
      "https://cdn.pixabay.com/photo/2015/11/19/08/52/banner-1050629__340.jpg",
    banner2:
      "https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    description: "Description",
  };

  const redirectToProfile = () => {
    Router.push("./account");
  };

  const handleEdit = () => {
    setEdit(true);
  };
  useEffect(() => {
    if (!icon) {
        setIconUrl(undefined)
        return
    }

    const objectUrl = URL.createObjectURL(icon)
    setIconUrl(objectUrl)

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
}, [icon])
useEffect(() => {
  if (!banner) {
      setBannerURL(undefined)
      return
  }

  const objectUrl = URL.createObjectURL(banner)
  setBannerURL(objectUrl)

  // free memory when ever this component is unmounted
  return () => URL.revokeObjectURL(objectUrl)
}, [banner])

  const handleSubmit = async (e) => {

    if(!icon&&!banner)
    {
      const skillsArr = newSkills.split(",");
      var raw = JSON.stringify({
        pid: pid,
        name: name,
        skills: skillsArr,
        tmembers: projectD.tmembers !== undefined ? projectD.tmembers : undefined,
        owners: projectD.owners !== undefined ? projectD.owners : undefined,
        projectProfile:
          projectD.projectProfile !== undefined
            ? projectD.projectProfile
            : undefined,
        projectBannerPic:
          projectD.projectBannerPic !== undefined
            ? projectD.projectBannerPic
            : undefined,
        
      });

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
      };

      fetch("http://localhost:3000/api/addProject", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          console.log(result);
          setEdit(false);
        })
        .catch((error) => console.log("error", error));
    }
    else if(!banner)
    {
      var imageRef = ref(storage, name+"Icon")
      uploadBytes(imageRef, icon).then(()=>{
        getDownloadURL(imageRef).then((url)=>{
          const skillsArr = newSkills.split(",");
      var raw = JSON.stringify({
        pid: pid,
        name: name,
        skills: skillsArr,
        tmembers: projectD.tmembers !== undefined ? projectD.tmembers : undefined,
        owners: projectD.owners !== undefined ? projectD.owners : undefined,
        projectProfile:
          projectD.projectProfile !== url,
        projectBannerPic: projectD.projectBannerPic !== undefined
        ? projectD.projectBannerPic
        : undefined,
      });

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
      };

      fetch("http://localhost:3000/api/addProject", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          console.log(result);
          setEdit(false);
        })
        .catch((error) => console.log("error", error));
        })
      })


    }
    else if(!icon)
    {
      var imageRef = ref(storage, name+"Banner")
      uploadBytes(imageRef, banner).then(()=>{
        getDownloadURL(imageRef).then((url)=>{
          const skillsArr = newSkills.split(",");
          var raw = JSON.stringify({
            pid: pid,
            name: name,
            skills: skillsArr,
            tmembers: projectD.tmembers !== undefined ? projectD.tmembers : undefined,
            owners: projectD.owners !== undefined ? projectD.owners : undefined,
            projectProfile:
              projectD.projectProfile !== undefined
                ? projectD.projectProfile
                : undefined,
            projectBannerPic: url,
          });

          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");

          var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
          };

          fetch("http://localhost:3000/api/addProject", requestOptions)
            .then((response) => response.text())
            .then((result) => {
              console.log(result);
              setEdit(false);
            })
        .catch((error) => console.log("error", error));
        })
      })
    }
    else{
      var imageRef = ref(storage, name+"Icon")
      var imageRef2 = ref(storage, name+"Banner")
      uploadBytes(imageRef, icon).then(()=>{
        uploadBytes(imageRef2, banner).then(()=>{
          getDownloadURL(imageRef).then((url1)=>{
          
            getDownloadURL(imageRef2).then((url2)=>{
            const skillsArr = newSkills.split(",");
            var raw = JSON.stringify({
              pid: pid,
              name: name,
              skills: skillsArr,
              tmembers: projectD.tmembers !== undefined ? projectD.tmembers : undefined,
              owners: projectD.owners !== undefined ? projectD.owners : undefined,
              projectProfile: url1,
              projectBannerPic: url2,
            });
  
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
      
            var requestOptions = {
              method: "POST",
              headers: myHeaders,
              body: raw,
            };
  
            fetch("http://localhost:3000/api/addProject", requestOptions)
            .then((response) => response.text())
            .then((result) => {
              console.log(result);
              setEdit(false);
            })
            .catch((error) => console.log("error", error));
            })
          })
          
        }
        )

      })



    }
  };

  const handleCancel = () => {
    setEdit(false);
  };
  const redirectToFeed = () => {
    Router.push("../../Feed");
  };

  const [section, setSection] = useState("#");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
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
                <Dialog.Panel className='relative flex w-full max-w-xs flex-1 flex-col bg-white'>
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
                      <h2 className='text-3xl font-bold tracking-tight text-orange-400 xl:-ml-24'>
                        DevMatch
                      </h2>
                    </div>
                    <nav className='mt-5 space-y-1 px-2'>
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          onClick={() => setSection(item.href)}
                          className={classNames(
                            item.current
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                            "group flex items-center rounded-md px-2 py-2 text-base font-medium"
                          )}
                        >
                          <item.icon
                            className={classNames(
                              item.current
                                ? "text-gray-500"
                                : "text-gray-400 group-hover:text-gray-500",
                              "mr-4 h-6 w-6 flex-shrink-0"
                            )}
                            aria-hidden='true'
                          />
                          {item.name}
                        </a>
                      ))}
                    </nav>
                  </div>
                  <div className='flex flex-shrink-0 border-t border-gray-200 p-4'>
                    <a href='#' className='group block flex-shrink-0'>
                      <div className='flex items-center'>
                        <div>
                          <img
                            className='inline-block h-10 w-10 rounded-full'
                            src={userInfo.profilePic}
                            alt=''
                          />
                        </div>
                        <div className='ml-3'>
                          <p className='text-base font-medium text-gray-700 group-hover:text-gray-900'>
                            {userInfo.name}
                          </p>
                          <p
                            className='text-sm font-medium text-gray-500 group-hover:text-gray-700'
                            onClick={redirectToProfile}
                          >
                            View profile
                          </p>
                        </div>
                      </div>
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
        <projectSidebar />
        {/* Static sidebar for desktop */}
        <div className='hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col'>
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className='flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white'>
            <div className='flex flex-1 flex-col overflow-y-auto pt-5 pb-4'>
              <div className='flex flex-shrink-0 items-center px-4'>
                <h2 className='text-3xl font-bold tracking-tight text-orange-400'>
                    DevMatch
                </h2>
              </div>
              <nav className='mt-5 flex-1 space-y-1 bg-white px-2'>
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setSection(item.href)}
                    className={classNames(
                      item.current
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                      "group flex items-center rounded-md px-2 py-2 text-sm font-medium"
                    )}
                  >
                    <item.icon
                      className={classNames(
                        item.current
                          ? "text-gray-500"
                          : "text-gray-400 group-hover:text-gray-500",
                        "mr-3 h-6 w-6 flex-shrink-0"
                      )}
                      aria-hidden='true'
                    />
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
            <div className='flex flex-shrink-0 border-t border-gray-200 p-4'>
              <a href='#' className='group block w-full flex-shrink-0'>
                <div className='flex items-center'>
                  <div>
                    <img
                      className='inline-block h-9 w-9 rounded-full'
                      src={userInfo.profilePic}
                      alt=''
                    />
                  </div>
                  <div className='ml-3'>
                    <p className='text-sm font-medium text-gray-700 group-hover:text-gray-900'>
                      {userInfo.name}
                    </p>
                    <p
                      className='text-xs font-medium text-gray-500 group-hover:text-gray-700'
                      onClick={redirectToProfile}
                    >
                      View profile
                    </p>
                  </div>
                </div>
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
          {section === "#" && (
            <main className='flex-1'>
              {(navigation[0].current = true)}
              {(navigation[1].current = false)}
              {(navigation[2].current = false)}
              <div className='py-6'>
                <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                  <div className=''>
                    {!edit&&<img
                      className='h-32 w-full object-cover lg:h-48'
                      src={projectD.projectBannerPic}
                      alt=''
                    />}
                    {edit&&<img
                      className='h-32 w-full object-cover lg:h-48'
                      src={bannerURL}
                      alt=''
                    />}

                  </div>
                  <div className='mx-auto max-w-5xl px-4 sm:px-6 lg:px-8'>
                    <div className='-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5'>
                      <div className='flex'>
                        {!edit&&<img
                          className='h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32'
                          src={projectD.projectProfile}
                          alt=''
                        />}
                        {edit&&<img
                          className='h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32'
                          src={iconURL}
                          alt=''
                        />}
                        {edit && (
                          <InputText
                            type='file'
                            onChange={(event) => {
                              const file = event.target.files[0];
                              setBanner(file)
                              
                            }}
                          />
                        )}
                      </div>

                      <div className='mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1'>
                        {!edit && (
                          <div className='mt-6 min-w-0 flex-1 sm:hidden 2xl:block'>
                            <h1 className='truncate text-2xl font-bold text-gray-900'>
                              {projectD.name}
                            </h1>
                          </div>
                        )}
                        {edit && (
                          <div className='mt-6 min-w-0 flex-1 sm:hidden 2xl:block'>
                            <input
                              type='text'
                              className='truncate text-2xl font-bold text-gray-900  placeholder-gray-300'
                              placeholder={projectD.name}
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    {!edit && (
                      <div className='mt-6 hidden min-w-0 flex-1 sm:block 2xl:hidden'>
                        <h1 className='truncate text-2xl font-bold text-gray-900'>
                          {projectD.name}
                        </h1>
                      </div>
                    )}
                    {edit && (
                      <div className='mt-6 hidden min-w-0 flex-1 sm:block 2xl:hidden'>
                        <InputText
                          type='file'
                          accept='*.jpg'
                          onChange={(event) => {
                            const file = event.target.files[0];
                            setIcon(file)
                          }}
                        />
                        <input
                          type='text'
                          className='truncate text-2xl font-bold text-gray-900  placeholder-gray-300'
                          placeholder={projectD.name}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>
                {!edit && (
                  <div className='mx-auto mt-6 max-w-5xl px-4 sm:px-6 lg:px-8'>
                    <span className='' onClick={handleEdit}>
                      {" "}
                      Edit Info
                    </span>
                    <dl className='grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2'>
                      <div className='sm:col-span-1'>
                        <dt className='text-sm font-medium text-gray-500'>
                          Owner(s)
                        </dt>
                        <dd className='mt-1 text-sm text-gray-900'>
                          {projectD.owners !== undefined
                            ? projectD.owners[0]
                            : "N/a"}
                        </dd>
                      </div>
                      <div className='sm:col-span-1'>
                        <dt className='text-sm font-medium text-gray-500'>
                          Members
                        </dt>
                        <dd className='mt-1 text-sm text-gray-900'>
                          {projectD.tmembers !== null
                            ? projectD.tmembers !== undefined
                              ? projectD.tmembers.join(", ")
                              : "N/a"
                            : "N/a"}
                        </dd>
                      </div>
                      <div className='sm:col-span-2'>
                        <dt className='text-sm font-medium text-gray-500'>
                          About
                        </dt>
                        <dd
                          className='mt-1 max-w-prose space-y-5 text-sm text-gray-900'
                          dangerouslySetInnerHTML={{
                            __html: project.description,
                          }}
                        />
                      </div>
                      <div className='sm:col-span-2'>
                        <dt className='text-sm font-medium text-gray-500'>
                          Require Skill
                        </dt>
                        <dd className='mt-1 max-w-prose space-y-5 text-sm text-gray-900'>
                          {projectD.skills !== null
                            ? projectD.skills !== undefined
                              ? projectD.skills.join(", ")
                              : "N/a"
                            : "N/a"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                )}
                {edit && (
                  <div className='mx-auto mt-6 max-w-5xl px-4 sm:px-6 lg:px-8'>
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
                    <dl className='grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2'>
                      <div className='sm:col-span-1'>
                        <dt className='text-sm font-medium text-gray-500'>
                          Owner(s)
                        </dt>
                        <dd className='mt-1 text-sm text-gray-900'>
                          {project.owner}
                        </dd>
                        {/* <button className=' rounded-md border bg-white text-black my-1 py-1 px-4 text-sm shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
                          {" "}
                          Transfer Ownership
                        </button> */}
                      </div>
                      <div className='sm:col-span-1'>
                        <dt className='text-sm font-medium text-gray-500'>
                          Members
                        </dt>
                        <dd className='mt-1 text-sm text-gray-900'>
                          {projectD.tmembers !== null
                            ? projectD.tmembers !== undefined
                              ? projectD.tmembers.join(", ")
                              : "N/a"
                            : "N/a"}
                        </dd>
                      </div>
                      <div className='sm:col-span-2'>
                        <dt className='text-sm font-medium text-gray-500'>
                          About
                        </dt>
                        <dd className='mt-1 max-w-prose space-y-5 text-sm text-gray-900'>
                          {" "}
                          <input
                            type='text'
                            className='bg-transparent border-none outline-none text-black placeholder-gray-300'
                            placeholder={project.description}
                            onChange={(e) => setDes(e.target.value)}
                          />
                        </dd>
                      </div>
                      <div className='sm:col-span-2'>
                        <dt className='text-sm font-medium text-gray-500'>
                          Require Skill
                        </dt>
                        <dd className='mt-1 text-sm text-gray-900'>
                          <input
                            type='text'
                            className='bg-transparent border-none outline-none text-black placeholder-gray-300'
                            placeholder={projectD.skills}
                            value={newSkills}
                            onChange={(e) => setNewSkills(e.target.value)}
                          />
                        </dd>
                      </div>
                    </dl>
                  </div>
                )}
              </div>
            </main>
          )}
  
          {section === "#Scrum" && (
            <main className='flex-1'>
              {(navigation[0].current = false)}
              {(navigation[1].current = true)}
              {(navigation[2].current = false)}
              <Scrumboard />
            </main>
          )}
          {section === "#GC" && (
            <main className='flex-1'>
              {(navigation[0].current = false)}
              {(navigation[1].current = false)}
              {(navigation[2].current = true)}
              <GroupChat/>
            </main>
          )}


        </div>
      </div>
    </>
  );
}
