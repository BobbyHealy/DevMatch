import React, { useEffect, useRef, useState } from "react";
import Router from "next/router";
import { useAuth } from "@/context/AuthContext";

export default function Projects() {
  const { user, userInfo } = useAuth();
  const proj1 = {
    index: 1,
    name: "DevMatch1",
    owner: "John Doe",
    description: "Description",
    avatar: "https://logopond.com/avatar/257420/logopond.png",
    banner:
      "https://cdn.pixabay.com/photo/2015/11/19/08/52/banner-1050629__340.jpg",
    banner2:
      "https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
  };
  const proj2 = {
    index: 2,
    name: "DevMatch2",
    owner: "John Doe",
    description: "Description",
    avatar: "https://logopond.com/avatar/257420/logopond.png",
    banner:
      "https://cdn.pixabay.com/photo/2015/11/19/08/52/banner-1050629__340.jpg",
    banner2:
      "https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
  };
  //   const [projects, setProjects] = useState([proj1, proj2]);
  const [completeUser, setCompleteUser] = useState({});
  const [currProj, setCurrProj] = useState({ projects: [] });
  const [timesChanged, setTimesChanged] = useState(0);

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

  useEffect(() => {
    if (completeUser.pOwned !== undefined && timesChanged == 0) {
      const arr = [...completeUser.pOwned];
      completeUser.pOwned.forEach((e, i) => {
        // console.log("THIS IS HAPPENING " + i);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          pid: e,
        });

        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
        };

        fetch("http://localhost:3000/api/getProject", requestOptions)
          .then((response) => response.text())
          .then((result) => {
            arr[i] = JSON.parse(result);
          })
          .catch((error) => console.log("error", error));
      });
      console.log(JSON.stringify(arr));
      setCurrProj({ projects: arr });
    }
  }, [completeUser]);

  useEffect(() => {
    console.log(JSON.stringify(currProj));
  }, [currProj]);

  const redirectToProject = (id) => {
    // Router.push("./projctSpace"+id);
    Router.push("/projectSpace");
  };
  const dragOverItem = useRef();
  const dragItem = useRef();
  const dragStart = (e, position) => {
    dragItem.current = position;
    // console.log(e.target.innerHTML);
  };
  const dragEnter = (e, position) => {
    dragOverItem.current = position;
    // console.log(e.target.innerHTML);
  };
  const drop = (e) => {
    const copyProjects = [...projects];
    const dragItemContent = copyProjects[dragItem.current];
    copyProjects.splice(dragItem.current, 1);
    copyProjects.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setProjects(copyProjects);
  };
  return (
    <div className=''>
      {currProj.projects.map((project, index) => {
        // console.log("PRoject:");
        // console.log(currProj.projects);
        return (
          <div
            className='flex p-2 items-center gap-2 hover:bg-blue-600'
            onClick={redirectToProject}
            onDragStart={(e) => dragStart(e, index)}
            onDragEnter={(e) => dragEnter(e, index)}
            onDragEnd={drop}
            key={index}
            draggable
          >
            <img
              src={project.projectProfile}
              className='bg-white h-6 w-6 rounded-full object-cover'
            ></img>
            <div className='info'>
              <span className='text-lg font-medium'>{project.name}</span>
              <p className='text-sm text-gray-100'>{project.skills}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
