



import React, { Component, useState} from "react";
import { InputText } from 'primereact/inputtext';
function profile(){


  const [skills, setSkills] = useState(['TestSkill','TesSkill2'])
  const [projects, setProject] = useState(['Project','Project2'])
  const photo =
    "https://media.licdn.com/dms/image/C4D03AQHHZKUrMMhCsQ/profile-displayphoto-shrink_800_800/0/1610704750210?e=2147483647&v=beta&t=OHuErweO0MQ3CeXJlSKkBpu-FOxPQh1sjcuVOQVTZb8";
  const userName = "Auden Huang";
  const userID = "001"
  const email = "huan1908@purdue.edu"
  const year = "Senior";
  // const [image, setimage] = useState("")
  const skillList = skills.map((skill) => <li>{skill}</li>);
  const projectList = projects.map((p) => <li>{p}</li>);
  return (
    <div class="relative">
      <div className=" fixed top-0 left-0 right-0 h-full bg-white">
              <div className="profile_img text-center p-4">
          <div className="flex justify-center items-center">
            <img
            style={{
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              objectFit:"cover",
              border: "4px solid blue"
            }}
            src={photo} alt=""/>

          {/* <div className="name"> Name: {userName}</div> 
          <div className="year"> Year: {year}</div>  */}
          </div>
          <div className="upload text-center p-4">
          <InputText type = "file" 
              accept="/image/*"
              onChange={(event)=>{
                const file = event.target.files[0];
                setimage(file)
                // if(file&& file.type.substring(0,5)==="image"){
                //   setimage(file)
                // }else
                // {
                //   setimage(photo)
                // }
              }}
              />
          </div>
        </div>
        <a
              href='/account/updateProfile'
              className='font-medium text-indigo-600 hover:text-indigo-500'
            >
              edit
            </a>
        <div className="username text-center p-4">
        <label htmlFor="" className="mt-3 font-sembold text-5xl">{userName}</label>
        </div>
        <div className="text-center p-4">
          <div>ID: {userID}</div>
          <div>Email: {email}</div>
          <div>Year: {year}</div>
          <div>
            <div className="font-bold">Skills</div>
            <div>{skillList}</div>
          </div>
          <div>
            <div className="font-bold">Projects</div>
            <div>{projectList}</div>
          </div>
        </div>
      </div>
    </div>
    //ToDo: add edit profile button and function
  );
}
export default profile

