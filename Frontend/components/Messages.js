import React, { useContext, useEffect, useState } from "react";
// import { doc, onSnapshot } from "firebase/firestore";
import Message from './Message'
export default function Messages() {
    const [messages, setMessages] = useState([]);
    // fetchin DMs from firebase
    // const { data } = useContext();
  
    // useEffect(() => {
    //   const unSub = onSnapshot(doc(db, "DMs", data.chatId), (doc) => {
    //     doc.exists() && setMessages(doc.data().messages);
    //   });
  
    //   return () => {
    //     unSub();
    //   };
    // }, [data.chatId]);
  return (
    
    <div className='bg-orange-500 text-gray-400 p-2 overflow-scroll h-[calc(100vh-231px)] '>
        {/* {messages.map((m) => (
        <Message message={m} key={m.id} />
        ))} */}

        <Message/>

    </div>
  )
}
