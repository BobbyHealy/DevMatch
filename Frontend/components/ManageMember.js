import { useEffect, useState } from "react";
import UserComponent from "@/components/UserComponent";

import { useAuth } from "@/context/AuthContext";
import { switchProjPage } from "@/fireStoreBE/User";
import ReportDetail from "./ReportDetail";

export default function ManageMember({ pid, project }) {
  const [members, setMembers] = useState([]);
  const [load, setload] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user.uid) {
      switchProjPage(user.uid, "#Manage");
    }
  }, []);

  useEffect(() => {
    if (!load && project.owners) {
      setload(true);
      var members = [];
      project.tmembers.map((mem) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({
          userID: mem,
        });
        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
        };
        fetch("http://localhost:3000/api/getUser", requestOptions)
          .then((response) => response.text())
          .then((result) => {
            var requestOptions = {
              method: "GET",
              redirect: "follow",
            };
            var raw = JSON.stringify({
              pid: project.pid,
              uid: JSON.parse(result).userID,
            });
            var requestOptions = {
              method: "POST",
              headers: myHeaders,
              body: raw,
            };
            fetch("http://localhost:3000/api/getRole", requestOptions)
              .then((response1) => response1.text())
              .then((result1) => {
                const tmp = { role: JSON.parse(result1) };
                const memberAndRole = { ...tmp, ...JSON.parse(result) };
                members.push(memberAndRole);
                if (project.tmembers.length === members.length) {
                  setMembers(members);
                }
              })
              .catch((error) => console.log("error", error));
          })
          .catch((err) => {
            console.log(err);
          });
      });
    }
  }, [project]);

  return (
    <div className='mx-auto max-w-7xl sm:px-6 lg:px-8 pt-4 bg-gray-100'>
      <div className='lg:max-w-lg pb-4'>
        <p className='text-base font-semibold leading-7 text-black-600'>
          Members of {project.name}:
        </p>
      </div>
      {members &&
        members.map((e, i) => {
          console.log("CONTENTS OF E:");
          console.log(e);
          return (
            e.userID !== user.uid && (
              <div key={e.toString() + i} className='pb-6'>
                <UserComponent user={e}  role={true} pid={project.pid}/>
              </div>
            )

        ))}

      <div className="py-1">
        <h1 className="">Reported Users: </h1>
      </div>

      {members &&
        members.map((u,i) => (
            u.userID !== user.uid && u.reports !== null &&(
              <div className="py-1">
                <ReportDetail name={u}/>
              </div>
            )
        ))}
    </div>
  );
}
