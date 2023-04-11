import{ useEffect, useRef } from "react";
import { Timestamp } from "firebase/firestore";

import { useAuth } from "@/context/AuthContext";
import { unpinMsg } from "@/fireStoreBE/DmMsg";

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

  return (
    <div className="group">
        {<div className='flex-col mb-5  pr-6'> 
        <span className='text-yellow-300'>{message.senderId===user.uid?userInfo.name+" (You)": receiver.displayName}</span>
          <div>
            {diff<0&&<span className='text-xs text-gray-400 '>{date[0]}</span>}
            {diff>0&&<span className='text-xs text-gray-400 pl-2'>Today at</span>}
            <span className='text-xs text-gray-400 pl-1'>{time[0].trim()+":"+time[1]+" "+sign[1]}</span>
          </div>
          {console.log(message.senderId)}
          <div className=" flex place-content-center">
            <div>{message.img&&<img className=' w-60 object-cover' src={message.img}/>}</div>
          
          </div>
          {message.text&&<p className='text-white '>{message.text}</p>}  
          <div>
           {diff>0&&<span className='text-xs text-zinc-700 pl-2'>Pinned by</span>}
           <span className='text-xs text-zinc-700 pl-1'>{message.pinnedBy===user.uid?userInfo.name +" (You)": receiver.displayName }</span>
         </div>
          <div className="hidden group-hover:block text-red-900 hover:text-red-700"
          onClick={()=>unpinMsg(DMID,id)}>x</div>
        </div> 
        }
    </div>
    
  )
}

export default PinnedMsg