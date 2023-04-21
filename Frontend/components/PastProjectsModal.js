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

export default function PastProjectModal({ showPast, setShowPast, uid }) {
  const [pastProjects, setPastProjects] = useState([]);
  const [projList, setProjList] = useState([]);

  const getPastProjects = async (uid) => {
    console.log("UID: " + uid);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      uid: uid,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    return await new Promise((resolve, reject) => {
      fetch("http://localhost:3000/api/getPastProjects", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          //   console.log(result);
          resolve(JSON.parse(result));
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const getProject = async (pid) => {
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

    return await new Promise((resolve, reject) => {
      fetch("http://localhost:3000/api/getProject", requestOptions)
        .then((response) => response.text())
        .then((result) => resolve(JSON.parse(result)))
        .catch((err) => {
          reject(err);
        });
    });
  };

  useEffect(() => {
    if (showPast && pastProjects.length === 0) {
      getPastProjects(uid).then((result) => {
        if (result !== null) {
          console.log(result);
          setPastProjects(result);
        }
      });
    }
  }, [showPast]);

  useEffect(() => {
    async function updateState() {
      const data = await Promise.all(
        pastProjects.map((proj) => getProject(proj))
      );
      setProjList((oldArray) => [...oldArray, ...data]);
    }

    updateState();
  }, [pastProjects]);

  return (
    <DeactivateModal isVisible={showPast} onClose={() => setShowPast(false)}>
      <div>
        <p className='font-bold'>User's past projects:</p>
        <div>
          {projList.map((e) => {
            return (
              <div>
                <h3 className='text-xl text-gray-600'>{e.name}</h3>
                <p className='text-l text-gray-600'>{e.skills.join(",")}</p>
              </div>
            );
          })}
        </div>
      </div>
    </DeactivateModal>
  );
}
