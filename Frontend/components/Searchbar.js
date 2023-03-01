import React, { useContext, useEffect, useState } from "react";
// import {
//     collection,
//     query,
//     where,
//     setDoc,
//     doc,
//     updateDoc,
//     serverTimestamp,
//     getDoc,
//   } from "firebase/firestore";


export default function Searchbar() {
    const currentUser = {
        id: 1,
        name: "Auden",
        imageUrl:
        "https://media.licdn.com/dms/image/C4D03AQHHZKUrMMhCsQ/profile-displayphoto-shrink_800_800/0/1610704750210?e=2147483647&v=beta&t=OHuErweO0MQ3CeXJlSKkBpu-FOxPQh1sjcuVOQVTZb8", 
    }
    const users= {
        id: 13,
        name: "Henry",
        imageUrl:
        "https://media.licdn.com/dms/image/C4D03AQHHZKUrMMhCsQ/profile-displayphoto-shrink_800_800/0/1610704750210?e=2147483647&v=beta&t=OHuErweO0MQ3CeXJlSKkBpu-FOxPQh1sjcuVOQVTZb8",
    }
    const TestDM= {
        id: 113,
        messages: []
    }
    const[DMs, setDMs] = useState(null)
    const [username, setUsername] = useState("")

    const [user, setUser] = useState(null)
    const [err, setErr] = useState(false)
    const handleSearch =() =>{
        // const q = query(
        //     collection(db,"users"),
        //     where("name", "==", username)

        // );
        // const querySnapshot = await getDocs(q);
        // querySnapshot.forEach((doec)=>{
        //     setUser(doc.data)
        // })
        try{
            if (username === users.name)
            {
                setUser(users)
            }
        }
        catch(err){
            setErr(true)
        }
    };
    const handleKey = e=>{
        setUser(null)
        e.code ==="Enter" &&handleSearch(); 
    }
    const handleSelect = async()=>{
    //  Check whether the DM exist in the firebase. if not create new one
        const combinedID = currentUser.id< user.id? currentUser.id + user.id: user.id+currentUser.id
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
        try{
            if (combinedID === TestDM.id)
            {
                setDMs(TestDM)
            }

        }catch(err)
        {

        }
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
        {user&&<div className='userChat flex p-2 items-center gap-2 hover:bg-indigo-600'
        onClick={handleSelect}
        >
            <img src ={user.imageUrl} className='bg-white h-6 w-6 rounded-full'></img>
            <div className='info'>
                <span className='text-lg font-medium'>{user.name}</span>
                <p className='text-sm text-gray-100'>Latest Msg</p>
            </div>
 
        </div>}
    </div>
  )
}
