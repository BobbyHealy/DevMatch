import React, { useContext, useEffect, useState } from "react";
import SearchResult from "./SearchResult";

import {
    collection,
    query,
    getDocs,

  } from "firebase/firestore";
  import { db } from "@/config/firebase";
  import { useAuth } from "@/context/AuthContext";





export default function Searchbar({search}) {

    const {user, userInfo} = useAuth()
    const currentUser = {
        uid: user.uid,
        name: userInfo.name,
        photoURL: userInfo.profilePic, 
    }

  
    const [username, setUsername] = useState("")

    const [users, setUsers] = useState([])
    const [result, setResult] = useState(false)
    const [err, setErr] = useState(false)
    useEffect(() => {
      if(!search)
      {
        setUsername("")
        setUsers([])
        console.log("no search")
        setResult(false)
      }

    }, [search]);
    const handleSearch = async () => {
        const q = query(
          collection(db, "users")
        );
    
        try {
          const querySnapshot = await getDocs(q);
          console.log(Object.entries(querySnapshot.docs))
          var result =[]
          Object.entries(querySnapshot.docs).sort((a,b)=>{if(a[1].data().fileName<b[1].data().fileName){return -1}else{return 1}})
            .map((doc)=> (
              doc[1].data().displayName.toLowerCase().includes(username.toLowerCase())&& result.push(doc[1].data())
              ))
          
          setUsers(result)
          console.log(result)
          console.log(users)
        } catch (err) {
          setErr(true);
        }
      };
    const handleOnclick =()=>
    {
      setUsers([])
      console.log("set false")
      setResult(false)
    }
    const handleKey = async e=>{
        // setUser(null)

        if(username.trim())
        {
          console.log("set true")
          e.code ==="Enter" &&await handleSearch()
          setUsername("")
      
          setResult(true)
     
     
        }
        else
        {
          console.log("clear")
          setUsers([])
          setUsername("")
          setResult(false)
        }  
    }
  return (
    <div className='search '>
        <div className='searchForm p-2'>
            <input type="text" 
            className='bg-transparent rounded-lg border-none outline-none text-white placeholder-gray-300' 
            placeholder='Search for a user'
            onChange={e=>setUsername(e.target.value)}
            onKeyDown={handleKey}
            value={username}
            />
        </div>
        {/* {err && <span>User not found!</span>} */}

        {result&&<div className="border-b border-gray-800">
        {users.length>0?users&&users.map((u)=> (
              <div onClick={handleOnclick}>
              <SearchResult 
              key={u.uid} user2={u}/>
              {console.log(u)}
              </div>
              )):<span>User not found!</span>}
        </div>}
    </div>
  )
}
