import{ useState, useEffect, useRef } from "react";
import { Timestamp } from "firebase/firestore";
import {
    doc,
    updateDoc,
    deleteDoc
  } from "firebase/firestore";
  
  import { db } from "@/config/firebase";
import { useAuth } from "@/context/AuthContext";
import { 
  XMarkIcon
} from '@heroicons/react/20/solid'

function PinnedMsg({DMID, id, message, receiver}) {
  const ref = useRef(); 
  const date = message.date.toDate().toLocaleString('en-US').split(",")
  const time = date[1].split(":")
  const sign = time[2].split(" ")
  const today = new Date(Timestamp.now().toDate().toLocaleString('en-US').split(",")[0])
  const diff =(message.date.toDate()- today)
    
    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
      }, [message]);
    const { user, userInfo} = useAuth();
    const handleUnpin = async () =>
    {
      updateDoc(doc(db, "chats", DMID, "messages", id),
      {
        pinned: false
      })
      deleteDoc(doc(db, "chats", DMID, "pinnedMsg", id))
    }

  return (
    <div className="group">
        {/* if it is receiver */}
        {<div className='flex-col mb-5  '> 
        <span className='text-yellow-300'>{message.senderId===user.uid?userInfo.name: receiver.displayName}</span>
    
          <div>
            {diff<0&&<span className='text-xs text-gray-400 pl-2'>{date[0]}</span>}
            {diff>0&&<span className='text-xs text-gray-400 pl-2'>Today at</span>}
            <span className='text-xs text-gray-400 pl-1'>{time[0].trim()+":"+time[1]+" "+sign[1]}</span>
          </div>
          {console.log(message.senderId)}
          {message.img&&<img className='w-60 object-cover' src={message.img}/>}
          {message.text&&<p className='text-white '>{message.text}</p>}  
          <div>
           {diff>0&&<span className='text-xs text-zinc-700 pl-2'>Pinned by</span>}
           <span className='text-xs text-zinc-700 pl-1'>{message.pinnedBy===user.uid?userInfo.name: receiver.displayName }</span>
         </div>
         <div className="pl-[calc(344px)]">
          <XMarkIcon className="hidden group-hover:block h-5 w-5 text-red-900 hover:text-red-700"
          onClick={handleUnpin}
          />
          </div>
        </div> 
        }
    </div>
    
  )
}

export default PinnedMsg