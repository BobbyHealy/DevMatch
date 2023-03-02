import React, { useContext, useEffect, useState } from "react";
import Router from "next/router";

export default function () {
  const currentUser = {
    id: 1,
    name: "Auden",
    imageUrl:
      "https://media.licdn.com/dms/image/C4D03AQHHZKUrMMhCsQ/profile-displayphoto-shrink_800_800/0/1610704750210?e=2147483647&v=beta&t=OHuErweO0MQ3CeXJlSKkBpu-FOxPQh1sjcuVOQVTZb8",
  };
  const proj = {
    name: "DevMatch",
    owner: "John Doe",
    description: "Description",
    avatar: "https://logopond.com/avatar/257420/logopond.png",
    banner:
      "https://cdn.pixabay.com/photo/2015/11/19/08/52/banner-1050629__340.jpg",
    banner2:
      "https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
  };

  const [project, setProject] = useState(null);
  const [searchName, setSearchname] = useState("");
  const [err, setErr] = useState(false);
  const handleSearch = () => {
    try {
      if (searchName === proj.name) {
        setProject(proj);
      }
    } catch (err) {
      setErr(true);
    }
  };
  const handleKey = (e) => {
    setProject(null);
    e.code === "Enter" && handleSearch();
  };
  const redirectToProject = (id) => {
    // Router.push("./projctSpace"+id);
    Router.push("/projectSpace");
  };
  const handleSelect = async () => {
    //  Check whether the DM exist in the firebase. if not create new one
    // try{
    //     const res = await getDoc(doc(db,"DMs", combinedID))
    //     if(!res.exists()){
    //         // create DM
    //         await setDoc(doc,(db, "DMs", combinedID,{messages:[]}))

    //         //creat userDMS
    //         await setDoc(doc,(db, "userDMs", currentUser.id),{
    //             [combinedID+".userInfo"]:{
    //                 id:user.id,
    //                 name: user.name,
    //                 imageUrl: user.imageUrl
    //             },
    //             [combinedId+".date"]: serverTimestamp()
    //         });
    //         await setDoc(doc,(db, "userDMs", user.id),{
    //             [combinedID+".userInfo"]:{
    //                 id:currentUser.id,
    //                 name: currentUser.name,
    //                 imageUrl: currentUser.imageUrl
    //             },
    //             [combinedId+".date"]: serverTimestamp()
    //         });
    //     }
    // }catch(err)
    // {

    // }
    try {
    } catch (err) {}
    redirectToProject();
    setProject(null);
    setSearchname("");
  };

  return (
    <div className='border-b-2 border-gray-400'>
      <div className='p-2'>
        <input
          type='text'
          className='bg-transparent border-none outline-none text-white placeholder-gray-300'
          placeholder='Search for Project'
          onChange={(e) => setSearchname(e.target.value)}
          onKeyDown={handleKey}
        />
      </div>
      {err && <span>Project Not Found!</span>}
      {project && (
        <div
          className='uflex p-2 items-center gap-2 hover:bg-blue-600'
          onClick={handleSelect}
        >
          <img
            src={proj.avatar}
            className='bg-white h-6 w-6 rounded-full'
          ></img>
          <div className=''>
            <span className='text-lg font-medium'>{proj.name}</span>
            <p className='text-sm text-gray-100'>{proj.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}
