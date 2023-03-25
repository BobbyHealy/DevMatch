import  { useEffect, useState} from "react";
import Messages from './Messages'
import ChatInput from './ChatInput'
import {
  onSnapshot,
  doc,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { useAuth } from "@/context/AuthContext";


export default function Chat() {
  const { user, userInfo} = useAuth();
  const [receiver, setReceiver] = useState(null);
  const [DMID, setDMID] = useState()

  useEffect( () => {
    const getChat = () => {
      const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
        if(doc.data().currentChat)
        {
          setReceiver(doc.data().currentChat);
        }
     
      });

      return () => {
        unsub();
      };
    };
    user.uid && getChat()
  }, [user.uid]);
  useEffect(() => {
    if (receiver)
    {
      const dmID =  user.uid > receiver.uid
      ? user.uid + receiver.uid
      : receiver.uid + user.uid;
    setDMID(dmID);
    }
  }, [receiver]);
  return (
    
    <div className='flex-2 basis-3/4 bg-orange-300 '>
        <div className=' h-12 bg-orange-700 flex items-center justify-between p-2  gap-2'>
          {!receiver&&<span>Receiver</span>}
          {receiver&&<span>{receiver.displayName}</span>}
            <div className='flex gap-2'>
                <img className='h-6 cursor-pointer'></img>
            </div>

        </div>
        {<Messages DMID={DMID}/>}
        <ChatInput DMID={DMID} receiver ={receiver}/>

    </div>
  )
}

