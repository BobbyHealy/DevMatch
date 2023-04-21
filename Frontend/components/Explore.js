import { useEffect, useState } from "react";
import UserComponent from "@/components/UserComponent";
import PreferenceFilter from "./Preference";

import { useAuth } from "@/context/AuthContext";
import { switchProjPage } from "@/fireStoreBE/User";
import ProjectPreference from "./ProjectPreference";
export default function Explore({ project }) {
  const [posts, setPosts] = useState(null);
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
    if (user.uid) {
      switchProjPage(user.uid, "#Explore");
    }
  }, []);

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      project: false,
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

  return (
    <div className='bg-gray-100'>
      <div className='px-4 pb-4'>
        <p className='text-base font-semibold leading-7 text-indigo-600'>
          Explore
        </p>
        <h1 className='mt-2 text-3xl font-bold tracking-tight text-gray-900'>
          {/* <PreferenceFilter project={project} /> */}
          <ProjectPreference
            isFeed={false}
            message={`Find the right fit for ${project.name}`}
            setSearchSettings={setSearchSettings}
          />
        </h1>
      </div>
      {posts &&
        posts.map((e, i) => {
          return (
            e.userID !== user.uid && (
              <div key={e.toString() + i} className='pb-6'>
                <UserComponent user={e} inviteProjectID={project.pid} />
              </div>
            )
          );
        })}
    </div>
  );
}
