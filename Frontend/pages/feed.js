import { Fragment, useEffect, useState } from "react";
import { Menu, Popover, Switch, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import UserComponent from "@/components/UserComponent";
import ProjComponent from "@/components/ProjectComponent";
import Router from "next/router";
import ProjectDashBoard from "@/components/projectDashBoard";
import Header from "@/components/header";
import { projectExamplesArray } from "@/mockup_data/project_array";
import { userExampleArray } from "@/mockup_data/user_array";
import {doc,updateDoc,} from "firebase/firestore";
import { db } from "@/config/firebase";
import { useAuth } from "@/context/AuthContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Feed() {
  const [posts, setPosts] = useState(null);
  const [enabled, setEnabled] = useState(false);
  const{user, userInfo}=useAuth();
  useEffect(() => {
    if(user.uid)
    {
      updateDoc(doc(db, "users", user.uid), {
        currentPage:"Overview",
        currentProjPage:"#Overview"
      })
    }
  }, [])

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    project: true,
    limit: 21,
  });

  var raw2 = JSON.stringify({
    project: false,
    limit: 21,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  var requestOptions2 = {
    method: "POST",
    headers: myHeaders,
    body: raw2,
    redirect: "follow",
  };

  useEffect(() => {
    if (enabled) {
      setPosts(null);
      fetch("http://localhost:3000/api/getSearch", requestOptions2)
        .then((response) => response.text())
        .then((result) => {
          setPosts(
            Object.entries(JSON.parse(result)).map((e) => {
              const obj = JSON.parse(JSON.stringify(e[1]));
              obj.pid = e[0];
              return obj;
            })
          );
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setPosts(null);
      fetch("http://localhost:3000/api/getSearch", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          setPosts(
            Object.entries(JSON.parse(result)).map((e) => {
              const obj = JSON.parse(JSON.stringify(e[1]));
              obj.pid = e[0];
              return obj;
            })
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [enabled]);

  useEffect(() => {
    console.log(posts);
  }, [posts]);

  return (
    <div className='min-h-screen bg-gray-100'>
      <div className='sticky top-0 z-30'>
        <Header />
      </div>

      <div className='py-6'>
        <div className='mx-auto max-w-3xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-8 lg:px-8'>
          <div className='hidden lg:col-span-3 lg:block xl:col-span-2'>
            <nav
              aria-label='Sidebar'
              className='sticky top-6 divide-y divide-gray-300'
            >
              {/* Left */}
              Looking for Users?
              <Switch
                checked={enabled}
                onChange={setEnabled}
                className={classNames(
                  enabled ? "bg-indigo-600" : "bg-gray-200",
                  "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                )}
              >
                <span className='sr-only'>Use setting</span>
                <span
                  aria-hidden='true'
                  className={classNames(
                    enabled ? "translate-x-5" : "translate-x-0",
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  )}
                />
              </Switch>
            </nav>
          </div>
          <main className='lg:col-span-9 xl:col-span-6'>
            {/* Update this to use API + map to generate a bunch of enties of either User or Project components */}
            {/* ProjComponent on feed example */}
            {userInfo.pJoined&&posts !== null && !enabled ? (
              posts.map((e, i) => {
                return (

                  e.owners&&!e.owners.includes(user.uid)&&!userInfo.pJoined.includes(e.pid)&&
                  <div key={e.toString() + i} className='pb-6'>
                    <ProjComponent project={e} />
                  </div>
                );
              })
            ) : (
              <></>
            )}
             {!userInfo.pJoined&&posts !== null && !enabled ? (
              posts.map((e, i) => {
                return (

                  e.owners&&!e.owners.includes(user.uid)&&
                  <div key={e.toString() + i} className='pb-6'>
                    <ProjComponent project={e} />
                  </div>
                );
              })
            ) : (
              <></>
            )}
            {/* UserComponent on feed example */}
            {posts !== null && enabled ? (
              posts.map((e, i) => {
                return (
                  e.userID!==user.uid&&
                  <div key={e.toString() + i} className='pb-6'>
                    <UserComponent user={e} />
                  </div>
                );
              })
            ) : (
              <></>
            )}
          </main>
          <aside className='hidden xl:col-span-4 xl:block'>
            <div className='sticky top-6 space-y-4 h-full'>
              {/* Right */}
              <div className='sticky top-24 z-30'>
                <ProjectDashBoard />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
