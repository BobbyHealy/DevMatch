import React, { Component, useState } from "react";
import { InputText } from "primereact/inputtext";
import Router from "next/router";
import { useEffect } from "react";
import { storage } from "@/config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/context/AuthContext";


function profilePic() {
    const[image, setimage] = useState(null)
    const[url, setUrl] = useState(null)
    const { user, login, logout, userInfo } = useAuth();
    const redirectToProfile= () => {
 
        Router.push('./');
    }
    const handleSubmit=()=>{
        // update firebase
        var imageRef = ref(storage, userInfo.name+"ProfilePic")
        uploadBytes(imageRef, image)
        .then(() => {
            getDownloadURL(imageRef)
            .then((url) => {
                setUrl(url)
                var raw = JSON.stringify({
                    userID: user.uid,
                    name: userInfo.name,
                    rating: 100,
                    skills: userInfo.skills!== undefined ? userInfo.skills: undefined,
                    pOwned: userInfo.pOwned !== undefined ?  userInfo.pOwned : undefined,
                    pJoined: userInfo.pJoined !== undefined ?  userInfo.pOwned : undefined,
                    profilePic: url,
                  });
                  
                  var myHeaders = new Headers();
                  myHeaders.append("Content-Type", "application/json");
              
                  var requestOptions = {
                    method: "POST",
                    headers: myHeaders,
                    body: raw,
                  };
              
                  fetch("http://localhost:3000/api/addUser", requestOptions)
                    .then((response) => response.text())
                    .then((result) => {
                      console.log(result);
                    })
                    .catch((error) => console.log("error", error));
                redirectToProfile()
               
            })
            .catch((error) => {
                console.log(error.message, "error getting the image url");
            });
            setimage(null);
    
        })
        .catch((error) => {
            console.log(error.message);
        });
        

    }
    useEffect(() => {
        if (!image) {
            setUrl(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(image)
        setUrl(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [image])
   
  return (
    <div className="relative">
        <div className=" fixed top-0 left-0 right-0 h-full bg-white">
            <div className="profile_img text-center p-4">
                <div className="flex justify-center items-center">
                {image&&<img
                style={{
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                    objectFit:"cover",
                    border: "4px solid blue"
                }}
                src={url} alt=""/>}
                </div>
                <div className="upload text-center p-4">
                <InputText type = "file" 
                    accept="*.jpg"
                    onChange={(event)=>{
                    const file = event.target.files[0];
                    setimage(file)
                    }}
                    />
                    <button className="rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={handleSubmit}
                    >Upload</button>
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

