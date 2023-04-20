import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { EnvelopeIcon } from "@heroicons/react/20/solid";
import {
  CodeBracketIcon,
  EllipsisVerticalIcon,
  FlagIcon,
  StarIcon,
} from "@heroicons/react/20/solid";
import { useAuth } from "@/context/AuthContext";
import DeactivateModal from "./DeactivateModal";
import { useState } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

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

export default function PastUserComponent(props) {
  const [showModal, setShowModal] = useState(false);
  const [showReportModal, setReportModal] = useState(false);

  const {
    user = default_user,
  } = props;
  const { userInfo } = useAuth();
  const combinedId =
    userInfo.userID > user.userID
      ? userInfo.userID + "-" + user.userID
      : user.userID + "-" + userInfo.userID;

  const handleReport = () => {

    var textArea = document.getElementById('report').value;
    console.log(textArea);
    
    var myHeaders = new Headers();

    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      uid: userInfo.userID,
      report: textArea
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
    <form>
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
              <a href='#' className='hover:underline'>
                {user.name}
              </a>
            </p>
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
          </div>
          <div className='flex flex-shrink-0  space-x-3 self-center'>
            <a
              href='account/RatingForm'
              className='ml-6 inline-flex items-center rounded-md border border-transparent bg-orange-400 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2'
            >
                  Leave Rating
                  <StarIcon className='ml-2 -mr-1 h-5 w-5' aria-hidden='true' user={user.userID}/>
            </a>
            <button
              onClick={() => setReportModal(true)}
              type='button'
              className='inline-flex items-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2'
            >
              Report
              <FlagIcon className='ml-2 -mr-1 h-5 w-5' aria-hidden='true' />
            </button>
          </div>
        </div>
      </div>


      <DeactivateModal
        isVisible={showReportModal}
        onClose={() => setReportModal(false)}
      >
        <div>
          <div className='mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10'>
            <FlagIcon
              className='h-6 w-6 text-red-600'
              aria-hidden='true'
            />
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
                  id="report"
                  name="report"
                  rows={4}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={''}
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
    </form>
  );
}
