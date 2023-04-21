import { Fragment, useEffect, useState } from "react";
import { Menu, Popover, Switch, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import UserComponent from "@/components/UserComponent";
import ProjComponent from "@/components/ProjectComponent";
import Router from "next/router";
import ProjectDashBoard from "@/components/ProjectDashBoard";
import Header from "@/components/header";
import { projectExamplesArray } from "@/mockup_data/project_array";
import { userExampleArray } from "@/mockup_data/user_array";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useAuth } from "@/context/AuthContext";
import PreferenceFilter from "@/components/Preference";
import ProjectPreference from "@/components/ProjectPreference";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function refreshPage() {
  window.location.reload(false);
}

export default function Feed() {
  const [posts, setPosts] = useState(null);
  const [enabled, setEnabled] = useState(false);
  const [skillArr, setSkillArr] = useState([""]);
  const [searchName, setSearchName] = useState("");
  const [searchSettings, setSearchSettings] = useState({
    project: false,
    limit: 10,
    ignore: [""],
    skills: [""],
    name: "",
    rating: false,
    time: false,
    userTime: "",
    type: "",
    recent: true,
  });
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      Router.push("/account/login");
    } else {
      if (user.uid) {
        updateDoc(doc(db, "users", user.uid), {
          currentPage: "Overview",
          currentProjPage: "#Overview",
        });
      }
      //refreshPage()
    }
  }, []);

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      project: searchSettings.project,
      limit: searchSettings.limit,
      ignore: searchSettings.ignore != undefined ? searchSettings.ignore : [""],
      skills: searchSettings.skills != undefined ? searchSettings.skills : [""],
      name: searchSettings.name,
      rating: searchSettings.rating,
      time: searchSettings.time,
      userTime: searchSettings.userTime,
      type: searchSettings.type,
      recent: true,
    });

    var requestOptions2 = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    setPosts(null);

    fetch("http://localhost:3000/api/getSearchFilter", requestOptions2)
      .then((response) => response.text())
      .then((result) => {
        const resultArr = JSON.parse(result)[0];
        if (resultArr[0] !== null) {
          setPosts(resultArr);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [searchSettings]);

  useEffect(() => {
    console.log(posts);
  }, [posts]);

  const updateSeachName = (name) => {
    setSearchName(name);
  };

  return (
    <div className='min-h-screen bg-gray-100'>
      <div className='sticky top-0 z-30'>
        <Header updateSeachName={updateSeachName} />
        <ProjectPreference
          enabled={enabled}
          setEnabled={setEnabled}
          isFeed={true}
          setSearchSettings={setSearchSettings}
        />
      </div>

      {user && (
        <div className='py-6'>
          <div className='mx-auto max-w-3xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-8 lg:px-8'>
            <div className='hidden lg:col-span-3 lg:block xl:col-span-2'>
              <nav
                aria-label='Sidebar'
                className='sticky top-6 divide-y divide-gray-300'
              ></nav>
            </div>
            <main className='lg:col-span-9 xl:col-span-6'>
              {/* Update this to use API + map to generate a bunch of enties of either User or Project components */}
              {/* ProjComponent on feed example */}
              {posts !== null && searchSettings.project ? (
                posts
                  .filter((e) =>
                    searchName == ""
                      ? true
                      : e.name.toLowerCase().includes(searchName.toLowerCase())
                  )
                  .map((e, i) => {
                    return (
                      e.owners &&
                      !e.owners.includes(user.uid) &&
                      !e.tmembers.includes(user.uid) && (
                        <div key={e.toString() + i} className='pb-6'>
                          <ProjComponent project={e} />
                        </div>
                      )
                    );
                  })
              ) : (
                <></>
              )}
              {/* UserComponent on feed example */}
              {posts !== null && !searchSettings.project ? (
                posts
                  .filter((e) =>
                    searchName == ""
                      ? true
                      : e.name.toLowerCase().includes(searchName.toLowerCase())
                  )
                  .map((e, i) => {
                    return (
                      e.userID !== user.uid && (
                        <div key={e.toString() + i} className='pb-6'>
                          <UserComponent user={e} />
                        </div>
                      )
                    );
                  })
              ) : (
                <></>
              )}
            </main>
            <aside className='hidden xl:col-span-4 xl:block'>
              <div className='sticky top-6 space-y-4 h-full'>
                {/* Right */}
                <div className='sticky top-24'>
                  <ProjectDashBoard />
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}
