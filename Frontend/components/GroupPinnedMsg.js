import {useEffect, useRef} from "react";
import { unpinMsg } from '@/fireStoreBE/GCText';
import { Timestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";


function GroupPinnedMsg({pid,channel, message, id}) {

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
    <div className="group hover:bg-zinc-900 mr-8">
        <div className='flex mb-5 gap-5 w-[calc(95%)]'> 
            <div className='info flex flex-col text-gray-300 font-light'>
                <img className='bg-white w-12 h-12 object-cover rounded-full' src={message.photoURL}/>

            </div>
            <div className='content flex flex-col  w-[calc(90%-40px)]'>
                <div className="flex content-start items-center pb-1">
                    <span className='text-yellow-300'>{message.senderID===user.uid?message.sender+" (You)":message.sender}</span>
                    {diff<0&&<span className='text-xs text-white pl-2'>{date[0]}</span>}
                    {diff>0&&<span className='text-xs text-white pl-2'>Today at</span>}
                    <span className='text-xs pl-1 text-white'>{time[0].trim()+":"+time[1]+" "+sign[1]}</span>
                </div>
                <img className='w-60 object-cover' src={message.img}/>
                {message.text&&<p className='text-white  max-w-max'>{message.text}</p>}
                <div className="flex content-start items-center pb-1">
                <span className="text-orange-600">Pinned by {message.pinner.id===user.uid?message.pinner.name+" (You)": message.pinner.name}</span>
                </div>
            </div>
            <div className="hidden group-hover:block pr-0 ml-auto text-lg text-red-900 hover:text-red-700 "
                onClick={()=>unpinMsg(pid,channel,id)}>x
          </div>
        </div>
    </div>
    
  )
}

export default GroupPinnedMsg