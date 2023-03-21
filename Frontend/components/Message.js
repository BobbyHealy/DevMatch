import React, { useState, useEffect, useRef } from "react";

import {
    onSnapshot,
    doc,
  
  } from "firebase/firestore";
  import { db } from "@/config/firebase";
import { useAuth } from "@/context/AuthContext";

export default function Message({ message }) {
    const ref = useRef(); 
    const date = message.date.toDate().toLocaleString('en-US').split(",")
    const time = date[1].split(":")
    const sign = time[2].split(" ")
    
    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
      }, [message]);
    const { user, userInfo} = useAuth();
    const currentUser = {
        uid: user.uid,
        name: userInfo.name,
        photoURL: userInfo.profilePic, 
    }
    const [receiver, setReceiver] = useState(null);

    useEffect( () => {
      const getChat = () => {
        const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
          setReceiver(doc.data().currentChat);
        });
        return () => {
          unsub();
        };
      };
      user.uid && getChat()
    }, [user.uid]);
  return (
    <div>
        {/* if it is receiver */}
        { message.senderId !== currentUser.uid&&<div className='flex mb-5 gap-5 '> 
            <div className='info flex flex-col text-gray-300 font-light'>
                {receiver&&<img className='bg-white w-10 h-10 object-cover rounded-full' src={receiver.photoURL}/>}
                <span className='text-sm'>{time[0].trim()+":"+time[1]+" "+sign[1]}</span>
                <span className='text-sm'>{date[0]}</span>
            </div>
            <div className='content flex flex-col gap-2 max-w-[calc(70%)]'>
                <img className='w-1/2 object-cover' src={message.img}/>
                {message.text&&<p className='bg-orange-100 text-black rounded-tl-none rounded-lg px-4 py-2 max-w-max'>{message.text}</p>}
                
            </div>
            {/* <div className='content flex flex-col gap-2 max-w-[calc(80%)]'>
              <div className="bg-orange-100 text-black rounded-tl-none rounded-lg">

                {message.text&&<p className=' px-4 py-2 max-w-max'>{message.text}</p>}
                <img className='w-1/2' src={message.img}/>
              </div>
            </div> */}

        </div> }
        {/* if it is sender */}
        {message.senderId === currentUser.uid&&<div className='flex mb-5 gap-5 flex-row-reverse'> 
            <div className='info flex flex-col text-gray-300 font-light items-end'>
                <img className='bg-white w-10 h-10 object-cover rounded-full' src={currentUser.photoURL}/>
                <span className='text-sm'>{time[0].trim()+":"+time[1]+" "+sign[1]}</span>
                <span className='text-sm'>{date[0]}</span>
            </div>
            <div className='content flex flex-col items-end gap-2 max-w-[calc(70%)]'>
              <img className='w-1/2 object-cover' src={message.img}/>
              {message.text&&<p className='bg-blue-300 text-black rounded-tr-none rounded-lg px-4 py-2 max-w-max'>{message.text}</p>}
                
            </div>
            {/* <div className='content flex flex-col items-end gap-2 max-w-[calc(80%)]'>
              <div className="bg-blue-300 text-black rounded-tr-none rounded-lg px-4 py-2">
                {message.img&&<img className='w-40 h-45 object-cover items-end' src={message.img}/>}
                {message.text&&<p className='max-w-max'>{message.text}</p>}
                </div>
            </div> */}
        </div>}
    </div>
    
  )
}

