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
          var result =[]
          Object.entries(querySnapshot.docs).sort((a,b)=>{if(a[1].data().fileName<b[1].data().fileName){return -1}else{return 1}})
            .map((doc)=> {
              if(doc[1].data().displayName.toLowerCase().includes(username.toLowerCase().trim()))
              {
                if(doc[1].data().uid!==user.uid){
                  result.push(doc[1].data())
                }
              }
            })
          
          setUsers(result)
        } catch (err) {
          console.log(err)
          setErr(true);
        }
      };
    const handleOnclick =()=>
    {
      setUsers([])
      console.log("set false")
      setUsername("")
      setResult(false)
    }
    const handleKey = async e=>{
        // setUser(null)
        if(e.code ==="Enter")
        {
          await handleSearch()
          if (username.trim())
          {
            setResult(true)
          }
        }
        else
        {
          setUsers([])  
          setResult(false)
        }  
    }
  return (
    <div className='search '>
        <div className='searchForm p-2'>
            <input type="text" 
            className='bg-transparent h-10 rounded-lg border-none outline-none text-white placeholder-gray-300 w-full' 
            placeholder='Search for a user'
            onChange={e=>setUsername(e.target.value)}
            onKeyDown={handleKey}
            value={username}
            />
        </div>
        {/* {err && <span>User not found!</span>} */}
        
        {result?search&&<div className="border-b border-gray-800 h-[calc(133px)] overflow-scroll">
        {users.length>0?users&&users.map((u)=> (
              <div onClick={handleOnclick}>
              <SearchResult 
              key={u.uid} user2={u}/>
              </div>
              )):<div className="border-b border-gray-800 h-[calc(133px)] items-center p-10 pl-14">User not found!</div>}
        </div>:search&&<div className="border-b border-gray-800 h-[calc(133px)] items-center p-10">Press Enter to Search</div>}
    </div>
  )
}
