import React, { useEffect, useState} from "react";
import Messages from './Messages'
import ChatInput from './ChatInput'
import {
  onSnapshot,
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


export default function Chat() {
  const { user, userInfo} = useAuth();
  const [receiver, setReceiver] = useState(null);

  useEffect( () => {
    const getChat = () => {
      const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
        if(doc.data().currentChat)
        {
          setReceiver(doc.data().currentChat.displayName);
        }
     
      });

      return () => {
        unsub();
      };
    };
    user.uid && getChat()
  }, [user.uid]);
  return (
    
    <div className='flex-2 basis-3/4 bg-orange-300 '>
        <div className=' h-12 bg-orange-700 flex items-center justify-between p-2  gap-2'>
          {!receiver&&<span>Receiver</span>}
          {receiver&&<span>{receiver}</span>}
            <div className='flex gap-2'>
                <img className='h-6 cursor-pointer'></img>
            </div>

        </div>
        <Messages/>
        <ChatInput/>

    </div>
  )
}

