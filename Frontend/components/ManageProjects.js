import React, { useEffect, useRef, useState } from "react";
import Input from "./Input";
import Router from "next/router";
import { useAuth } from "@/context/AuthContext";
import { resolve } from "styled-jsx/css";
import {doc,updateDoc,} from "firebase/firestore";
import { db } from "@/config/firebase";




export default function ManageProjects() {

    const { user, userInfo } = useAuth();
    const [completeUser, setCompleteUser] = useState({});
    const [currProj, setCurrProj] = useState([]);
    const [timesChanged, setTimesChanged] = useState(0);
    const [projects, setProjects]=useState([])
    const [owner, setOwner]=useState("")
    const [members, setMembers]=useState([]);
    useEffect(() => {
        updateDoc(doc(db, "users", user.uid), {
          currentPage:"Manage Projects",
          currentProjPage:"#Overview"
        })
      }, [user.uid])
    useEffect(() => {
        if (user === null && userInfo === null) {
        } else if (userInfo === null) {
            setCompleteUser({
            userID: user.userID !== undefined ? user.userID : "",
            name: "Foo Bar",
            email: user.email !== undefined ? user.email : "foo@bar.com",
            rating: 100,
            profilePic: "",
            pOwned: [],
            pJoined: [],
            skills: [],
            });
        } else {
            setCompleteUser({
            userID: user.userID !== undefined ? user.userID : "",
            name: userInfo.name !== undefined ? userInfo.name : "Foo Bar",
            email: user.email !== undefined ? user.email : "foo@bar.com",
            rating: userInfo.rating !== undefined ? userInfo.rating : 100,
            profilePic:
                userInfo.profilePic !== undefined ? userInfo.profilePic : "",
            pOwned: userInfo.pOwned !== undefined ? userInfo.pOwned : [],
            pJoined: userInfo.pJoined !== undefined ? userInfo.pJoined : [],
            skills: userInfo.skills !== undefined ? userInfo.skills : [],
            });
        }
    }, [user, userInfo]);

    function getMembers(project){
        const cmdPromises =project.owners.map((owner)=>{
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({
            userID: owner.userID,
        });
        var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        };

        return new Promise((resolve, reject) => {
        fetch("http://localhost:3000/api/getUsers", requestOptions)
            .then((response) => response.text())
            .then((result) => resolve(JSON.parse(result)))
            .catch((err) => {
            reject(err);
            });
        });
        }
    
    )}
    

    const exec = async (projectId) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
        pid: projectId,
    });
    var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
    };
    fetch("http://localhost:3000/api/getProject", requestOptions);
    };

    useEffect(() => {
    if (completeUser.pOwned !== null && timesChanged < 3) {
        if (completeUser.pOwned !== undefined) {
        const cmdPromises = completeUser.pOwned.map((projectId) => {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            var raw = JSON.stringify({
            pid: projectId,
            });
            var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            };

            return new Promise((resolve, reject) => {
            fetch("http://localhost:3000/api/getProject", requestOptions)
                .then((response) => response.text())
                .then((result) => resolve(JSON.parse(result)))
                .catch((err) => {
                reject(err);
                });
            });
        });

        Promise.allSettled(cmdPromises).then((results) => {
            setCurrProj(
            results.map((e) => {
                return e.value;
            })
            );
            setTimesChanged(timesChanged + 1);
        });
        }
    }
    }, [completeUser, userInfo]);
    const fetchProjects  = async () => 
    {
        console.log(projects)
        if(currProj){
            currProj.map(async (project)=>{
                await getOwner(project.owners);
                await getMem(project.tmembers);
                const proj ={
                    pid: project.pid,
                    name: project.name,
                    owner,
                    members,
                    des: project.projectDes,
                    skills: project.skills
                }
                addProj(proj)
                setOwner("")
                setMembers([])
            })
        }
     
    }
    function addProj(proj){
        
        if(projects!==null)
        {
            var newList = [...projects,proj]
            setProjects(newList)
        }else
        {
            setProjects([proj])
        }
    }

    useEffect(() => {

    }, [currProj]);

    function getOwner(id){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({
            userID: id,
        });
        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
        };
        fetch("http://localhost:3000/api/getUser", requestOptions)
          .then((response) => response.text())
          .then((result) => 
          {
            setOwner(JSON.parse(result).name)
        }
          )
          .catch((err) => {
            console.log(err);
          });

    }
    function addMember(name){
        
        if(members!==null)
        {
            var newList = [...members,name]
            setMembers(newList)
        }else
        {
            setMembers([name])
        }
      }
    function getMem(ids){
        ids.map((id)=>{
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            var raw = JSON.stringify({
                userID: id,
            });
            var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            };
            fetch("http://localhost:3000/api/getUser", requestOptions)
            .then((response) => response.text())
            .then((result) => 
            {
                addMember(JSON.parse(result).name)
            }
            )
            .catch((err) => {
                console.log(err);
            });

        })
        

    }

    
    const redirectToProject = (id) => {
    // Router.push("./projctSpace"+id);
    Router.push(`/project?pid=${id}`);
    };

    
    return (
        <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">Projects</h1>
            <p className="mt-2 text-sm text-gray-700">
                A list of all projects that you owned
            </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
                type="button"
                className="block rounded-md bg-indigo-600 py-1.5 px-3 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={()=>{Router.push("../../project/create")}}
            >
                Add Projects
            </button>
            </div>
        </div>
        <div className="mt-8 flow-root">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                <thead>
                    <tr>
                    <th
                        scope="col"
                        className="py-3 pl-4 pr-12 text-left text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-0"
                    >
                    </th>
   
                    <th
                        scope="col"
                        className="py-3 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-0"
                    >
                        Name
                    </th>
                    <th
                        scope="col"
                        className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                    >
                        Owner
                    </th>
                    <th
                        scope="col"
                        className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                    >
                        Members
                    </th>
                    <th
                        scope="col"
                        className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                    >
                        Description
                    </th>
                    <th
                        scope="col"
                        className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                    >
                        Require Skills
                    </th>
                    <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-0">
                        <span className="sr-only">leave</span>
                        <span className="sr-only">Edit</span>
                    </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {currProj.map((project) => (
                    <tr >
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-0">
                        <img className = "bg-white h-8 w-8 rounded-full object-cover"src={project.projectProfile}/>
                        </td>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        {project.name}
                        </td>
                        <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                        {project.owners}
                    
                       </td>
                        <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                        {project.tmembers.map((
                        
                            
                            
                            member)=>
                        (<li key={member}>{member}</li>))}
                        </td>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-500 sm:pl-0">
                        {project.projectDes}
                        </td>
                        <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                        {project.skills.map((skill)=>
                        (<li key={skill}>{skill}</li>))}
                        </td>

                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 ">
                        <a href="#" className="text-indigo-600 hover:text-indigo-900"
                        onClick={() => redirectToProject(project.pid)}>
                            Edit<span className="sr-only">, {project.name}</span>
                        </a>
                        <a href="#" className="text-red-600 hover:text-indigo-900 p-2">
                            Remove<span className="sr-only">, {project.name}</span>
                        </a>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>
        </div>
        </div>
    )   
}


 
//   const dragOverItem = useRef();
//   const dragItem = useRef();
//   const dragStart = (e, position) => {
//     dragItem.current = position;
//     // console.log(e.target.innerHTML);
//   };
//   const dragEnter = (e, position) => {
//     dragOverItem.current = position;
//     // console.log(e.target.innerHTML);
//   };
//   const drop = (e) => {
//     const copyProjects = [...currProj];
//     const dragItemContent = copyProjects[dragItem.current];
//     copyProjects.splice(dragItem.current, 1);
//     copyProjects.splice(dragOverItem.current, 0, dragItemContent);
//     dragItem.current = null;
//     dragOverItem.current = null;
//     setCurrProj(copyProjects)}
