
import React, { useContext, useEffect, useState } from "react";
import { doc, onSnapshot,updateDoc,} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/config/firebase";


export default function Chats({search}) {
    const [chats, setChats] = useState([]);

    const { user, userInfo} = useAuth();
    const [reciever, setReceiver] =useState(null)
    const currentUser = {
        uid: user.uid,
        name: userInfo.name,
        imageUrl: userInfo.profilePic, 
    }
    useEffect( () => {
      const getChat = () => {
        const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
          if (doc.data()?.currentChat)
          {
            setReceiver(doc.data().currentChat.uid);
          }
        });
  
        return () => {
          unsub();
        };
      };
      user.uid && getChat()
    }, [user.uid]);
    
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
    <div>
    
    {!search?<div className='overflow-scroll h-[calc(100vh-166px)] lg:h-[calc(100vh-110px)]'>
        {reciever&&Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map((chat) => (
            chat[1].userInfo.uid===reciever?<div
            className='h-26 p-2 items-center gap-2 bg-gray-500'
            key={chat[0]}
            onClick={() => handleSelect(chat[1].userInfo)}
        >
          <div className="flex items-center flex-row gap-2">
              <img src={chat[1].userInfo.photoURL} className='bg-white h-10 w-10 rounded-full object-cover' alt="" />
              <div className="userChatInfo  w-[calc(246px)]">
                <span className='text-lg font-medium'>{chat[1].userInfo.displayName}</span>
                {console.log()}
                <p className='text-sm text-gray-100 truncate'>{chat[1].lastMessage?.text}</p>
                {!chat[1].lastMessage&&<p className='text-sm text-gray-400'>No Msg</p>}

                {chat[1].lastMessage?.img&&<p className='text-sm text-blue-300'>attached img</p>}
                <p className='text-xs text-gray-400'>{chat[1].date?.toDate().toLocaleString('en-US').split(",")[1].split(":")[0]+":"
                + chat[1].date?.toDate().toLocaleString('en-US').split(",")[1].split(":")[1]+" "
                +chat[1].date?.toDate().toLocaleString('en-US').split(",")[1].split(":")[2].split(" ")[1]}</p>
                <p className='text-xs text-gray-400'>{chat[1].date?.toDate().toLocaleString('en-US').split(",")[0]}</p>
              </div>
            </div>
        </div>:<div
            className='h-26  p-2 items-center gap-2 hover:bg-gray-500 '
            key={chat[0]}
            onClick={() => handleSelect(chat[1].userInfo)}
        >
          <div className="flex items-center flex-row gap-2">
            <img src={chat[1].userInfo.photoURL} className='bg-white h-10 w-10 rounded-full object-cover' alt="" />
            <div className="userChatInfo w-[calc(246px)]">
            <span className='text-lg font-medium'>{chat[1].userInfo.displayName}</span>
            {console.log()}
            <p className='text-sm text-gray-100 truncate'>{chat[1].lastMessage?.text}</p>
            {!chat[1].lastMessage&&<p className='text-sm text-gray-400'>No Msg</p>}


            {chat[1].lastMessage?.img&&<p className='text-sm text-blue-300'>attached img</p>}
            <p className='text-xs text-gray-400'>{chat[1].date?.toDate().toLocaleString('en-US').split(",")[1].split(":")[0]+":"
            + chat[1].date?.toDate().toLocaleString('en-US').split(",")[1].split(":")[1]+" "
            +chat[1].date?.toDate().toLocaleString('en-US').split(",")[1].split(":")[2].split(" ")[1]}</p>
            <p className='text-xs text-gray-400'>{chat[1].date?.toDate().toLocaleString('en-US').split(",")[0]}</p>
            </div>
            </div>
        </div>
        ))}
        
        {!reciever&&Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map((chat) => (
        <div
            className='h-26 p-2 items-center gap-2 hover:bg-gray-500'
            key={chat[0]}
            onClick={() => handleSelect(chat[1].userInfo)}
        >
          <div className="flex items-center flex-row gap-2">
            <img src={chat[1].userInfo.photoURL} className='bg-white h-10 w-10 rounded-full object-cover' alt="" />
            <div className="userChatInfo w-[calc(246px)]]">
            <span className='text-lg font-medium'>{chat[1].userInfo.displayName}</span>
            <p className='text-sm text-gray-100 truncate'>{chat[1].lastMessage?.text}</p>
            {!chat[1].lastMessage&&<p className='text-sm text-gray-400'>No Msg</p>}

            {chat[1].lastMessage?.img&&<p className='text-sm text-blue-300'>attached img</p>}
            <p className='text-xs text-gray-400'>{chat[1].date?.toDate().toLocaleString('en-US').split(",")[1].split(":")[0]+":"
            + chat[1].date?.toDate().toLocaleString('en-US').split(",")[1].split(":")[1]+" "
            +chat[1].date?.toDate().toLocaleString('en-US').split(",")[1].split(":")[2].split(" ")[1]}</p>
            <p className='text-xs text-gray-400'>{chat[1].date?.toDate().toLocaleString('en-US').split(",")[0]}</p>
            </div>
            </div>
        </div>
        ))}
    </div>: <div className='overflow-scroll h-[calc(100vh-299px)] lg:h-[calc(100vh-243px)]'>
        {reciever&&Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map((chat) => (
            chat[1].userInfo.uid===reciever?<div
            className='h-26 p-2 items-center gap-2 bg-gray-500'
            key={chat[0]}
            onClick={() => handleSelect(chat[1].userInfo)}
        >
          <div className="flex items-center flex-row gap-2">
              <img src={chat[1].userInfo.photoURL} className='bg-white h-10 w-10 rounded-full object-cover' alt="" />
              <div className="userChatInfo  w-[calc(246px)]">
                <span className='text-lg font-medium'>{chat[1].userInfo.displayName}</span>
                {console.log()}
                <p className='text-sm text-gray-100 truncate'>{chat[1].lastMessage?.text}</p>
                {!chat[1].lastMessage&&<p className='text-sm text-gray-400'>No Msg</p>}

                {chat[1].lastMessage?.img&&<p className='text-sm text-blue-300'>attached img</p>}
                <p className='text-xs text-gray-400'>{chat[1].date?.toDate().toLocaleString('en-US').split(",")[1].split(":")[0]+":"
                + chat[1].date?.toDate().toLocaleString('en-US').split(",")[1].split(":")[1]+" "
                +chat[1].date?.toDate().toLocaleString('en-US').split(",")[1].split(":")[2].split(" ")[1]}</p>
                <p className='text-xs text-gray-400'>{chat[1].date?.toDate().toLocaleString('en-US').split(",")[0]}</p>
              </div>
            </div>
        </div>:<div
            className='h-26  p-2 items-center gap-2 hover:bg-gray-500 '
            key={chat[0]}
            onClick={() => handleSelect(chat[1].userInfo)}
        >
          <div className="flex items-center flex-row gap-2">
            <img src={chat[1].userInfo.photoURL} className='bg-white h-10 w-10 rounded-full object-cover' alt="" />
            <div className="userChatInfo w-[calc(246px)]">
            <span className='text-lg font-medium'>{chat[1].userInfo.displayName}</span>
            {console.log()}
            <p className='text-sm text-gray-100 truncate'>{chat[1].lastMessage?.text}</p>
            {!chat[1].lastMessage&&<p className='text-sm text-gray-400'>No Msg</p>}


            {chat[1].lastMessage?.img&&<p className='text-sm text-blue-300'>attached img</p>}
            <p className='text-xs text-gray-400'>{chat[1].date?.toDate().toLocaleString('en-US').split(",")[1].split(":")[0]+":"
            + chat[1].date?.toDate().toLocaleString('en-US').split(",")[1].split(":")[1]+" "
            +chat[1].date?.toDate().toLocaleString('en-US').split(",")[1].split(":")[2].split(" ")[1]}</p>
            <p className='text-xs text-gray-400'>{chat[1].date?.toDate().toLocaleString('en-US').split(",")[0]}</p>
            </div>
            </div>
        </div>
        ))}
        
        {!reciever&&Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map((chat) => (
        <div
            className='h-26 p-2 items-center gap-2 hover:bg-gray-500'
            key={chat[0]}
            onClick={() => handleSelect(chat[1].userInfo)}
        >
          <div className="flex items-center flex-row gap-2">
            <img src={chat[1].userInfo.photoURL} className='bg-white h-10 w-10 rounded-full object-cover' alt="" />
            <div className="userChatInfo  w-[calc(246px)]">
            <span className='text-lg font-medium'>{chat[1].userInfo.displayName}</span>
            <p className='text-sm text-gray-100 truncate'>{chat[1].lastMessage?.text}</p>
            {!chat[1].lastMessage&&<p className='text-sm text-gray-400'>No Msg</p>}

            {chat[1].lastMessage?.img&&<p className='text-sm text-blue-300'>attached img</p>}
            <p className='text-xs text-gray-400'>{chat[1].date?.toDate().toLocaleString('en-US').split(",")[1].split(":")[0]+":"
            + chat[1].date?.toDate().toLocaleString('en-US').split(",")[1].split(":")[1]+" "
            +chat[1].date?.toDate().toLocaleString('en-US').split(",")[1].split(":")[2].split(" ")[1]}</p>
            <p className='text-xs text-gray-400'>{chat[1].date?.toDate().toLocaleString('en-US').split(",")[0]}</p>
            </div>
            </div>
        </div>
        ))}
    </div>}
    </div>

  )
}
