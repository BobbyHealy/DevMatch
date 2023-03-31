import { useEffect, useState} from "react";
import Router from "next/router";
import {
  onSnapshot,
  doc,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import GroupMessage from './GroupMessage';


export default function GroupMessages({channel}) {
  const [messages, setMessages] = useState([]);
  const {pid}= Router.query;
  useEffect(() => {
    if(pid){
      const unSub = onSnapshot(doc(db, "GCs", pid, "channels", channel), (doc) => {
        doc.exists() && setMessages(doc.data().messages);
      });
      return () => {
        unSub();
      };
    }
  }, [channel]);
  return (
    <div className='bg-gray-600 text-gray-400 p-2 overflow-scroll h-[calc(100vh-166px)] lg:h-[calc(100vh-110px)]  '>
       {messages.map((m) => 
        (
          <GroupMessage message={m} key={m.id} />
        ))}
    </div> 
  )
}

