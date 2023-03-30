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

export default function UserComponent(props) {
  const { user = default_user, inviteProjectID = null } = props;
  const { userInfo } = useAuth();
  const combinedId =
    userInfo.userID > user.userID
      ? userInfo.userID +"-"+ user.userID
      : user.userID +"-"+ userInfo.userID;

  const inviteMessage = `Come join the project! here is the link: http://localhost:3000/project?pid=${inviteProjectID}`;
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

  const handleInvite = async () => {
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
      const msgID = uuid();
      await updateDoc(doc(db, "chats", combinedId), {
        messages: arrayUnion({
          id: msgID,
          text: inviteMessage,
          senderId: userInfo.userID,
          date: Timestamp.now(),
        }),
      });
      await updateDoc(doc(db, "userChats", userInfo.userID), {
        [combinedId + ".lastMessage"]: {
          text: inviteMessage,
        },
        [combinedId + ".date"]: serverTimestamp(),
      });

      await updateDoc(doc(db, "userChats", user.userID), {
        [combinedId + ".lastMessage"]: {
          text: inviteMessage,
        },
        [combinedId + ".date"]: serverTimestamp(),
      });

      Router.push("/account");
    } catch (err) {
      console.log("THERE WAS AN ERROR " + err);
    }
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
          <div className='text-sm text-gray-500'>
            <a href='#' className='hover:underline'>
              Skill List:{" "}
              {user.skills !== undefined
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
        <div className='flex flex-shrink-0 self-center'>
          {inviteProjectID === null ? (
            <button
              onClick={handleSelect}
              type='button'
              className='inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
            >
              Message
              <EnvelopeIcon className='ml-2 -mr-1 h-5 w-5' aria-hidden='true' />
            </button>
          ) : (
            <button
              onClick={handleInvite}
              type='button'
              className='inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
            >
              Invite to Project
              <EnvelopeIcon className='ml-2 -mr-1 h-5 w-5' aria-hidden='true' />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
