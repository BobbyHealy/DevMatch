import { useEffect, useState } from "react";
import UserComponent from "@/components/UserComponent";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

import { useAuth } from "@/context/AuthContext";
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
      updateDoc(doc(db, "users", user.uid), {
        currentProjPage: "#Explore",
      });
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
    <div className='mx-auto max-w-7xl sm:px-6 lg:px-8 pt-4 bg-gray-100'>
      <div className='lg:max-w-lg pb-4'>
        <p className='text-base font-semibold leading-7 text-indigo-600'>
          Explore
        </p>
        <h1 className='mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
          Find the right match for {project.name}
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
