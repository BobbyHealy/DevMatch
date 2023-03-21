
import React, { useContext, useEffect, useState } from "react";
import { doc, onSnapshot,updateDoc,} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/config/firebase";


export default function Chats() {
    const [chats, setChats] = useState([]);

    const { user, userInfo} = useAuth();
    const currentUser = {
        uid: user.uid,
        name: userInfo.name,
        imageUrl: userInfo.profilePic, 
    }
    
    useEffect(() => {
      const getChats = () => {
        const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
          setChats(doc.data());
        });
  
        return () => {
          unsub();
        };
      };
  
      currentUser.uid && getChats();
    }, [currentUser.uid]);

    const handleSelect = async (data) => {
        
        await updateDoc(doc(db, "users", currentUser.uid), {
            currentChat:data
        });
        console.log(data)
    };
  return (
    
    <div className=''>
        {Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map((chat) => (
        <div
            className='flex p-2 items-center gap-2 hover:bg-indigo-600'
            key={chat[0]}
            onClick={() => handleSelect(chat[1].userInfo)}
        >
            <img src={chat[1].userInfo.photoURL} className='bg-white h-10 w-10 rounded-full object-cover' alt="" />
            <div className="userChatInfo">
            <span className='text-lg font-medium'>{chat[1].userInfo.displayName}</span>
            {console.log()}
            {chat[1].lastMessage?.text.length<28&&<p className='text-sm text-gray-100'>{chat[1].lastMessage?.text}</p>}
            {chat[1].lastMessage?.text.length>28&&<p className='text-sm text-gray-100'>{chat[1].lastMessage?.text.substring(0,28)} ...</p>}


            {chat[1].lastMessage?.img&&<p className='text-sm text-blue-300'>attached img</p>}
            <p className='text-xs text-gray-400'>{chat[1].date?.toDate().toLocaleString('en-US').split(",")[1].split(":")[0]+":"
            + chat[1].date?.toDate().toLocaleString('en-US').split(",")[1].split(":")[1]+" "
            +chat[1].date?.toDate().toLocaleString('en-US').split(",")[1].split(":")[2].split(" ")[1]}</p>
            <p className='text-xs text-gray-400'>{chat[1].date?.toDate().toLocaleString('en-US').split(",")[0]}</p>
            </div>
        </div>
        ))}
        {/* <div className='flex p-2 items-center gap-2 hover:bg-indigo-600'>
            <img src ="" className='bg-white h-6 w-6 rounded-full object-cover'></img>
            <div className='info'>
                <span className='text-lg font-medium'>User1</span>
                <p className='text-sm text-gray-100'>Latest Msg</p>
            </div>
 
        </div> */}
    </div>

  )
}
