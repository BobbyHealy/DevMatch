



import React, { Component, useState} from "react";
import SkillList from "../SkillList/SkillList";
import { InputText } from 'primereact/inputtext';
function ProfilePage(){

  const [skills, setSkills] = useState(['TestSkill'])
  const photo =
    "https://media.licdn.com/dms/image/C4D03AQHHZKUrMMhCsQ/profile-displayphoto-shrink_800_800/0/1610704750210?e=2147483647&v=beta&t=OHuErweO0MQ3CeXJlSKkBpu-FOxPQh1sjcuVOQVTZb8";
  const userName = "Auden Huang";
  const year = "Senior";
  const [image, setimage] = useState("")

  return (
    <>
      <div className="profile_img text-center p-4">
        <div className="flex flex-column justify-content-center align-items-center">
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
      </div>
      <div className="upload text-center p-4">
      <InputText type = "file" 
          accept="/image/*"
          onChange={(event)=>{
            const file = event.target.files[0];
            if(file&& file.type.substring(0,5)==="image"){
              setimage(file)
            }else
            {
              setimage(photo)
            }
          }}
          />
         </div>
      <div className="username text-center p-4">
      <label htmlFor="" className="mt-3 font-sembold text-5xl">{userName}</label>
      </div>
      <div className="Skills text-center p-4">
      <SkillList skills = {skills}/>
      </div>
    </>
  );
}
export default ProfilePage

