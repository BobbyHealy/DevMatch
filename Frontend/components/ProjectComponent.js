import { Fragment, useState, useEffect } from "react";
import { Menu, Transition } from "@headlessui/react";
import { EnvelopeIcon, EyeIcon } from "@heroicons/react/20/solid";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/context/AuthContext";
import ProjectModal from "./ProjectModal";
import Router from "next/router";
import {
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
  collection,
} from "firebase/firestore";
import { db } from "@/config/firebase";

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
  const {
    project = default_project,
    isInvite,
    handleAccept,
    handleReject,
    ...restProps
  } = props;
  const { user, userInfo } = useAuth();
  const [user2, setUser2] = useState(null);
  const [owners, setOwners] = useState([]);
  const [load, setload] = useState(false);
  const [members, setMembers] = useState([]);
  const [otherMembers, setOtherMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showHideModal, setHideModal] = useState(false);

  function refreshPage() {
    window.location.reload(false);
  }
  const handleSelect = async () => {
    //check whether the group(chats in firestore) exists, if not create
    const combinedId =
      userInfo.userID > user2.userID
        ? userInfo.userID + "-" + user2.userID
        : user2.userID + "-" + userInfo.userID;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), {});

        await updateDoc(doc(db, "userChats", userInfo.userID), {
          [combinedId + ".userInfo"]: {
            uid: user2.userID,
            displayName: user2.name,
            photoURL: user2.profilePic,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user2.userID), {
          [combinedId + ".userInfo"]: {
            uid: userInfo.userID,
            displayName: userInfo.name,
            photoURL: userInfo.profilePic,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
      await updateDoc(doc(db, "users", userInfo.userID), {
        currentChat: {
          uid: user2.userID,
          displayName: user2.name,
          photoURL: user2.profilePic,
        },
        currentPage: "DMs",
      });
      Router.push("/account");
    } catch (err) {}
  };

  useEffect(() => {
    if (!load && project.owners) {
      setload(true);
      var owners = [];
      var members = [];
      project.owners.map((owner) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({
          userID: owner,
        });
        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
        };
        fetch("http://localhost:3000/api/getUser", requestOptions)
          .then((response) => response.text())
          .then((result) => {
            owners.push(JSON.parse(result).name);
            if (owners.length === 1) {
              setUser2(JSON.parse(result));
            }
            if (project.owners.length === owners.length) {
              setOwners(owners);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      });
      project.tmembers.map((mem) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({
          userID: mem,
        });
        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
        };
        fetch("http://localhost:3000/api/getUser", requestOptions)
          .then((response) => response.text())
          .then((result) => {
            members.push(JSON.parse(result).name);
            if (project.tmembers.length === members.length) {
              setMembers(members);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      });
    }
  }, [project?.owners, project?.tmembers]);

  const handleJoinProject = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      uid: user.uid,
      pid: project.pid,
      isOwner: false,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    await fetch("http://localhost:3000/api/joinProject", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        setUserInfo(JSON.parse(result));
      })
      .catch((error) => console.log("error", error));
    refreshPage();
  };
  return (
    <div className='bg-grey rounded-lg'>
      <h1>
        <img
          className='h-18 w-full object-cover lg:h-24 rounded-t-lg'
          src={project.projectBannerPic}
          alt=''
        />
      </h1>
      <div className='bg-white px-4 py-5 sm:py-6 rounded-lg'>
        <div className='flex space-x-3'>
          <div className='flex-shrink-0'>
            <img
              className='h-10 w-10 rounded-full'
              src={project.projectProfile}
              alt=''
            />
          </div>
          <div className='min-w-0 flex-1 space-y-1'>
            <p className='text-sm font-semibold text-gray-900'>
              <a
                href='#'
                className='hover:underline'
                onClick={() => setShowModal(true)}
              >
                {project.name}
              </a>
            </p>
            <p className='text-sm text-gray-500'>
              <span className='font-bold'>Owners</span>
              {owners.length > 0 ? (
                owners
                  .sort((a, b) => {
                    if (a < b) {
                      return -1;
                    } else {
                      return 1;
                    }
                  })
                  .map((owner) => <p>{owner}</p>)
              ) : (
                <p>N/a</p>
              )}
            </p>
            <p className='text-sm text-gray-500'>
              <span className='font-bold'> Project Type</span>

              <p>{project.type}</p>
            </p>
            <div className='text-sm text-gray-500'>
              <p className='font-bold'>Skills Needed</p>
              {project.skills[0].length > 0
                ? project.skills.map((e, i) => <p key={i}>{e + " "}</p>)
                : "N/a"}
            </div>
            <div className='text-sm text-gray-500'>
              <span className='font-bold'>Other members</span>
              {members.length > 1 ? (
                members
                  .sort((a, b) => {
                    if (a < b) {
                      return -1;
                    } else {
                      return 1;
                    }
                  })
                  .map((mem) => !owners.includes(mem) && <p key={mem}>{mem}</p>)
              ) : (
                <p>N/a</p>
              )}
            </div>
            <div className='text-sm text-gray-500'>
              <span className='font-bold'>Current Number of Members</span>
              <p>{project.currentNum}</p>
            </div>
            <div className='text-sm text-gray-500'>
              <span className='font-bold'>Max Number of Members</span>
              <p>{project.maxNum}</p>
            </div>
            <div className='text-sm text-gray-500'>
              <span className='font-bold'>Hours Expected per week</span>
              <p>{project.workHours === "" ? "N/A" : project.workHours}</p>
            </div>
          </div>
          {!isInvite ? (
            <div className='flex gap-x-1'>
              <div className='flex flex-shrink-0 self-center'>
                <button
                  type='button'
                  onClick={() => handleJoinProject()}
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
                  onClick={handleSelect}
                  className='inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                >
                  Message
                  <EnvelopeIcon
                    className='ml-2 -mr-1 h-5 w-5'
                    aria-hidden='true'
                  />
                </button>
              </div>
            </div>
          ) : (
            <div className='flex gap-x-1'>
              <div className='flex flex-shrink-0 self-center'>
                <button
                  type='button'
                  onClick={() => handleAccept()}
                  className='inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                >
                  Accept
                  <UserGroupIcon
                    className='ml-2 -mr-1 h-5 w-5'
                    aria-hidden='true'
                  />
                </button>
              </div>
              <div className='flex flex-shrink-0 self-center'>
                <button
                  type='button'
                  onClick={() => handleReject()}
                  className='inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                >
                  Reject
                  <EnvelopeIcon
                    className='ml-2 -mr-1 h-5 w-5'
                    aria-hidden='true'
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ProjectModal isVisible={showModal} onClose={() => setShowModal(false)}>
        <div className='overflow-hidden bg-white shadow sm:rounded-lg'>
          <h1>
            <img
              className='h-18 w-full object-cover lg:h-24 rounded-t-lg'
              src={project.projectBannerPic}
              alt=''
            />
          </h1>
          <div className='px-4 py-5 sm:px-6'>
            <h3 className='text-base font-semibold leading-6 text-gray-900'>
              {project.name}
            </h3>
          </div>
          <div className='border-t border-gray-200 px-4 py-5 sm:p-0'>
            <dl className='sm:divide-y sm:divide-gray-200'>
              <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
                <dt className='text-sm font-medium text-gray-500'>
                  Project Owner
                </dt>
                <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                  {" "}
                  {owners.length > 0 ? (
                    owners
                      .sort((a, b) => {
                        if (a < b) {
                          return -1;
                        } else {
                          return 1;
                        }
                      })
                      .map((owner) => <p>{owner}</p>)
                  ) : (
                    <p>N/a</p>
                  )}{" "}
                </dd>
              </div>
              <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
                <dt className='text-sm font-medium text-gray-500'>
                  Looking for
                </dt>
                <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                  {" "}
                  {project.skills[0].length > 0
                    ? project.skills.map((e, i) => <p key={i}>{e + " "}</p>)
                    : "N/a"}
                </dd>
              </div>
              <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
                <dt className='text-sm font-medium text-gray-500 font-bold'>
                  Other members
                </dt>
                <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                  {" "}
                  {members.length > 1 ? (
                    members
                      .sort((a, b) => {
                        if (a < b) {
                          return -1;
                        } else {
                          return 1;
                        }
                      })
                      .map(
                        (mem) => !owners.includes(mem) && <p key={mem}>{mem}</p>
                      )
                  ) : (
                    <p>N/a</p>
                  )}
                </dd>
              </div>
              <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
                <dt className='text-sm font-medium text-gray-500'>
                  Current Number of Members
                </dt>
                <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                  {project.currentNum}
                </dd>
              </div>
              <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
                <dt className='text-sm font-medium text-gray-500'>
                  Max Number of Members
                </dt>
                <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                  {project.maxNum}
                </dd>
              </div>
              <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
                <dt className='text-sm font-medium text-gray-500'>
                  Expected hours per week
                </dt>
                <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                  30
                </dd>
              </div>
              <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
                <dt className='text-sm font-medium text-gray-500'>
                  Project Type
                </dt>
                <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                  {project.type}
                </dd>
              </div>
              <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
                <dt className='text-sm font-medium text-gray-500'>
                  Project Description
                </dt>
                <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                  {project.projectDes}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </ProjectModal>
    </div>
  );
}
