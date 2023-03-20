import React, { useContext, useEffect, useState } from "react";

import {
    collection,
    query,
    where,
    getDocs,
    setDoc,
    doc,
    updateDoc,
    serverTimestamp,
    getDoc,
  } from "firebase/firestore";
  import { db } from "@/config/firebase";
  import { useAuth } from "@/context/AuthContext";




export default function Searchbar() {

    const {user, userInfo} = useAuth()
    const currentUser = {
        uid: user.uid,
        name: userInfo.name,
        profilePic: userInfo.profilePic, 
    }
    const TestDM= {
        id: 113,
        messages: []
    }
    const[DMs, setDMs] = useState(null)
    const [username, setUsername] = useState("")

    const [user2, setUser] = useState(null)
    const [err, setErr] = useState(false)
    const handleSearch = async () => {
        const q = query(
          collection(db, "users"),
          where("displayName", "==", username)
        );
    
        try {
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            setUser(doc.data());
          });
        } catch (err) {
          setErr(true);
        }
      };
    const handleKey = e=>{
        setUser(null)
        e.code ==="Enter" &&handleSearch(); 
    }
    const handleSelect = async()=>{
        //check whether the group(chats in firestore) exists, if not create
        const combinedId =
        currentUser.uid > user2.uid
        ? currentUser.uid + user2.uid
        : user2.uid + currentUser.uid;
        try {
            const res = await getDoc(doc(db, "chats", combinedId));

            if (!res.exists()) {
            //create a chat in chats collection
            await setDoc(doc(db, "chats", combinedId), { messages: [] });

            //create user2 chats
            await updateDoc(doc(db, "userChats", currentUser.uid), {
                [combinedId + ".userInfo"]: {
                uid: user2.uid,
                displayName: user2.displayName,
                photoURL: user2.photoURL,
                },
                [combinedId + ".date"]: serverTimestamp(),
            });

            await updateDoc(doc(db, "userChats", user2.uid), {
                [combinedId + ".userInfo"]: {
                uid: currentUser.uid,
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
                },
                [combinedId + ".date"]: serverTimestamp(),
            });
            }
        } catch (err) {}
        setUser(null)
        setUsername("")
        

    }
    

    

  return (
    <div className='search border-b-2 border-gray-400'>
        <div className='searchForm p-2'>
            <input type="text" 
            className='bg-transparent border-none outline-none text-white placeholder-gray-300' 
            placeholder='Search for a user'
            onChange={e=>setUsername(e.target.value)}
            onKeyDown={handleKey}
            value={username}
            />
        </div>
        {err && <span>User not found!</span>}
        {user2&&<div className='userChat flex p-2 items-center gap-2 hover:bg-indigo-600'
        onClick={handleSelect}
        >
            <img src ={user2.photoURL} className='bg-white h-6 w-6 rounded-full'></img>
            <div className='info'>
                <span className='text-lg font-medium'>{user2.displayName}</span>
            </div>
 
        </div>}
    </div>
  )
}
