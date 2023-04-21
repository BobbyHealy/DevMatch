import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { EnvelopeIcon } from "@heroicons/react/20/solid";
import {
  CodeBracketIcon,
  EllipsisVerticalIcon,
  FlagIcon,
  StarIcon,
  CheckIcon,
} from "@heroicons/react/20/solid";
import { useAuth } from "@/context/AuthContext";
import DeactivateModal from "./DeactivateModal";
import { useState, useEffect } from "react";
import {
  ExclamationTriangleIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";

import Router from "next/router";
import {
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { v4 as uuid } from "uuid";
import { handleRoleChange } from "@/functions/roleFunctions";
import ProjComponent from "./ProjectComponent";
import PastProjectModal from "./PastProjectsModal";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const default_user = {
  userID: "1928109281",
  name: "Roberto Healy",
  pOwned: ["1231231233"],
  pJoined: ["31232131223"],
  rating: 0,
  skills: ["JavaScript, CSS, HTML"],
  profile_picture: "",
};

export default function UserComponent(props) {
  const [showModal, setShowModal] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [showReportModal, setReportModal] = useState(false);
  const [showManage, setManageModal] = useState(false);
  const [showPast, setShowPast] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  const {
    user = default_user,
    inviteProjectID = null,
    role = false,
    pid = null,
  } = props;

  const { userInfo } = useAuth();

  const combinedId =
    userInfo.userID > user.userID
      ? userInfo.userID + "-" + user.userID
      : user.userID + "-" + userInfo.userID;

  const handleSelect = async () => {
    //check whether the group(chats in firestore) exists, if not create
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        await updateDoc(doc(db, "userChats", userInfo.userID), {
          [combinedId + ".userInfo"]: {
            uid: user.userID,
            displayName: user.name,
            photoURL: user.profilePic,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.userID), {
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
          uid: user.userID,
          displayName: user.name,
          photoURL: user.profilePic,
        },
        currentPage: "DMs",
      });
      Router.push("/account");
    } catch (err) {}
  };

  const handleInvite = async (pid, uid) => {
    //check whether the group(chats in firestore) exists, if not create
    console.log("Hello");
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      pid: pid,
      uid: uid,
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    return await new Promise((resolve, reject) => {
      fetch("http://localhost:3000/api/sendInvite", requestOptions)
        .then((response) => response.text())
        .then((result) => resolve(JSON.parse(result)))
        .catch((err) => {
          reject(err);
        });
    });
  };

  const handleRemove = async () => {
    setShowModal(false);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      pid,
      uid: user.userID,
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    fetch("http://localhost:3000/api/leaveProject", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((err) => {
        console.log(err);
      });
  };

  const handleReport = () => {
    var textArea = document.getElementById("report").value;
    console.log(textArea);

    var myHeaders = new Headers();

    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      uid: user.userID,
      report: textArea,
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    fetch("http://localhost:3000/api/reportUser", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((err) => {
        console.log(err);
      });

    //Router.push("./");

    setReportModal(false);

    //refreshPage()
  };

  return (
    <div className='bg-white px-4 py-5 sm:px-6 rounded-lg'>
      <div className='flex space-x-3'>
        <div className='flex-shrink-0'>
          <img
            className='h-10 w-10 rounded-full'
            src={
              user.profilePic !== undefined
                ? user.profilePic
                : "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            }
            alt=''
          />
        </div>
        <div className='min-w-0 flex-1'>
          <p className='text-sm font-semibold text-gray-900'>
            <a
              href='#'
              className='hover:underline'
              onClick={() => setShowPast(true)}
            >
              {user.name}
            </a>
          </p>
          {!role ? (
            <div>
              <p className='text-sm text-gray-500'>
                <a href='#' className='hover:underline'>
                  Rating: {" " + user.rating}
                </a>
              </p>
              <p className='text-sm text-gray-500'>
                <a href='#' className='hover:underline'>
                  Work Hours:{" "}
                  {" " + (user.workHours === "" ? "N/A" : user.workHours)}
                </a>
              </p>
              <div className='text-sm text-gray-500'>
                <a href='#' className='hover:underline'>
                  Skill List:{" "}
                  {user.skills
                    ? user.skills.map((e, i) => <p key={i}>{e + " "}</p>)
                    : "N/a"}
                </a>
              </div>
              <p className='text-sm text-gray-500'>
                <a href='#' className='hover:underline'>
                  Other Projects: 1, 2, 3
                </a>
              </p>
            </div>
          ) : (
            <p className='text-sm text-gray-500'>
              <a href='#' className='hover:underline'>
                {"Role: " + user.role}
              </a>
            </p>
          )}
        </div>

        <div className='flex flex-shrink-0  space-x-3 self-center'>
          {role && user.role !== "owner" ? (
            <div className='space-x-3'>
              <button
                onClick={() => setManageModal(true)}
                type='button'
                className='inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              >
                Manage
              </button>
              <button
                onClick={() => setShowModal(true)}
                type='button'
                className='inline-flex items-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2'
              >
                Remove from Project
              </button>
            </div>
          ) : inviteProjectID !== null ? (
            <button
              onClick={() => handleInvite(inviteProjectID, user.userID)}
              type='button'
              className='inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
            >
              Invite to Project
              <EnvelopeIcon className='ml-2 -mr-1 h-5 w-5' aria-hidden='true' />
            </button>
          ) : inviteProjectID === null && pid === null ? (
            <button
              onClick={handleSelect}
              type='button'
              className='inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
            >
              Message
              <EnvelopeIcon className='ml-2 -mr-1 h-5 w-5' aria-hidden='true' />
            </button>
          ) : (
            <></>
          )}
          <button
            onClick={() => setReportModal(true)}
            type='button'
            className='inline-flex items-center rounded-md border border-transparent bg-purple-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2'
          >
            Report
            <FlagIcon className='ml-2 -mr-1 h-5 w-5' aria-hidden='true' />
          </button>
        </div>
      </div>
      <DeactivateModal
        isVisible={showModal}
        onClose={() => setShowModal(false)}
      >
        <div className='sm:flex sm:items-start'>
          <div className='mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10'>
            <ExclamationTriangleIcon
              className='h-6 w-6 text-red-600'
              aria-hidden='true'
            />
          </div>
          <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
            <h3 className='text-base font-semibold leading-6 text-gray-900'>
              Remove User
            </h3>
            <div className='mt-2'>
              <p className='text-sm text-gray-500'>
                Are you sure you want to remove this user?
              </p>
            </div>

            <div className='mt-2'>
              <label
                htmlFor='email'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Confirm by writing the user's name
              </label>
              <div className='mt-2'>
                <input
                  type='text'
                  name='confirm'
                  onChange={(e) => setConfirmation(e.target.value)}
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                />
              </div>
            </div>
          </div>
        </div>

        <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
          <button
            disabled={confirmation !== user.name}
            type='button'
            className={`inline-flex w-full justify-center rounded-md bg-${
              confirmation !== user.name
                ? "gray-600"
                : "indigo-600 hover:bg-indigo-500"
            } px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto`}
            onClick={handleRemove}
          >
            Remove
          </button>
          <button
            type='button'
            className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto'
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
        </div>
      </DeactivateModal>

      <DeactivateModal
        isVisible={showReportModal}
        onClose={() => setReportModal(false)}
      >
        <div>
          <div className='mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10'>
            <FlagIcon className='h-6 w-6 text-red-600' aria-hidden='true' />
          </div>
          <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
            <h3 className='text-base font-semibold leading-6 text-gray-900'>
              Report User
            </h3>
            <div className='mt-2'>
              <p className='text-sm text-gray-500'>
                Provide a reason for reporting this user:
              </p>
            </div>

            <div className='mt-2'>
              <div className='mt-2'>
                <textarea
                  id='report'
                  name='report'
                  rows={4}
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  defaultValue={""}
                />
              </div>
            </div>
          </div>
        </div>

        <div className='mt-5 sm:mt-4 space-x-5 sm:flex sm:flex-row-reverse'>
          <button
            type='submit'
            className='inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto'
            onClick={() => handleReport()}
          >
            Submit
          </button>
          <button
            type='button'
            className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto'
            onClick={() => setReportModal(false)}
          >
            Cancel
          </button>
        </div>
      </DeactivateModal>

      <DeactivateModal
        isVisible={showManage}
        onClose={() => setManageModal(false)}
      >
        <div>
          <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
            <h3 className='text-base font-semibold leading-6 text-gray-900'>
              User's name
            </h3>
            <div className='mt-2'>
              <p className='text-sm text-gray-500'>
                Current role: Member / Manager / Etc...
              </p>
            </div>

            <div className='mt-2'>
              <label
                htmlFor='roles'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Roles
              </label>
              <select
                id='role'
                name='role'
                className='mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6'
                defaultValue='Member'
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option>{"team member"}</option>
                <option>{"admin"}</option>
                <option>{"owner"}</option>
              </select>
            </div>
          </div>
        </div>

        <div className='mt-5 sm:mt-4 space-x-5 sm:flex sm:flex-row-reverse'>
          <button
            type='submit'
            className='inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto'
            onClick={() =>
              handleRoleChange(user.role, selectedRole, user.userID, pid)
            }
          >
            Save
          </button>
          <button
            type='button'
            className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto'
            onClick={() => setManageModal(false)}
          >
            Cancel
          </button>
        </div>
      </DeactivateModal>

      {/* <DeactivateModal isVisible={showPast} onClose={() => setShowPast(false)}>
        <div>
          <p className='font-bold'>User's past projects:</p>
          <div>
            <label
              htmlFor='past'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              Select for more details
            </label>
            <select
              id='past'
              name='past'
              className='mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6'
              defaultValue='Test Project'
            >
              <option>Test Project 1</option>
              <option>Test Project 2</option>
              <option>Test Project 3</option>
            </select>
          </div>
        </div>
      </DeactivateModal> */}
      <PastProjectModal
        showPast={showPast}
        setShowPast={setShowPast}
        uid={user.userID}
      />
    </div>
  );
}
