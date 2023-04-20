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
      uid: user.userID,
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
                <StarIcon className='ml-2 -mr-1 h-5 w-5' aria-hidden='true' />
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
  );
}
