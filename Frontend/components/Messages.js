
import { useEffect, useState} from "react";

import {
  onSnapshot,
  doc,

} from "firebase/firestore";
import { db } from "@/config/firebase";
import Message from './Message'
export default function Messages({DMID}) {
    const [messages, setMessages] = useState([]);

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
