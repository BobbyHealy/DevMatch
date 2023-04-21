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

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    project: !enabled,
    limit: 21,
  });

  var raw2 = JSON.stringify({
    project: !enabled,
    limit: 20,
    ignore: [""],
    skills: skillArr,
    name: "",
  });

  var requestOptions2 = {
    method: "POST",
    headers: myHeaders,
    body: raw2,
    redirect: "follow",
  };

  useEffect(() => {
    setPosts(null);

    fetch("http://localhost:3000/api/getSearchFilter", requestOptions2)
      .then((response) => response.text())
      .then((result) => {
        const resultArr = JSON.parse(result)[0];
        setPosts(resultArr);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [enabled, skillArr]);

  useEffect(() => {
    console.log(posts);
  }, [posts]);

  const skills = [
    { id: 1, name: "JavaScript" },
    { id: 2, name: "HTML" },
    { id: 3, name: "CSS" },
    { id: 4, name: "Java" },
    { id: 5, name: "C" },
    { id: 5, name: "C++" },
    { id: 5, name: "Go" },
  ];

  const defaultSkillsSelected = {
    JavaScript: false,
    HTML: false,
    CSS: false,
    Java: false,
    C: false,
    "C++": false,
    Go: false,
  };

  const [selectedSkills, setSelectedSkills] = useState(defaultSkillsSelected);

  useEffect(() => {
    const arr = createSkillArray();
    setSkillArr(arr.length > 0 ? arr : [""]);
  }, [selectedSkills]);

  const createSkillArray = () => {
    const arr = Object.entries(selectedSkills)
      .filter((e) => e[1])
      .map((e) => e[0]);
    return arr;
  };

  const updateSkill = (name, checked) => {
    const cpy = { ...selectedSkills };
    cpy[name] = checked;
    setSelectedSkills(cpy);
  };

  const updateSeachName = (name) => {
    setSearchName(name);
  };

  return (
    <div className='min-h-screen bg-gray-100'>
      <div className='sticky top-0 z-30'>
        <Header updateSeachName={updateSeachName} />
        <ProjectPreference/>
      </div>

      {user && (
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
              <fieldset>
                <legend className='text-base font-semibold leading-6 text-gray-900'>
                  Skills
                </legend>
                <div className='mt-4 divide-y divide-gray-200 border-b border-t border-gray-200'>
                  {skills.map((person, personIdx) => (
                    <div
                      key={personIdx}
                      className='relative flex items-start py-4'
                    >
                      <div className='min-w-0 flex-1 text-sm leading-6'>
                        <label
                          htmlFor={`person-${person.id}`}
                          className='select-none font-medium text-gray-900'
                        >
                          {person.name}
                        </label>
                      </div>
                      <div className='ml-3 flex h-6 items-center'>
                        <input
                          id={`person-${person.id}`}
                          name={`person-${person.id}`}
                          type='checkbox'
                          onChange={(e) =>
                            updateSkill(person.name, e.target.checked)
                          }
                          className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600'
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
            <main className='lg:col-span-9 xl:col-span-6'>
              {/* Update this to use API + map to generate a bunch of enties of either User or Project components */}
              {/* ProjComponent on feed example */}
              {posts && !enabled ? (
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
              {posts !== null && enabled ? (
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
