import { useEffect, useState } from "react";
import UserComponent from "@/components/UserComponent";
import PreferenceFilter from "./Preference";

import { useAuth } from "@/context/AuthContext";
import { switchProjPage } from "@/fireStoreBE/User";
export default function Explore({ project }) {
  const [posts, setPosts] = useState(null);
  const { user } = useAuth();

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
    if (user.uid) {
      switchProjPage(user.uid, "#Explore")
    }
  }, []);

  useEffect(() => {
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
  }, []);

  useEffect(() => {}, [posts]);

  return (
    <div className='bg-gray-100'>
      <div className='px-4 pb-4'>
        <p className='text-base font-semibold leading-7 text-indigo-600'>
          Explore
        </p>
        <h1 className='mt-2 text-3xl font-bold tracking-tight text-gray-900'>
          <PreferenceFilter project={project}/>
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
