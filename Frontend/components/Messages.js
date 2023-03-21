
import React, { useEffect, useState} from "react";

import {
  onSnapshot,
  doc,

} from "firebase/firestore";
import { db } from "@/config/firebase";
import { useAuth } from "@/context/AuthContext";
import Message from './Message'
export default function Messages() {
    const [messages, setMessages] = useState([]);
    const { user, userInfo} = useAuth();
    const [receiver, setReceiver] = useState(null);
    const [DMID, setDMID] = useState()

    useEffect( () => {
      const getChat = () => {
        const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
          setReceiver(doc.data().currentChat);
        });
        if (receiver)
        {
        }
        return () => {
          unsub();
        };
      };
      user.uid && getChat()


    }, [user.uid]);
  
    useEffect(() => {
      if(DMID){
        console.log(2)
        const unSub = onSnapshot(doc(db, "chats", DMID), (doc) => {
          doc.exists() && setMessages(doc.data().messages);
        });
        console.log(messages)
        return () => {
          unSub();
        };
      }

    }, [DMID]);
  return (
    
    <div className='bg-orange-500 text-gray-400 p-2 overflow-scroll h-[calc(100vh-231px)] '>
        {messages.map((m) => (
        <Message message={m} key={m.id} />
        ))}
    </div>
  )
}
