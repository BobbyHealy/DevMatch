
import React, { useContext, useEffect, useState } from "react";
// import { doc, onSnapshot } from "firebase/firestore";

export default function Chats() {
    const [DMs, setDMs] = useState([]);
    const TestDM= {
        id: 113,
        messages: []
    }
    const currentUser = {
        id: 1,
        name: "Auden",
        imageUrl:
        "https://media.licdn.com/dms/image/C4D03AQHHZKUrMMhCsQ/profile-displayphoto-shrink_800_800/0/1610704750210?e=2147483647&v=beta&t=OHuErweO0MQ3CeXJlSKkBpu-FOxPQh1sjcuVOQVTZb8", 
    }
    // useEffect(() => {
    //     const getDMs = () => {
    //       const unsub = onSnapshot(doc(db, "userDMs", currentUser.id), (doc) => {
    //         setDMs(doc.data());
    //       });
    
    //       return () => {
    //         unsub();
    //       };
    //     };
    //     currentUser.id && getDMs();
    // }, [currentUser.id]
    // );
  
    // const handleSelect = (u) => {
    //   dispatch({ type: "CHANGE_USER", payload: u });
    // };
  return (
    
    <div className=''>
        {/* {Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map((chat) => (
        <div
            className="userChat"
            key={chat[0]}
            onClick={() => handleSelect(chat[1].userInfo)}
        >
            <img src={chat[1].userInfo.photoURL} alt="" />
            <div className="userChatInfo">
            <span>{chat[1].userInfo.displayName}</span>
            <p>{chat[1].lastMessage?.text}</p>
            </div>
        </div>
        ))} */}
        <div className='flex p-2 items-center gap-2 hover:bg-indigo-600'>
            <img src ="" className='bg-white h-6 w-6 rounded-full object-cover'></img>
            <div className='info'>
                <span className='text-lg font-medium'>User1</span>
                <p className='text-sm text-gray-100'>Latest Msg</p>
            </div>
 
        </div>
    </div>

  )
}
