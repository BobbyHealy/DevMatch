import { useEffect, useState } from "react";
import UserComponent from "@/components/UserComponent";

import { useAuth } from "@/context/AuthContext";
import { switchProjPage } from "@/fireStoreBE/User";

export default function ManageMember({ project }) {
  const [posts, setPosts] = useState(null);
  const [members, setMembers] = useState([]);
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
      switchProjPage(user.uid, "#Manage")
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
        <p className='text-base font-semibold leading-7 text-black-600'>
          Members of {project.name}:
        </p>
      </div>
      {posts &&
        posts.map((e, i) => {
          return (
            e.userID !== user.uid && (
              <div key={e.toString() + i} className='pb-6'>
                <UserComponent user={e} inviteProjectID = {null} removeID={project.pid} />
              </div>
            )
          );
        })}
    </div>
  );
}
