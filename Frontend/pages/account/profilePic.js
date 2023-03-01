import React, { Component, useState } from "react";
import { InputText } from "primereact/inputtext";
import Router from "next/router";

const user = {
  name: "Auden Huang",
  imageUrl:
    "https://media.licdn.com/dms/image/C4D03AQHHZKUrMMhCsQ/profile-displayphoto-shrink_800_800/0/1610704750210?e=2147483647&v=beta&t=OHuErweO0MQ3CeXJlSKkBpu-FOxPQh1sjcuVOQVTZb8",
};

function profilePic() {
    const redirectToProfile= () => {
        Router.push('./');
    }
    const handleSubmit=()=>{
        // update firebase
        Router.push('./');
    }
  return (
    <div className="relative">
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
                src={user.imageUrl} alt=""/>

            {/* <div className="name"> Name: {userName}</div> 
                <div className="year"> Year: {year}</div>  */}
                </div>
                <div className="upload text-center p-4">
                <InputText type = "file" 
                    accept="*.jpg"
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
                    <button className="rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={handleSubmit}
                    >Submit</button>
                    <button className="rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={()=> redirectToProfile()}
                    >Cancel</button>

                </div>
            </div>
        </div>
      </div>
  );
}

export default profilePic;
