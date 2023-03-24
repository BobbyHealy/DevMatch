import {useEffect, useRef } from "react";
import { Timestamp } from "firebase/firestore";


export default function GroupMessage({message }) {
    const ref = useRef(); 
    const date = message.date.toDate().toLocaleString('en-US').split(",")
    const time = date[1].split(":")
    const sign = time[2].split(" ")
    const today = new Date(Timestamp.now().toDate().toLocaleString('en-US').split(",")[0])
    const diff =(message.date.toDate()- today)
  
    
    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
      }, [message]);

  return (
    <div>
        <div className='flex mb-5 gap-5 '> 
            <div className='info flex flex-col text-gray-300 font-light'>
                {/* {<span className="w-12 h-12"> </span>} */}
                <img className='bg-white w-12 h-12 object-cover rounded-full' src={message.photoURL}/>

            </div>
            <div className='content flex flex-col max-w-[calc(90%)]'>
                <div>
                    <span className='text-orange-800'>{message.sender}</span>
                    {diff<0&&<span className='text-xs pl-2'>{date[0]}</span>}
                    {diff>0&&<span className='text-xs pl-2'>Today at</span>}
                    <span className='text-xs pl-1'>{time[0].trim()+":"+time[1]+" "+sign[1]}</span>
                </div>
                <img className='w-60 object-cover' src={message.img}/>
                {message.text&&<p className='text-black  max-w-max'>{message.text}</p>}  
            </div>
        </div> 
    </div>
    
  )
}

