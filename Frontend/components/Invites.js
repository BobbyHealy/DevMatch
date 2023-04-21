import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import ProjComponent from "./ProjectComponent";

export default function Invites(props) {
  const { user, userInfo } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [invites, setInvites] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    setIsLoaded(true);
    setInvites(userInfo.pending != null ? userInfo.pending : []);
  }, []);

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

  const handleAccept = async (uid, pid) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      pid: pid,
      uid: uid,
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    return await new Promise((resolve, reject) => {
      fetch("http://localhost:3000/api/acceptInvite", requestOptions)
        .then((response) => response.text())
        .then((result) => resolve(JSON.parse(result)))
        .catch((err) => {
          reject(err);
        });
    });
  };

  const handleReject = async (uid, pid) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      pid: pid,
      uid: uid,
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    return await new Promise((resolve, reject) => {
      fetch("http://localhost:3000/api/declineInvite", requestOptions)
        .then((response) => response.text())
        .then((result) => resolve(JSON.parse(result)))
        .catch((err) => {
          reject(err);
        });
    });
  };

  useEffect(() => {
    const projList = [];
    invites.forEach(async (element) => {
      getProject(element).then((res) => setProjects([...projects, res]));
    });
    setProjects(projList);
  }, [invites]);

  return (
    <div className='mt-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-3xl'>
        <ul role='list' className='divide-y divide-gray-100'>
          <h2 className='text-5xl'>Invites</h2>
          {isLoaded &&
            projects.map((proj) => {
              console.log(proj);
              return (
                <div key={proj}>
                  <ProjComponent
                    project={proj}
                    isInvite={true}
                    handleAccept={() => handleAccept(user.uid, proj.pid)}
                    handleReject={() => handleReject(user.uid, proj.pid)}
                  ></ProjComponent>
                </div>
              );
              //   <li
              //     key={person.email}
              //     className='flex justify-between gap-x-6 py-5'
              //   >
              //     <div className='flex gap-x-4'>
              //       <img
              //         className='h-12 w-12 flex-none rounded-full bg-gray-50'
              //         src={person.imageUrl}
              //         alt=''
              //       />
              //       <div className='min-w-0 flex-auto'>
              //         <p className='text-sm font-semibold leading-6 text-gray-900'>
              //           {person.name}
              //         </p>
              //         <p className='mt-1 truncate text-xs leading-5 text-gray-500'>
              //           {person.email}
              //         </p>
              //       </div>
              //     </div>
              //     <div className='hidden sm:flex sm:flex-col sm:items-end'>
              //       <p className='text-sm leading-6 text-gray-900'>
              //         {person.role}
              //       </p>
              //       {person.lastSeen ? (
              //         <p className='mt-1 text-xs leading-5 text-gray-500'>
              //           Last seen{" "}
              //           <time dateTime={person.lastSeenDateTime}>
              //             {person.lastSeen}
              //           </time>
              //         </p>
              //       ) : (
              //         <div className='mt-1 flex items-center gap-x-1.5'>
              //           <div className='flex-none rounded-full bg-emerald-500/20 p-1'>
              //             <div className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
              //           </div>
              //           <p className='text-xs leading-5 text-gray-500'>Online</p>
              //         </div>
              //       )}
              //     </div>
              //   </li>
            })}
        </ul>
      </div>
    </div>
  );
}
